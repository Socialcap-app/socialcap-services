import { TransactionsQueue, TxnResult, WAITING, REVISION } from "./transaction-queues.js";
import { SequencerLogger as log } from "./logs.js";
import { Sender, SendersPool } from "./senders-pool.js";

export { Sequencer };


class Sequencer {

  static _queues = new Map<string, TransactionsQueue>;

  // The set of Dispatchers used to submit transactions or actions
  // for a given type. There is one (and only one) Dispatcher per type.
   static _dispatchers = new Map<string, any>;
  
  /**
   * 
   * @returns 
   */
  static async run() {
    // get the running queues list
    let names = [...Sequencer._queues.keys()]; 

    for (let j=0; j < names.length; j++) {
      
      // 1. Check if we have a running transaction on course. If we have, we just pass.
      let queue = Sequencer._queues.get(names[j]) as TransactionsQueue;
      log.activeQueue(queue);      
      if (queue.hasRunningTx())
        continue; 

      // 2. If we have no running transactions
      // Check if we have pending transactions to run. If not, just pass.
      // If we have pending transactions, we retrieve the first one from the Queue (FIFO).
      let pendingTx = await queue.getFirstWaitingTransaction();
      if (! pendingTx)
        continue;

      // 3. Dispatch the pending transaction
      // first mark it as running so we dont use it until it has finished
      queue.setTxIsRunning(pendingTx.uid);
      
      // This is an asynchronous call, and will callback on Done or Failure.
      try {
        Sequencer.dispatch(queue, pendingTx);
      } 
      catch(err: any) {
        console.log("Sequencer dispatch failed ERR=", err);
      }
    }

    return Sequencer;
  }


  /**
   * Dispatch the transaction pending on this queue. It has to deal with the 
   * different states: WAITING, REVISION, DONE, FAILED, RETRY
   */
  static async dispatch(
    queue: TransactionsQueue,
    txData: any
  ) {
    if (! Sequencer._dispatchers.has(txData.type))
      return; // No dispatcher for this type, cant do anything

    // get the Dispatcher which will dispatch this Txn type
    let dispatcher = Sequencer._dispatchers.get(txData.type);
    log.dispatching(txData);

    try {
      // if a new transaction, need to dispatch it 
      if (txData.state === WAITING) {
        
        // Check if we have an available sender signer for this queue
        let sender = SendersPool.getAvailableSender();
        if (! sender) {
          // we have to wait for an available sender
          // can't do anothing more here, just keep WAITING
          return;
        }

        // block the sender so it is not used by another queue
        SendersPool.blockSender(sender, queue.name());
        log.info(`Sequencer.dispatch Sender id=${sender.accountId} worker=${sender.workerUrl}`)

        // now we can dispatch, BUT we must fork this to run in different
        // thread so we can send more than one Txn in the same block 
        // currently we can not do it with o1js if running in same thread
        let result = await dispatcher.sendToWorker(txData, sender); 
        log.info(`Sequencer.dispatch dispatcher.sendToWorker result=${JSON.stringify(result)}`)

        // UNSOLVED: there is some irrecoverable error and can do nothing 
        if (result.error) {
          await Sequencer.txnUnresolvedError(queue, txData, result);
          SendersPool.freeSender(queue.name());
          return;
        }
      
        // success: was submitted and goes to revision for inclusion
        log.dispatchedTxn(result);
        await Sequencer.txnRevision(queue, txData, result);
        return;        
      }

      // if not included yet, need to wait for it
      if (txData.state === REVISION) {
        let result = await dispatcher.waitForInclusion(txData.hash); 

        // FAILED: but let's see if we can still retry
        if (result.error) {
          let retryTxn = await Sequencer.txnRetry(queue, 
            txData,  
            dispatcher.maxRetries(), 
            result
          );
          if (retryTxn) {
            SendersPool.freeSender(queue.name());
            return;
          }

          // FULLY FAILED, no more retries
          await Sequencer.txnFailure(queue, txData, result);
          SendersPool.freeSender(queue.name());

          // we now can try the onFailure callback with this result
          // we need to trap this because it is not a Sequencer error
          // but an specific dispatcher error
          try {
            result = await dispatcher.onFailure(txData, result);
          }
          catch (err) {
            log.error(`Dispatcher.onFailure failed err=${err}`)
          }
        }

        // SUCCESS: and are done with it
        await Sequencer.txnDone(queue, txData, result);
        SendersPool.freeSender(queue.name());

        // we now can try the onSuccess callback
        // we need to trap this because it is not a Sequencer error
        // but an specific dispatcher error
        try {
          result = await dispatcher.onSuccess(txData, result);
        }
        catch (err) {
          log.error(`Dispatcher.onSuccess failed err=${err}`)
        }
      }
    }
    catch (result: any) {
      await Sequencer.txnUnresolvedError(queue, txData, {
        hash: result.hash || "",
        done: result.done || {},
        error: result.error || result
      });
      SendersPool.freeSender(queue.name());
      return;
    }
  }

  // Send failed and we cant do anything to solve this
  // probably is a code error that raised an exception
  static async txnUnresolvedError(
    queue: TransactionsQueue, 
    pendingTxn: any, 
    result: TxnResult
  ) {
    let unresolvedTx = await queue.closeUnresolvedTransaction(pendingTxn.uid, {
      result: result
    })
    log.error(result.error);
    queue.setNoRunningTx(); // free to run other one
    return unresolvedTx;
  };

  // the Transaction was submitted to Mina but it has not been included
  // in a block yet. It is in REVISION state so we have to wait.
  static async txnRevision(
    queue: TransactionsQueue, 
    pendingTxn: any, 
    result: TxnResult
  ) {
    let revisionTx = await queue.closeRevisionTransaction(pendingTxn.uid, {
      result: result
    })
    queue.setNoRunningTx(); // free to run other one
    return revisionTx;
  };

  // the Action was succesfull so we update the transaction status
  static async txnDone(
    queue: TransactionsQueue, 
    pendingTxn: any, 
    result: TxnResult
  ) {
    let doneTx = await queue.closeSuccessTransaction(pendingTxn.uid, {
      result: result
    })
    queue.setNoRunningTx(); // free to run other one
    return doneTx;
  };

  // the Action has failed BUT anyway must update transaction status
  static async txnFailure(
    queue: TransactionsQueue, 
    pendingTxn: any, 
    result: TxnResult
  ) {
    log.error(result.error);
    result.error = result.error || {};
    let failedTx = await queue.closeFailedTransaction(pendingTxn.uid, {
      result: result
    })
    queue.setNoRunningTx(); // free to run other one
    return failedTx;
  }

  // the Action has failed BUT we may retry it
  static async txnRetry(
    queue: TransactionsQueue, 
    pendingTxn: any, 
    maxRetries: number,
    result: TxnResult
  ): Promise<any> {
    log.error(result.error);
    // we check if we have some retries left, and increment its count
    // so it can still be processed in the next cycle
    let retries = await queue.getTransactionRetries(pendingTxn.uid);
    if (retries <= maxRetries) {
      let retryTx = await queue.retryTransaction(pendingTxn.uid);
      queue.setNoRunningTx(); // free to run other one
      return retryTx;
    } 
    return null;
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
   * AnyDispatcher class.
   * @param name A
   * @param dispatcher 
   */
  static addDispatcher(
    name: string, 
    dispatcher: any
  ) {
    Sequencer._dispatchers.set(name, dispatcher);
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
