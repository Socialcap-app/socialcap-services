/**
 * The Dispatchers abstract class which all dispatchers will derive from.
 * It implements the basic helper methods to be used by this derived classes.
 */
import { Mina } from "o1js";
import { waitForTransaction } from "./wait-for-transaction.js";
import { postTxnEvent } from "./transaction-events.js";
import { SequencerLogger as log } from "./logs.js";
import { TRY_SEND_TRANSACTION_EXCEPTION, TRY_WAITING_TRANSACTION_EXCEPTION, POST_TRANSACTION_EVENT_FAILED, hasException, } from "./error-codes.js";
export { AnyDispatcher };
class AnyDispatcher {
    /**
     * Proves and sends the given transaction, but it does NOT wait for it !
     * @param transaction the transaction function to execute, which will be
     *  used by the MINA.transaction call
     * @returns the transaction TxnResult
     * @catches exception and sends as a TxnResult (with error) format if failed
     */
    async proveAndSend(transaction, payerPubkey, fee, signKeys) {
        try {
            let txn = await Mina.transaction({ sender: payerPubkey, fee: fee }, transaction);
            await txn.prove();
            // allways sign it, just in case it requires signature authorization
            let pendingTxn = await txn.sign(signKeys).send();
            if (!pendingTxn.isSuccess)
                return {
                    hash: "",
                    done: {},
                    error: hasException(TRY_SEND_TRANSACTION_EXCEPTION)
                };
            // we return ths submitted transaction in TxnResult format 
            return {
                hash: pendingTxn.hash(),
                done: {}, // we are not done yet ...
            };
        }
        catch (err) {
            return {
                hash: "",
                done: {},
                error: hasException(TRY_SEND_TRANSACTION_EXCEPTION, err)
            };
        }
    }
    /**
     * Waits that the already dispatched transaction is included in a block.
     * @returns the transaction TxnResult
     * @catches exception and sends as a TxnResult (with error) format if failed
     */
    async waitForInclusion(txnHash) {
        try {
            let result = await waitForTransaction(txnHash);
            return result;
        }
        catch (err) {
            return {
                hash: "",
                done: {},
                error: hasException(TRY_WAITING_TRANSACTION_EXCEPTION, err)
            };
        }
    }
    /**
     * Post and event to the TransactioEvents queue. It receives the TxnResult
     * and modifies it accordingly if the call fails. It is mostly a helper
     * function for being called by derived classes.
     */
    async postEvent(ev, result) {
        let updated = await postTxnEvent(ev);
        if (!updated) {
            result.error = hasException(POST_TRANSACTION_EVENT_FAILED);
            log.error(result.error);
        }
        return result;
    }
}
//# sourceMappingURL=any-dispatcher.js.map