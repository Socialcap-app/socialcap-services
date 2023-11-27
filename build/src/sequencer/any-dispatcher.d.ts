/**
 * The Dispatchers abstract class which all dispatchers will derive from.
 * It implements the basic helper methods to be used by this derived classes.
 */
import { PrivateKey, PublicKey } from "o1js";
import { RawTxnData, TxnResult } from "./transaction-queues.js";
import { TxnEvent } from "./transaction-events.js";
export { AnyDispatcher };
declare abstract class AnyDispatcher {
    /**
     * This must be implemented by derived classes and will be called
     * by the Sequencer.dispatch method to send a new transaction to Mina.
     */
    abstract dispatch(txData: RawTxnData): Promise<any>;
    /**
     * This callback will be set by the derived class and called by the
     * Dispatcher when the transaction is really finished, so we can run
     * additional actions after it.
     */
    abstract onFinished(txData: RawTxnData, result: TxnResult): Promise<TxnResult>;
    /**
     * Proves and sends the given transaction, but it does NOT wait for it !
     * @param transaction the transaction function to execute, which will be
     *  used by the MINA.transaction call
     * @returns the transaction TxnResult
     * @catches exception and sends as a TxnResult (with error) format if failed
     */
    proveAndSend(transaction: () => void, payerPubkey: PublicKey, fee: number, signKeys: PrivateKey[]): Promise<TxnResult>;
    /**
     * Waits that the already dispatched transaction is included in a block.
     * @returns the transaction TxnResult
     * @catches exception and sends as a TxnResult (with error) format if failed
     */
    waitForInclusion(txnHash: string): Promise<TxnResult>;
    /**
     * Post and event to the TransactioEvents queue. It receives the TxnResult
     * and modifies it accordingly if the call fails. It is mostly a helper
     * function for being called by derived classes.
     */
    postEvent(ev: TxnEvent, result: TxnResult): Promise<TxnResult>;
}
