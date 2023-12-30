/**
 * The Dispatchers abstract class which all dispatchers will derive from.
 * It implements the basic helper methods to be used by this derived classes.
 */
import { PrivateKey, PublicKey, Mina } from "o1js";
import { RawTxnData, TxnResult } from "./transaction-queues.js";
import { waitForTransaction } from "./wait-for-transaction.js";
import { TxnEvent, postTxnEvent } from "./transaction-events.js";
import { SequencerLogger as log } from "./logs.js";
import { Sender } from "./senders-pool.js";

import { 
  TRY_SEND_TRANSACTION_EXCEPTION,
  TRY_WAITING_TRANSACTION_EXCEPTION,
  POST_TRANSACTION_EVENT_FAILED,
  hasException, 
} from "./error-codes.js";

export { AnyDispatcher };

let nonce = 0;


abstract class AnyDispatcher {

  abstract name(): string;

  /**
   * Checks if the dispatcher action can be retried again. 
   * it can return 0 if no retries are allowed, otherwise 
   * must return the max number of allowed retries.
   */
  abstract maxRetries(): number;

  /**
   * This must be implemented by derived classes and will be called 
   * by the Sequencer.dispatch method to send a new transaction to Mina.
   */
  abstract dispatch(
    txData: RawTxnData,
    sender: Sender
  ): Promise<any>;

  /**
   * This callbacks will be set by the derived class and called by the 
   * Dispatcher when the transaction is really finished, so we can run 
   * additional actions after it.
   */ 
  abstract onSuccess(
    txData: RawTxnData, 
    result: TxnResult
  ): Promise<TxnResult>;

  abstract onFailure(
    txData: RawTxnData, 
    result: TxnResult
  ): Promise<TxnResult>;

  /**
   * Proves and sends the given transaction, but it does NOT wait for it !
   * @param transactionFn the transaction function to execute, 
   *    which will be used by the MINA.transaction call
   * @returns the transaction TxnResult 
   * @catches exception and sends as a TxnResult (with error) format if failed
   */
  async proveAndSend(
    transactionFn: () => void,
    payerPubkey: PublicKey,
    fee: number,
    signKeys: PrivateKey[]
  ): Promise<TxnResult> {
    try {
      let txn = await Mina.transaction(
        { sender:payerPubkey, fee: fee }, 
        transactionFn
      );
      await txn.prove();

      let pendingTxn = signKeys.length 
        ? await txn.sign(signKeys).send()
        : await txn.send();

      if (! pendingTxn.isSuccess) 
        return {
          hash: "",
          done: {},
          error: hasException(TRY_SEND_TRANSACTION_EXCEPTION)
        };
      
      // we return ths submitted transaction in TxnResult format 
      return {
        hash: pendingTxn.hash() as string,
        done: {}, // we are not done yet ...
      };
    }
    catch (err: any) {
      return {
        hash: "",
        done: {},
        error: hasException(TRY_SEND_TRANSACTION_EXCEPTION, err)
      }
    }
  }

  /**
   * Waits that the already dispatched transaction is included in a block.
   * @returns the transaction TxnResult 
   * @catches exception and sends as a TxnResult (with error) format if failed
   */
   async waitForInclusion(
    txnHash: string
  ): Promise<TxnResult> {
    try {
      let result = await waitForTransaction(txnHash);
      return result;
    }
    catch (err: any) {
      return {
        hash: "",
        done: {},
        error: hasException(TRY_WAITING_TRANSACTION_EXCEPTION, err)
      }
    }
  }

  /**
   * Post and event to the TransactioEvents queue. It receives the TxnResult
   * and modifies it accordingly if the call fails. It is mostly a helper
   * function for being called by derived classes.
   */
  async postEvent(
    ev: TxnEvent,
    result: TxnResult
  ): Promise<TxnResult> {
    let updated = await postTxnEvent(ev);
    
    if (! updated) {
      result.error = hasException(POST_TRANSACTION_EVENT_FAILED);
      log.error(result.error);
    }

    return result;
  }
}
