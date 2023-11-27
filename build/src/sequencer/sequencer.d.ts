import { TransactionsQueue, TxnResult } from "./transaction-queues.js";
export { Sequencer };
declare class Sequencer {
    static _queues: Map<string, TransactionsQueue>;
    static _dispatchers: Map<string, any>;
    /**
     *
     * @returns
     */
    static run(): Promise<typeof Sequencer>;
    /**
     * Dispatch the transaction pending on this queue. It has to deal with the
     * different states: WAITING, REVISION, DONE, FAILED.
     */
    static dispatch(txData: any, callbacks: {
        onRevision: (result: TxnResult) => void;
        onDone: (result: TxnResult) => void;
        onFailure: (result: TxnResult) => void;
    }): Promise<void>;
    /**
     * Cleanup queues, because there may be queues that have no more transactions
     * to process but are still in the Sequencer queues map. So we need to remove
     * this ones from the Map.
     * @returns: an array of the refreshed queues names
     */
    static refreshQueues(): Promise<string[]>;
    /**
     * Adds a new dispatcher for a given transaction type. There is one, and
     * only one dispatcher per type. Specific dispatchers are derived from the
     * AnyDispatcher class.
     * @param name A
     * @param dispatcher
     */
    static addDispatcher(name: string, dispatcher: any): void;
}
