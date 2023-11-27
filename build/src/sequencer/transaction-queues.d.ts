import { WAITING, DONE, IGNORED, REVISION } from '@socialcap/contracts';
declare const FAILED = 13;
declare const MAX_RETRIES = 2;
export { TransactionsQueue, postTransaction, RawTxnData, TxnResult, WAITING, REVISION, DONE, FAILED, IGNORED, MAX_RETRIES };
interface RawTxnData {
    uid: string;
    type: string;
    data: any;
}
interface TxnResult {
    hash: string;
    done: object;
    error?: object;
    data?: object;
}
declare class TransactionsQueue {
    _queue: string;
    _txRunning: string;
    constructor(name: string);
    static queue(name: string): TransactionsQueue;
    hasRunningTx(): boolean;
    setTxIsRunning(txId: string): void;
    setNoRunningTx(): void;
    /**
   * Pushes a new transaction to the given Queue. Only the type and the data
   * are strictly required. All other params are optional.
   * @returns the create Tx or null
   */
    push(params: {
        type: string;
        data: any;
    }): Promise<RawTxnData>;
    /**
     * Retrieves the first available transaction from the given Queue.
     * @types: the list of allowed types that it should retrieve. This allows
     *  us to have more than one sequencer running and each sequencer will be
     *  processing just some transaction types and only those.
     * @returns Null if no pending transaction in the queue
     */
    getFirstWaitingTransaction(types?: string[]): Promise<any>;
    /**
     */
    updateTransaction(uid: string, params: {
        state?: number;
        result?: TxnResult;
    }): Promise<any>;
    /**
     * Changes the state to WAITING and also the retries count of the transaction
     * so it can be processed again.
     * @returns the updated transaction
     */
    retryTransaction(uid: string, MAX_RETRIES: number): Promise<any>;
    /**
     * Closes a given transaction so it will never be processed again.
     * The transaction can be closed because it was succesful, or because it
     * failed too many times and will not be processed again.
     *
     * In any case, we also set the Mina info related to this transaction (TxId
     * and final status as returned by Graphql).
     *
     * @param uid the transaction Uid that we want to close
     * @param params { state, hash, done, error? }
     * @returns the updated Transaction
     */
    closeTransaction(uid: string, params: {
        state: number;
        result: TxnResult;
    }): Promise<any>;
    /**
     * Get just the 'distinct' queues that have pending transactions waiting
     * and ignore all other past queues.
     */
    static getActiveQueues(): Promise<any>;
}
/**
 * Post a transaction to the Queue. Is a helper function to be used
 * by internal and external code to post transactions without needing
 * to create a Queue.
 */
declare function postTransaction(queueId: string, params: {
    type: string;
    data: object;
}): Promise<any>;
