/**
 * Manages storage and retrieval of the Transactions Queue involving MINA
 */
import { prisma } from "../../global.js";
import { UID } from "@socialcap/contracts-lib";
import { SequencerLogger as log } from "./logs.js";
import { IError } from "./error-codes.js";

const 
  WAITING = 101,
  REVISION = 102,
  DONE = 103,
  RETRY = 104,
  FAILED = 105,
  UNRESOLVED = 106;

const MAX_RETRIES = 2; // in fact we try 3 times: the first one and 2 more retries

export { 
  TransactionsQueue, 
  postTransaction,
  RawTxnData, 
  TxnResult,
  WAITING, REVISION, DONE, FAILED, RETRY, UNRESOLVED, MAX_RETRIES 
};

interface RawTxnData {
  uid: string;
  type: string;
  data: any; // A parsed JSON object
  state?: number; // REVISION, RETRY, WAITING
  hash?: string; // the MINA txn hash (if send was successful)
}

interface TxnResult {
  hash: string,
  done: object, // A parsed JSON object
  error?: IError,
  data?: object // modified txn data
}


class TransactionsQueue {
  // privates 
  _queue = "";
  _txRunning = "";

  constructor(name: string) {
    this._queue = name;
  }

  static queue(name: string)  {
    return new TransactionsQueue(name) ;
  }

  name(): string {
    return this._queue;
  }

  hasRunningTx(): boolean {
    return this._txRunning !== "";
  }

  setTxIsRunning(txId: string) {
    this._txRunning = txId;
  }

  setNoRunningTx() {
    this._txRunning = "";
  }

  
  /**
 * Pushes a new transaction to the given Queue. Only the type and the data 
 * are strictly required. All other params are optional.
 * @returns the create Tx or null
 */
  async push(params: {
    type: string,
    data: any
  }): Promise<RawTxnData> {
    let tx = await prisma.transactionQueue.create({
      data: {
        uid: UID.uuid4(),
        queue: this._queue, 
        type: params.type,
        data: (typeof(params.data) === 'string' 
                ? params.data : JSON.stringify(params.data || "{}")),
        submitedUTC: (new Date()).toISOString(),
        state: WAITING
      }
    })
  
    return {
      uid: tx.uid,
      type: tx.type,
      data: (typeof(params.data) === 'string') 
              ? JSON.parse(params.data || "{}") : params.data
    };
  }


  /**
   * Retrieves the first available transaction from the given Queue.
   * @types: the list of allowed types that it should retrieve. This allows 
   *  us to have more than one sequencer running and each sequencer will be 
   *  processing just some transaction types and only those. 
   * @returns Null if no pending transaction in the queue
   */
  async getFirstWaitingTransaction(
    types?: string[]
  ): Promise<RawTxnData | null> {
    let txs = await prisma.transactionQueue.findMany({
      where: { AND: [
        { queue: this._queue },
        { state: {in: [WAITING]} }, 
      ]},
      orderBy: { sequence: 'asc'      }
    })

    let tx = txs.length ? txs[0] : null ; // just return the firt or Null 
    if (!tx) return null;
    return {
      uid: tx.uid,
      type: tx.type,
      state: tx.state,
      hash: tx.hash,
      data: JSON.parse(tx.data || "{}")
    }
  }


  /**
   * Retrieves the first running transaction from the given Queue.
   * The transaction mut be in the REVISION or RETRY state, and only 
   * one runnnig transaction is allowed per queue.
   * @returns Null if no running transaction in the queue
   */
  async getRunningTransaction(
    types?: string[]
  ): Promise<RawTxnData | null> {
    let txs = await prisma.transactionQueue.findMany({
      where: { AND: [
        { queue: this._queue },
        { state: {in: [REVISION, RETRY, WAITING]} }, 
      ]},
      orderBy: { sequence: 'asc'      }
    })

    let tx = txs.length ? txs[0] : null ; // just return the firt or Null 
    if (!tx) return null;
    return {
      uid: tx.uid,
      type: tx.type,
      state: tx.state,
      hash: tx.hash,
      data: JSON.parse(tx.data || "{}")
    }
  }

  /**
   * Updates a given transaction using the state, result and optional params. 
   * Is used by the other closeXXXTransaction methods.
   */
  async updateTransaction(uid: string, params: {
    state?: number,
    result?: TxnResult,
    doneUTC?: string
  }): Promise<any> {
    let { state, result, doneUTC } = params;

    let data: any = {
      state: state,
      hash: result?.hash || "",
      done: JSON.stringify(result?.done || '{}'),
      error: JSON.stringify(result?.error || '{}')
    }

    // change the 'data' field if received
    if (result?.data) data.data = JSON.stringify(result?.data);

    // only if it is finished
    if (doneUTC) data.doneUTC = doneUTC;     

    let tx = await prisma.transactionQueue.update({
      where: { uid: uid },
      data: data,
    })
    return tx;
  }


  /**
   * Retries a given transaction by setting the state to WAITING and the retries 
   * count of the transaction so it can be processed again. 
   * @returns the updated transaction
   */
  async retryTransaction(uid: string): Promise<any> {
    let txu = await prisma.transactionQueue.update({
      where: { uid: uid },
      data: { retries: {increment: 1}, state: RETRY },
    })
    log.retryPending(txu);
    return txu;
  }

  /**
   * Closes a given transaction so it will never be processed again. 
   * The transaction can be closed because it was succesful, or because it
   * failed too many times and will not be processed again.
   * 
   * In any case, we also set the Mina info related to this transaction (TxId
   * and final status as returned by Graphql).
   * 
   * @param uid the transaction Uid that we want to close
   * @param params { result, doneUTC? }
   * @returns the updated Transaction
   */

  async closeUnresolvedTransaction(
    uid: string, 
    result: TxnResult
): Promise<any> {
    return await this.updateTransaction(uid, {
      state: UNRESOLVED, 
      result: result,
      doneUTC: (new Date()).toISOString()
    });
  }

  async closeFailedTransaction(
    uid: string, 
    result: TxnResult
  ): Promise<any> {
    return await this.updateTransaction(uid, {
      state: FAILED, 
      result: result,
      doneUTC: (new Date()).toISOString()
    });
  }

  async closeSuccessTransaction(
    uid: string,
    result: TxnResult
  ): Promise<any> {
    return await this.updateTransaction(uid, {
      state: DONE, 
      result: result,
      doneUTC: (new Date()).toISOString()
    });
  }

  async closeRevisionTransaction(
    uid: string,
    result: TxnResult
  ): Promise<any> {
    return await this.updateTransaction(uid, {
      state: REVISION, 
      result: result
    });
  }

  /**
   * Get just the 'distinct' queues that have pending transactions waiting
   * and ignore all other past queues.
   */
  static async getActiveQueues(): Promise<any> {
    let queues = await prisma.transactionQueue.findMany({
      where: { AND: [
        { state: {in: [WAITING, REVISION, RETRY]} }, 
        // { retries: {lt: MAX_RETRIES} }
      ]},
      distinct: ['queue'],
      orderBy: { state: 'asc' }
    })
    
    return queues || [];
  }
}


/**
 * Post a transaction to the Queue. Is a helper function to be used 
 * by internal and external code to post transactions without needing 
 * to create a Queue.
 */
async function postTransaction(queueId: string, params: {
  type: string,
  data: object
}): Promise<any> {
  let tx = await TransactionsQueue
    .queue(queueId)
    .push(params);
  log.postedTxn(tx);
}
