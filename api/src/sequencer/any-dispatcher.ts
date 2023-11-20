/**
 * The Dispatchers abstract class which all dispatchers will derive from.
 * It implements the basic helper methods to be used by this derived classes.
 */
import { PrivateKey, PublicKey, Mina } from "o1js";
import { RawTxnData, TxnResult } from "./transaction-queues.js";
import { waitForTransaction } from "./wait-for-transaction.js";
import { 
  TRANSACTION_FAILED_EXCEPTION, 
  TRY_SEND_TRANSACTION_EXCEPTION, 
  hasException 
} from "./error-codes.js";

export { AnyDispatcher };


abstract class AnyDispatcher {

  /**
   * This must be implemented by derived classes and will be called 
   * by the Sequencer.dispatch method
   */
  abstract dispatch(txn: RawTxnData): any;

  
  /**
   * Proves and sends the given transaction, and waits for it.
   * @returns the transaction TxnResult 
   * @catches exception and sends as a TxnResult (with error) format if failed
   */
  async proveAndSend(
    transaction: () => void,
    payerPubkey: PublicKey,
    fee: number,
    signKeys: PrivateKey[]
  ): Promise<TxnResult> {
    try {
      let txn = await Mina.transaction(
        { sender:payerPubkey, fee: fee }, 
        transaction
      );
      await txn.prove();

      // allways sign it, just in case it requires signature authorization
      let pendingTxn = await txn.sign(signKeys).send();

      if (! pendingTxn.isSuccess)
        return {
          hash: "",
          done: {},
          error: hasException(TRY_SEND_TRANSACTION_EXCEPTION)
        };

      let result = await waitForTransaction(pendingTxn.hash() as string);
      if (result.error) 
        return result; // is in TxnResult format 
      
      return result;
    }
    catch (err: any) {
      return {
        hash: "",
        done: {},
        error: hasException(TRY_SEND_TRANSACTION_EXCEPTION, err)
      }
    }
  }
}