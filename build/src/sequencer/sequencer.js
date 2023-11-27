import { TransactionsQueue, WAITING, DONE, FAILED, REVISION, MAX_RETRIES } from "./transaction-queues.js";
import { SequencerLogger as log } from "./logs.js";
export { Sequencer };
class Sequencer {
    /**
     *
     * @returns
     */
    static async run() {
        // get the running queues list
        let names = [...Sequencer._queues.keys()];
        for (let j = 0; j < names.length; j++) {
            // 1. Check if we have a running transaction on course. If we have, we just pass.
            let queue = Sequencer._queues.get(names[j]);
            log.activeQueue(queue);
            if (queue.hasRunningTx())
                continue;
            // 2. If we have no running transactions
            // Check if we have pending transactions to run. If not, just pass.
            // If we have pending transactions, we retrieve the first one from the Queue (FIFO).
            let pendingTx = await queue.getFirstWaitingTransaction();
            if (!pendingTx)
                continue;
            // 3. Dispatch the pending transaction
            // first mark it as running so we dont use it until it has finished
            queue.setTxIsRunning(pendingTx.uid);
            // This is an asynchronous call, and will callback on Done or Failure.
            try {
                Sequencer.dispatch(pendingTx, {
                    // the Transaction was submitted to Mina but it has not been included
                    // in a block yet. It is in REVISION state so we have to wait.
                    onRevision: async (result) => {
                        let revisionTx = await queue.closeTransaction(pendingTx.uid, {
                            state: REVISION,
                            result: result
                        });
                        // and we set the queue as free to run other one
                        queue.setNoRunningTx();
                        return;
                    },
                    // the Action was succesfull so we update the transaction status
                    onDone: async (result) => {
                        let doneTx = await queue.closeTransaction(pendingTx.uid, {
                            state: DONE,
                            result: result
                        });
                        // and we set the queue as free to run other one
                        queue.setNoRunningTx();
                        return;
                    },
                    // the Action has failed BUT anyway must update transaction status
                    onFailure: async (result) => {
                        log.error(result.error);
                        result.error = result.error || {};
                        let failedTx = await queue.closeTransaction(pendingTx.uid, {
                            state: FAILED,
                            result: result
                        });
                        // we check if we have some retries left, and increment its count
                        // so it can still be processed in the next cycle
                        failedTx = await queue.retryTransaction(failedTx.uid, MAX_RETRIES);
                        // and we set the queue as free to run it again so it can retry
                        queue.setNoRunningTx();
                        return;
                    }
                });
                // if we could send the Transaction it must be reviewed by MINA to 
                // include it in a block. We mark it as REVISION in the queue so it will
                // not be run again
                // pendingTx = await queue.updateTransaction(pendingTx.uid, { 
                //   state: REVISION 
                // });
            }
            catch (err) {
                console.log("Sequencer dispatch failed ERR=", err);
            }
        }
        return Sequencer;
    }
    /**
     * Dispatch the transaction pending on this queue. It has to deal with the
     * different states: WAITING, REVISION, DONE, FAILED.
     */
    static async dispatch(txData, callbacks) {
        if (!Sequencer._dispatchers.has(txData.type))
            return; // No dispatcher for this type, cant do anything
        // get the Dispatcher which will dispatch this Txn type
        let dispatcher = Sequencer._dispatchers.get(txData.type);
        log.dispatching(txData);
        try {
            // if a new transaction, need to dispatch it 
            if (txData.state === WAITING) {
                let result = await dispatcher.dispatch(txData);
                if (result.error)
                    throw result;
                // submitted but it stays on revision
                log.dispatchedTxn(result);
                callbacks.onRevision(result);
            }
            // if not included yet, need to wait for it
            if (txData.state === REVISION) {
                let result = await dispatcher.waitForInclusion(txData.hash);
                if (result.error)
                    throw result;
                // we now can call the onFinished callback
                result = await dispatcher.onFinished(txData, result);
                // success, we are done with it
                callbacks.onDone(result);
            }
        }
        catch (result) {
            callbacks.onFailure({
                hash: result.hash || "",
                done: result.done || {},
                error: result.error || result
            });
        }
    }
    /**
     * Cleanup queues, because there may be queues that have no more transactions
     * to process but are still in the Sequencer queues map. So we need to remove
     * this ones from the Map.
     * @returns: an array of the refreshed queues names
     */
    static async refreshQueues() {
        let activeNames = (await TransactionsQueue.getActiveQueues())
            .map((t) => { return t.queue; });
        let runningNames = [...Sequencer._queues.keys()];
        (runningNames || []).forEach((name) => {
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
        (activeNames || []).forEach((name) => {
            if (!runningNames.includes(name)) {
                Sequencer._queues.set(name, (new TransactionsQueue(name)));
                return;
            }
        });
        return [...Sequencer._queues.keys()];
    }
    /**
     * Adds a new dispatcher for a given transaction type. There is one, and
     * only one dispatcher per type. Specific dispatchers are derived from the
     * AnyDispatcher class.
     * @param name A
     * @param dispatcher
     */
    static addDispatcher(name, dispatcher) {
        Sequencer._dispatchers.set(name, dispatcher);
    }
}
Sequencer._queues = new Map;
// The set of Dispatchers used to submit transactions or actions
// for a given type. There is one (and only one) Dispatcher per type.
Sequencer._dispatchers = new Map;
//# sourceMappingURL=sequencer.js.map