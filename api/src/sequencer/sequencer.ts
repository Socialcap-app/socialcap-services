import { TransactionsQueue, WAITING, DONE, FAILED, REVISION, MAX_RETRIES } from "./transaction-queues.js";
import { Dispatchers } from "./all-dispatchers.js";
import { SequencerLogger as log } from "./logs.js";
import { AnyDispatcher } from "./any-dispatcher.js";

export { Sequencer };


class Sequencer {

  static _queues = new Map<string, TransactionsQueue>;

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
      if (queue.hasRunningTx())
        continue; 

      // 2. If we have no running transactions
      // Check if we have pending transactions to run. If not, just pass.
      // If we have pending transactions, we retrieve the first one from the Queue (FIFO).
      let pendingTx = await queue.getFirstWaitingTransaction();
      if (! pendingTx)
        continue;

      // 3. Dispatch the pending transaction
      // This is an asynchronous call, and will callback on Done or Failure.
      try {
        Sequencer.dispatch(pendingTx, {

          // the Action was succesfull so we update the transaction status
          onDone: async (result: any) => {
            let doneTx = await queue.closeTransaction(pendingTx.uid, {
              state: DONE,
              MinaTxnId: result.MinaTxnId,
              MinaTxnStatus: result.MinaTxnStatus
            })
  
            // and we set the queue as free to run other one
            queue.setNoRunningTx();
            return;
          },
  
          // the Action has failed BUT anyway must update transaction status
          onFailure: async (result: any) => {
            let failedTx = await queue.closeTransaction(pendingTx.uid, {
              state: FAILED,
              MinaTxnId: result.MinaTxnId || "",
              MinaTxnStatus: result.MinaTxnStatus || result.error || "",
            })
  
            // we check if we have some retries left, and increment its count
            // so it can still be processed in the next cycle
            failedTx = await queue.retryTransaction(failedTx.uid, MAX_RETRIES);
  
            // and we set the queue as free to run it again if can retry
            queue.setNoRunningTx();
            return;
          }
        });

        // if we could send the Transaction it must be reviewed by MINA to 
        // include it in a block. We mark it as REVISION in the queue so it will
        // not be run again
        pendingTx = await queue.updateTransaction(pendingTx.uid, { 
          state: REVISION 
        });
      } 
      catch(err: any) {
        console.log("Sequencer dispatc failed ERR=", err);
      }
    }

    return Sequencer;
  }


  /**
   * Dispatcher(s)
   */
  static dispatch(
    txData: any, 
    callbacks: {
      onDone: (result: any) => void,
      onFailure: (result: any) => void 
    }
  ) {
    if (! Dispatchers.has(txData.type))
      return; // No dispatcher for this type, cant do anything

    let dispatcherClass = Dispatchers.get(txData.type);

    let dispatcher = new dispatcherClass({
      onDone: callbacks.onDone,
      onFailure: callbacks.onFailure 
    })
    log.dispatching(txData);

    dispatcher.dispatch(txData); 
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
   * Review queues. We need to take into account the case where some transaction
   * was dispatched, the sequencer was offline and so we could not record the 
   * transaction state, either as DONE or FAILED. 
   * In this case we need to check with the Graphql endpoint the real status of 
   * ths transaction:
   * - If it was success, we change state to DONE.
   * - If it failed, we change state to WAITING so it can be retried.
   */
}