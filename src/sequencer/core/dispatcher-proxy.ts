/**
 * The Dispatchers abstract class which all dispatchers will derive from.
 * It implements the basic helper methods to be used by this derived classes.
 */
import axios, { AxiosResponse } from 'axios';
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

export { DispatcherProxy };

class DispatcherProxy {

  _name = "";

  constructor(name: string) {
    this._name = name;
  }

  /**
   * Checks if the dispatcher action can be retried again. 
   * it can return 0 if no retries are allowed, otherwise 
   * must return the max number of allowed retries.
   */
  async maxRetries(
    sender: Sender
  ): Promise<any> {
    return await this.GET(`${sender.workerUrl}/max-retries`, {})
  }

  /**
   * This must be implemented by the workers and will be called 
   * by the Sequencer.dispatch method to send a new transaction to Mina.
   */
  async dispatch(
    txData: RawTxnData,
    sender: Sender,
  ): Promise<any> {
    return await this.POST(`${sender.workerUrl}/dispatch`, {
      txData: txData, 
      sender: sender.accountId
    });
  }

  /**
   * This callbacks will be set by the derived class and called by the 
   * Dispatcher when the transaction is really finished, so we can run 
   * additional actions after it.
   */ 
  async onSuccess(
    txData: RawTxnData, 
    result: TxnResult,
    sender: Sender,
  ): Promise<TxnResult> {
    return await this.POST(`${sender.workerUrl}/on-success`, {
      txData: txData, 
      sender: sender.accountId
    });
  }

  async onFailure(
    txData: RawTxnData, 
    result: TxnResult,
    sender: Sender,
  ): Promise<TxnResult> {
    return await this.POST(`${sender.workerUrl}/on-failure`, {
      txData: txData, 
      sender: sender.accountId
    });
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

  async GET(
    path: string, 
    params: any,
  ) {
    try {
      const url = `${path}/${this._name}`;
      const headers = {headers: {}};
      const response: AxiosResponse = await axios.get(url, 
        {...headers}
      );
      return response.data;
    } catch (err: any) {
      return {
        hash: "",
        data: {},
        error: err
      };
    }
  }

  async POST(
    path: string,
    payload: any, 
  ): Promise<any> {
    try {
      const url = `${path}/${this._name}`;
      const headers = {headers: {}};
      const response: AxiosResponse = await axios.post(url, 
        payload, 
        {...headers}
      );
      return response.data;
    } catch (err: any) {
      return {
        hash: "",
        data: {},
        error: err
      };
    }
  }
}
