/**
 * Manages storage and retrieval of the Transactions Queue involving MINA
 */
import { prisma } from "../global.js";
import { UID, WAITING, DONE, IGNORED, REVISION } from '@socialcap/contracts';
import { SequencerLogger as log } from "./logs.js";

const FAILED = 13;

const MAX_RETRIES = 2; // in fact we try 3 times: the first one and 2 more retries

export { 
  TransactionsQueue, 
  postTransaction,
  RawTxnData, 
  WAITING, REVISION, DONE, FAILED, IGNORED, MAX_RETRIES 
};

interface RawTxnData {
  uid: string;
  type: string;
  data: any; // A parsed JSON object
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
   *         us to have more than one sequencer running and each sequencer 
   *         will be processing just some transaction types and only those. 
   * @returns Null if no pending transaction in the queue
   */
  async getFirstWaitingTransaction(
    types?: string[]
  ): Promise<any> {
    let txs = await prisma.transactionQueue.findMany({
      where: { AND: [
        { queue: this._queue },
        { state: WAITING }, 
        { retries: {lte: MAX_RETRIES} }
      ]},
      orderBy: { sequence: 'asc'      }
    })

    let tx = txs.length ? txs[0] : null ; // just return the firt or Null 
    if (!tx) return null;
    return {
      uid: tx.uid,
      type: tx.type,
      data: JSON.parse(tx.data || "{}")
    }
  }

  /**
   */
  async updateTransaction(uid: string, params: {
    state?: number,
    MinaTxnId?: string,
    MinaTxnStatus?: object
  }): Promise<any> {
    let data = {
      state: params.state,
      MinaTxnId: params.MinaTxnId || "",
      MinaTxnStatus: (typeof(params.MinaTxnStatus) !== 'string')
        ? JSON.stringify(params.MinaTxnStatus)
        : (params.MinaTxnStatus || "")
    }

    let tx = await prisma.transactionQueue.update({
      where: { uid: uid },
      data: data,
    })
  
    return tx;
  }

  /**
   * 
   */
  async retryTransaction(
    uid: string,
    MAX_RETRIES: number
  ): Promise<any> {
    let txr = await prisma.transactionQueue.findUnique({
      where: { uid: uid} 
    })
    console.log("must retry ?", txr!.uid, txr!.state, txr!.retries);

    if (txr && txr.retries >= MAX_RETRIES)
      return txr; // we can not retry or change anything

    let txu = await prisma.transactionQueue.update({
      where: { uid: uid },
      data: { retries: {increment: 1}, state: WAITING },
    })
    console.log("do retry ", txu!.uid, txu!.state, txu!.retries);
  
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
   * @param params { state?, MinatxId?, MinaTxStatus? }
   * @returns the updated Transaction
   */
  async closeTransaction(uid: string, params: {
    state?: number,
    MinaTxnId?: string,
    MinaTxnStatus?: string
  }): Promise<any> {
    params.state = params.state || DONE; // default for close expcept if FAILED

    let data = {
      state: params.state,
      MinaTxnId: params.MinaTxnId || "",
      MinaTxnStatus: (typeof(params.MinaTxnStatus) !== 'string')
        ? JSON.stringify(params.MinaTxnStatus)
        : (params.MinaTxnStatus || "")
    }

    let tx = await prisma.transactionQueue.update({
      where: { uid: uid },
      data: data,
    })

    return tx
  }

  /**
   * Get just the 'distinct' queues that have pending transactions waiting
   * and ignore all other past queues.
   */
  static async getActiveQueues(): Promise<any> {
    let queues = await prisma.transactionQueue.findMany({
      where: { AND: [
        { state: WAITING }, 
        { retries: {lt: MAX_RETRIES} }
      ]},
      distinct: ['queue'],
      orderBy: { sequence: 'asc'      }
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


