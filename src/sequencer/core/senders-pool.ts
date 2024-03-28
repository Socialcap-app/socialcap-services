/**
 * A pool of Sender accounts used by the dispatchers to sign transactions.
 * 
 * Before dispatching a new transaction, we need to assign a Sender to the 
 * queue. The sender will be attached to this queue until the transaction is 
 * completed (failure or success). After that if will be available again.
 * 
 * Each Sender has a remote worker to which it is binded, so all transactions
 * that will be signed by this sender will be processed by the same worker.
 * 
 * If we have no available sender (that is all senders have been assigned to 
 * some queue) we can not dispatch it and we remain WAITING.
 * 
 * WHY ? Having a pool of senders allows us to send more than one transaction
 * per block. The MINA limit is one transaction per block per account, so by
 * having multiple senders we allow simultaneous transactions processing only
 * limited by the senders count.
 * 
 * NOTE: Transactions in the same queue will be processed in the order they 
 * were added to the queue, so this pool **only allows parallel execution of
 * different queues**.
 * 
 * NOTE: In fact, the Sender state is really the state of the Queue which has 
 * blocked this sender for its own use.
 */
import { spawn } from "child_process";
import { kill} from "process";
import { KVS } from "./kv-store.js";
import { SequencerLogger as log } from "./logs.js";

export { Sender, SendersPool }


interface Sender {
  accountId: string;
  secretKey: string;
  workerUrl: string; // the worker/dispatcher url
  queue: string; // must be NO_QUEUE if not assigned 
  state: number; // FREE, BLOCKED, RETRY, DELAY, INCLUSION, WAITING_INCLUSION
  retries: number;
  pid: string; // the ProcessID of the worker
}

const POOL_STATE_KEY = "senders-pool-state";

const NO_QUEUE = "-"; // marks an unassigned queue

export const // Sender queue states
  FREE = 201,
  BLOCKED = 202,
  MUST_RETRY = 203,
  RETRYING = 204,
  MUST_INCLUDE = 205,
  WAITING_INCLUSION = 206;

  
class SendersPool {
  // The senders pool for now is an array. It should be a Map, BUT will
  // leave this as an Array for now, because the pool will not be usually 
  // very big (~100 items max) and traversing it is not very costly compared
  // to other Sequencer and Dispatcher timings.
  static _pool: Sender[] = [];

  static getAvailableSender(): Sender | null {
    let freeSenders = SendersPool._pool.filter((sender) => {
      return (sender.queue === NO_QUEUE)
    })
    return freeSenders.length > 0 ? freeSenders[0] : null;
  }

  static blockSender(unblocked: Sender, queue: string) {
    SendersPool._pool.map((sender, index) => {
      if (sender.accountId === unblocked.accountId) {
        SendersPool._pool[index] = Object.assign(SendersPool._pool[index], {
          queue: queue,
          state: BLOCKED, 
          retries: 0
        }); 
        SendersPool.savePoolState();
      }
    })
  }

  static getBlockedSender(queue: string): Sender | null {
    for (let j=0; j < SendersPool._pool.length; j++) {
      let sender = SendersPool._pool[j];
      if (sender.queue === queue)
        return sender;
    }
    return null;
  }

  static freeSender(queue: string) {
    SendersPool._pool.map((sender, index) => {
      if (sender.queue === queue) {
        SendersPool._pool[index] = Object.assign(SendersPool._pool[index], {
          queue: NO_QUEUE,
          state: FREE, 
          retries: 0
        }); 
      }
    })
    SendersPool.savePoolState();
  }

  static changeSenderState(queue: string, state: number) {
    let sender = SendersPool.getBlockedSender(queue);
    if (! sender) return;   
    if (state === MUST_RETRY) sender.retries++;
    sender.state = state;
    SendersPool.updateSender(sender);
    SendersPool.savePoolState();
  }

  static findSender(accountId: string): Sender | null {
    for (let j=0; j < SendersPool._pool.length; j++) {
      let sender = SendersPool._pool[j];
      if (sender.accountId === accountId)
        return sender;
    }
    return null;
  }

  static updateSender(updatedSender: Sender) {
    for (let j=0; j < SendersPool._pool.length; j++) {
      let sender = SendersPool._pool[j];
      if (sender.accountId === updatedSender.accountId)
        return SendersPool._pool[j] = updatedSender;
    }
    return null;
  }

  /** 
   * Add a Sender to the pool. 
   * The pool is created when the Sequencer is started and so the pool will 
   * not change along the lifetime of a given running Sequencer.  
   */
  static addSender(
    accountId: string, 
    secretKey: string, 
    workerUrl: string
  ) {
    SendersPool._pool.push({
      accountId: accountId,
      secretKey: secretKey,
      workerUrl: workerUrl,
      queue: NO_QUEUE,
      state: FREE,
      retries: 0,
      pid: ''
    })
  }

  /**
   * Restore pool state from the persistent store (LMDB).
   * 
   * We only need to update senders which are in the current pool, we just 
   * discard stored senders that have been evicted from the pool.
   * 
   * This hapens because the Sequencer could have been restarted with a 
   * new/different set of senders: some of them can be in store, some of 
   * them are new ones not currently in store, and some of then are in the
   * store but not in the new pool.
   */
  static restorePoolState() {
    // get all senders in KVStore
    let storedSenders: Sender[] = KVS.get(POOL_STATE_KEY) || [];

    storedSenders.forEach((sender) => {
      if (SendersPool.findSender(sender.accountId)) {
        // need to force waiting and retrying again, since we are bootstraping from
        // previous state, and it needs to be restarted for the queue
        sender.state = sender.state === WAITING_INCLUSION ? MUST_INCLUDE : sender.state;
        sender.state = sender.state === RETRYING ? MUST_RETRY : sender.state;

        // it already exists in the pool, must update the pool
        this.updateSender(sender);
      }
      // if not in current pool, just ignore it. The stored state will be 
      // updated later by other methods ...
      log.info(`SendersPool ${sender.accountId} ${sender.queue} ${sender.state} ${sender.workerUrl}`);
    })
  }

  /** 
   * We save the full current state of the pool in persistent store.
   * We need to do this after any changes to the pool state, in particular
   * when a Sender is blocked or freed. 
  */
  static savePoolState() {
    KVS.put(POOL_STATE_KEY, this._pool);
  }

  /**
   * Spawn and kill workers
   * We spawn a worker for each sender on startup.
   * We kill it and restart when not responding.
   */
  static async spawnWorker(sender: Sender) {
    let port = sender.workerUrl.split(':')[2];

    const child: any = await spawn('node', ['build/src/main-dispatcher.js', port], {
      stdio: 'inherit',
      detached: true
    });

    child.on('spawn', (success: any) => {
      sender.pid = child.pid.toString();
      child.unref();
      log.info(`Worker id=${sender.accountId} started, pid=${sender.pid}`);
      SendersPool.updateSender(sender);
      SendersPool.savePoolState();
    });

    child.on('error', (err: any) => {
      log.error(`Could not start worker id='${sender.accountId}'. Spawn failed, reason=`+err);
      sender.pid = '';
      SendersPool.updateSender(sender);
      SendersPool.savePoolState();
    });
  }

  static async restartWorker(accountId: string) {
    let sender = SendersPool.findSender(accountId); 
    if (! sender) throw new Error(`Could not kill worker id='${accountId}'. No sender in pool.`);
    try {
      if (sender.pid) kill(Number(sender.pid));
    }
    catch (err) {
      log.error(`Could not kill worker pid='${sender.pid}', reason=`+err)
    }
    setTimeout(async () => {
      await SendersPool.spawnWorker(sender!);
    }, 500)
  }

  static async startAllWorkers() {
    // first kill any already running worker
    SendersPool.killAllWorkers();
    // now start all of them
    for (let j=0; j < SendersPool._pool.length; j++) {
      let sender = SendersPool._pool[j];
      await SendersPool.spawnWorker(sender);
    }
  }

  static killAllWorkers() {
    for (let j=0; j < SendersPool._pool.length; j++) {
      let sender = SendersPool._pool[j];
      try {
        if (sender.pid) {
          kill(Number(sender.pid));
          sender.pid = '';
          SendersPool.updateSender(sender);
        }
      }
      catch (err) {
        log.error(`Could not kill worker pid='${sender.pid}', reason=`+err)
      }
    }
  }

};
