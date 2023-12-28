/**
 * This is a specialized logger used to simplify logging in the Sequencer 
 * cycles. We want to avoid excesive/long console.log lines that interrupt 
 * code legibility.
 */
import { TxnEvent } from "./transaction-events.js";
import { IError } from "./error-codes.js";

export class SequencerLogger {

  static _fullFileName = ""; // filename with full path included 

  static setup(fullname: string) {
    SequencerLogger._fullFileName = fullname;
  }

  static started() {
    console.log(`${dts()}: Started`);
  }

  static running(qnames?: string[]) {
    console.log(`${dts()}: Sequencer.run queues=${JSON.stringify(qnames || '[]')}`);
  }

  static activeQueue(q: any) {
    console.log(`${dts()}: Sequencer.run activeQueue name=${q._queue} runningTxn=${q._txRunning || "NO"}`)
  }

  static postedTxn(txn: any) {
    console.log(`${dts()}: Sequencer.postTransaction uid=${txn.uid} ${txn.type} data=${JSON.stringify(txn.data)}`);
  }

  static dispatching(txn: any) {
    console.log(`${dts()}: Sequencer.dispatch uid=${txn.uid} ${txn.type} data=${JSON.stringify(txn.data)}`);
  }

  static pendingTxn(txn: any) {
    console.log(`${dts()}: pendingTxn=${txn.hash()}`);
  }

  static dispatchedTxn(result: any) {
    const link = `https://berkeley.minaexplorer.com/transaction/${result.hash}`
    console.log(`${dts()}: Sequencer.dispatch dispatchedTxn hash=${result.hash} url=${link}`);
  }

  static retryPending(txn: any) {
    console.log(`${dts()}: Sequencer.dispatch txnRetry uid=${txn.uid} retries=${txn.retries}`);
  }

  static waitingAccount(msg: string) {
    console.log(`${dts()}: waiting account ${msg}`);
  }

  static waitingTransaction(hash: string, elapsed: number, done: any) {
    console.log(
      `${dts()}: Dispatcher.waitForInclusion, txn ${elapsed}secs hash=${hash} done=${!!done}`
      +(done ? ` ${JSON.stringify(done)}` : "")
    );
  }

  static postedEv(ev: TxnEvent) {
    console.log(`${dts()}: postEvent ${ev.type} subject=${ev.subject} payload=${JSON.stringify(ev.payload)}`);
  }

  static zkAppInstance(id: string) {
    console.log(`${dts()}: Dispatcher.dispatch zkAppInstance id=${id}`)
  }

  static error(err: any) {
    console.log(`${dts()}: ERROR `, err);
  }

  static info(msg: any) {
    console.log(`${dts()}: INFO `, msg);
  }
} 


function dts() {
  return (new Date()).toISOString();
}
