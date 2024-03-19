import { TransactionsQueue, TxnResult, RawTxnData } from "./transaction-queues.js";
import { WAITING, RETRY, REVISION, DISPATCHING, MAX_RETRIES } from "./transaction-queues.js";
import { SequencerLogger as log } from "./logs.js";
import { DispatcherProxy } from "./dispatcher-proxy.js";
import { Sender, SendersPool } from "./senders-pool.js";
import { MUST_RETRY, RETRYING, MUST_INCLUDE, WAITING_INCLUSION } from "./senders-pool.js"
import { UNRESOLVED_ERROR, WORKER_ERROR, hasException } from "./error-codes.js";

export { Sequencer };

class Sequencer {

  private static _queues = new Map<string, TransactionsQueue>;

  // The set of Dispatchers used to submit transactions or actions
  // for a given type. There is one (and only one) Dispatcher per type.
  private static _dispatchers = new Map<string, DispatcherProxy>;

  private static RETRY_DELAY = 3*60000; // 3 minutes

  // $TODO$ analyze this Timeout as some Proves may take a long time 
  private static DISPATCH_TIMEOUT = 10*60000; // 10 minutes 

  public static getQueue(name: string): TransactionsQueue {
    return Sequencer._queues.get(name) as TransactionsQueue;
  }  

  public static getDispatcher(type: string): DispatcherProxy {
    return Sequencer._dispatchers.get(type) as DispatcherProxy;
  }  

  /**
   * Runs a sequncer cycle. This is controlled by an external scheduler
   * which calls it ever N seconds.
   */
  static async run() {
    // get the running queues list
    let names = [...Sequencer._queues.keys()]; 

    for (let j=0; j < names.length; j++) {
      let queue = Sequencer.getQueue(names[j]);

      // is there a blocked Sender attached to this queue ?
      let sender = SendersPool.getBlockedSender(queue.name());

      // get the first running transaction [WAITING, REVISION, RETRY]
      let runningTxn = await queue.getRunningTransaction();
      log.activeQueue(queue, runningTxn, sender);

      // if no transaction BUT we have a blocked sender, must release it
      if (!runningTxn && sender)
        SendersPool.freeSender(queue.name());

      // if there is no transaction and no blocked sender, just continue
      if (!runningTxn)
        continue;

      // now we check if we need a sender, or if we already have one 
      if (!sender) { 
        // need  a free sender so we can dispatch it 
        sender = SendersPool.getAvailableSender();
        if (!sender) 
          // if no sender available (all senders are taken)
          // we need to continue till we can get an available sender
          continue        

        // we have an available sender ! 
        // first block it now so nobody else can take it
        SendersPool.blockSender(sender, queue.name());
      }  

      if (runningTxn?.state === WAITING) {
        Sequencer.dispatch(runningTxn, queue, sender);
        continue;
      }

      if (runningTxn?.state === DISPATCHING) {
        // we just wait for the dispatcher to return or Timeout
        Sequencer.waitDispatcher(runningTxn, queue, sender);
        continue;
      }

      if (runningTxn?.state === REVISION) {
        // we wait for the transaction to be included or Failed
        Sequencer.waitCompletion(runningTxn, queue, sender);
        continue;
      }

      if (runningTxn?.state === RETRY) {
        // we wait some time before doing the retry 
        Sequencer.waitRetry(runningTxn, queue, sender);
        continue;
      }
    }

    return Sequencer;
  }


  /**
   * Dispatch the transaction pending on this queue. It has to deal with the 
   * different states: WAITING, REVISION, DONE, FAILED, RETRY
   */
  static async dispatch(
    txn: RawTxnData,
    queue: TransactionsQueue,
    sender: Sender,
    retrying = false 
  ) {
    const dispatcher = Sequencer.getDispatcher(txn.type);

    // No dispatcher for this type, cant do anything
    if (! dispatcher) {
      log.error(`Sequencer.dispatch No dispatcher for this type=${txn.type}`)
      SendersPool.freeSender(queue.name());
      return; 
    }
    
    // now we can dispatch
    await queue.markDispatchingTransaction(txn.uid);
    log.info(`Sequencer.dispatch queue=${sender.queue} worker=${sender.workerUrl} txn=${JSON.stringify(txn)}`)
    let result = await dispatcher.dispatch(txn, sender); 

    log.result(`Sequencer.dispatch queue=${sender.queue}`, result); 

    // WORKER_ERROR: either we can not connect to worker or the network is down 
    // or there is something that does not allow us to call the worker
    if (result.error?.code === WORKER_ERROR) {
      // we dont change the transaction state so we can
      // continue trying till worker is available again
      // but we release the queue so it does not remain blocked
      if (!retrying) await queue.markWaitingTransaction(txn.uid);
      if (retrying) await queue.markRetryingTransaction(txn.uid);
      SendersPool.freeSender(queue.name());
      return;
    }

    // UNSOLVED: there is some irrecoverable error (possibly because some 
    // coding problem or bad configuartion) and we can do nothing 
    if (result.error?.code === UNRESOLVED_ERROR) {
      let unresolvedTxn = await queue.closeUnresolvedTransaction(txn.uid, result);
      SendersPool.freeSender(queue.name());
      return;
    }

    // check if we have retries left !
    if (result?.error && sender.retries >= MAX_RETRIES) {
      let failedTxn = await queue.closeFailedTransaction(txn.uid, result);
      failedTxn.data = JSON.parse(failedTxn.data);
      await dispatcher.onFailure({
          uid: failedTxn.uid,
          type: failedTxn.type,
          data: JSON.parse(failedTxn.data)
        }, result, sender
      );
      SendersPool.freeSender(queue.name());
      return;
    }

    // maybe is a Txn error, and we can retry the Txn
    if (result.error) {
      let retryTxn = await queue.retryTransaction(txn.uid);
      SendersPool.changeSenderState(queue.name(), MUST_RETRY);
      return;
    }

    // we got to REVISION and have to wait to be included in block 
    log.info(`Sequencer.dispatch pending txn=${result.hash}`);
    let revisionTx = await queue.markRevisionTransaction(txn.uid, result)
    SendersPool.changeSenderState(queue.name(), MUST_INCLUDE);
    return;        
  }


  /**
   * Wait till the worker has return the call or a Timeout
   * This is for the case that the worker gets blocked and does not return
   * It may happen that it gets fully blocked and then this worker will 
   * not be able to receive new requests. We restart the worker in this case
   * and hope it can run next time
   */
  static async waitDispatcher(
    txn: RawTxnData,
    queue: TransactionsQueue,
    sender: Sender
  ) {
    const dispatchedTs: any =  txn.ts; // milliseconds since submitted
    const now = Date.parse((new Date()).toISOString());
    const elapsed = (now - dispatchedTs);
    if (elapsed > Sequencer.DISPATCH_TIMEOUT) {
      // we assume here that the worker got blocked, 
      // because of some MINA error or other reason, 
      // so we just restart it !
      await SendersPool.restartWorker(sender.accountId);
      SendersPool.freeSender(queue.name());
      return;
    }
  }  


  /**
   * Wait till the current transaction has been included in a block.
   * This may take a long time so we dont wait for it, but just poll
   * the GraphQL endpoint to see if it has finished, and when finished 
   * we run the corresponding callback.
   *  
   */
  static async waitCompletion(
    txn: RawTxnData,
    queue: TransactionsQueue,
    sender: Sender
  ) { 
    const dispatcher = Sequencer.getDispatcher(txn.type);
      
    // now we must start waiting and check till inclusion or failure
    SendersPool.changeSenderState(queue.name(), WAITING_INCLUSION);

    dispatcher.waitForInclusion(txn.hash!, async (result: TxnResult) => {
      // check if we can RETRY
      if (result?.error && sender.retries < MAX_RETRIES) {
        // we must change txn to RETRY state
        let retryTxn = await queue.retryTransaction(txn.uid);
        SendersPool.changeSenderState(queue.name(), MUST_RETRY);
        return;
      }

      // check if we have FULLY FAILED 
      if (result?.error && sender.retries >= MAX_RETRIES) {
        // we dont have any retries left !
        SendersPool.freeSender(queue.name());
        let failedTxn = await queue.closeFailedTransaction(txn.uid, result);
        await dispatcher.onFailure({
            uid: failedTxn.uid,
            type: failedTxn.type,
            data: JSON.parse(failedTxn.data)
          }, result, sender
        );
        return;
      }

      // we are DONE !
      let doneTxn = await queue.closeSuccessTransaction(txn.uid, result);
      SendersPool.freeSender(queue.name());
      await dispatcher.onSuccess({
          uid: doneTxn.uid,
          type: doneTxn.type,
          data: JSON.parse(doneTxn.data)
        }, result, sender
      );
      return;
    }); 
  }


  /**
   * Wait some time before we can retry a failed transaction. And when 
   * delay is out, dispatch the transaction.
   */
  static async waitRetry(
    txn: RawTxnData,
    queue: TransactionsQueue,
    sender: Sender
  ) {  
    const retriedTs: any =  txn.ts; // milliseconds since submitted
    const now = Date.parse((new Date()).toISOString());
   
    if ((now - retriedTs)/1000 > Sequencer.RETRY_DELAY) {
      // now we can dispatch it ...
      const dispatcher = Sequencer.getDispatcher(txn.type);
      await Sequencer.dispatch(txn, queue, sender);
      return;
    }
  }

  
  /**
   * Cleanup queues, because there may be queues that have no more transactions
   * to process but are still in the Sequencer queues map. So we need to remove
   * this ones from the Map.
   * @returns: an array of the refreshed queues names
   */
  static async refreshQueues(): Promise<string[]> {
    let activeNames = (await TransactionsQueue.getActiveQueues())
                        .map((t: any) => { return t.queue });

    let runningNames = [...Sequencer._queues.keys()]; 
    (runningNames || []).forEach((name: string) => {
      // check if it is running 
      let queue = Sequencer._queues.get(name);
      if (queue?.hasRunningTx())
        return; // dont touch it !

      if (!queue?.hasRunningTx() && !activeNames.includes(name)) {
        Sequencer._queues.delete(name); // must remove it
        return;
      }
    });

    // now add all the new active ones not currently in the running set
    (activeNames || []).forEach((name: string) => {
      if (!runningNames.includes(name)) {
        Sequencer._queues.set(name, (new TransactionsQueue(name)));
        return;
      }
    })

    return [...Sequencer._queues.keys()];
  }


  /**
   * Adds a new dispatcher for a given transaction type. There is one, and 
   * only one dispatcher per type. Specific dispatchers are derived from the
   * AnyDispatcher class and called by the DispatcherProxy
   * @param name A
   * @param dispatcher 
   */
  static addDispatcher(
    name: string
  ) {
    let proxy = new DispatcherProxy(name);
    Sequencer._dispatchers.set(name, proxy);
  }
 

  /**
   * Post a transaction to the Queue. Is a helper function to be used 
   * by internal and external code to post transactions without needing 
   * to create a Queue.
   */
  static async postTransaction(queueId: string, params: {
    type: string,
    data: object
  }): Promise<any> {
    let txn = await TransactionsQueue
      .queue(queueId)
      .push(params);
    log.postedTxn(txn);
    return txn;
  }
}


/** Helpers **/

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
