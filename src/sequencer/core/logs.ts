/**
 * This is a specialized logger used to simplify logging in the Sequencer 
 * cycles. We want to avoid excesive/long console.log lines that interrupt 
 * code legibility.
 */
import { logger } from "../../global.js";
import { TxnEvent } from "./transaction-events.js";
import { IError } from "./error-codes.js";
import { TxnResult } from "./transaction-queues.js";

export class SequencerLogger {

  static _fullFileName = ""; // filename with full path included 

  static setup(fullname: string) {
    SequencerLogger._fullFileName = fullname;
  }

  static started() {
    logger.info(`Started`);
  }

  static running(qnames?: string[]) {
    // logger.info(`Sequencer.run queues=${JSON.stringify(qnames || '[]')}`);
  }

  static activeQueue(q: any, txn: any, sender: any) {
    // logger.info(`Sequencer.run activeQueue name=${q._queue} runningTxn=${txn.uid} worker=${sender?.workerUrl || 'NO'}`)
  }

  static postedTxn(txn: any) {
    logger.info(`Sequencer.postTransaction uid=${txn.uid} ${txn.type} data=${JSON.stringify(txn.data)}`);
  }

  static dispatching(txn: any) {
    logger.info(`Sequencer.dispatch uid=${txn.uid} ${txn.type} data=${JSON.stringify(txn.data)}`);
  }

  static pendingTxn(txn: any) {
    logger.info(`pendingTxn=`, JSON.stringify(txn.hash()));
  }

  static dispatchedTxn(result: any) {
    const link = `https://berkeley.minaexplorer.com/transaction/${result.hash}`
    logger.info(`Sequencer.dispatch dispatchedTxn hash=${result.hash} url=${link}`);
  }

  static retryPending(txn: any) {
    logger.info(`Sequencer.dispatch txnRetry uid=${txn.uid} retries=${txn.retries}`);
  }

  static waitingAccount(msg: string) {
    logger.info(`waiting account ${msg}`);
  }

  static waitingTransaction(hash: string, elapsed: number, done: any) {
    logger.info(
      `Dispatcher.waitForInclusion ts=${elapsed}secs hash=${hash} done=${!!done}`
      +(done ? ` ${JSON.stringify(done)}` : "")
    );
  }

  static postedEv(ev: TxnEvent) {
    logger.info(`postEvent ${ev.type} subject=${ev.subject} payload=${JSON.stringify(ev.payload)}`);
  }

  static zkAppInstance(id: string) {
    logger.info(`Dispatcher.dispatch zkAppInstance id=${id}`)
  }

  static error(err: any) {
    logger.error(err);
  }

  static info(msg: any) {
    logger.info(msg);
  }

  static result(msg: string, result: TxnResult) {
    if (result.error)
      logger.error(`${msg} error=${JSON.stringify(result.error)}`);
    else
      logger.info(`${msg} result=${JSON.stringify(result)}`);
  }
} 


function dts() {
  return (new Date()).toISOString();
}
