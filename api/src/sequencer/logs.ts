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
    console.log(`${dts()}: Sequencer.run, queues=${JSON.stringify(qnames || '[]')}`);
  }

  static activeQueue(q: any) {
    console.log(`${dts()}: queue name=${q._queue} running=${q._txRunning || "NO"}`)
  }

  static postedTxn(txn: any) {
    console.log(`${dts()}: postTransaction uid=${txn.uid} ${txn.type} data=${JSON.stringify(txn.data)}`);
  }

  static dispatching(txn: any) {
    console.log(`${dts()}: dispatch uid=${txn.uid} ${txn.type} data=${JSON.stringify(txn.data)}`);
  }

  static pendingTxn(txn: any) {
    console.log(`${dts()}: pendingTxn=${txn.hash()}`);
  }

  static dispatchedTxn(result: any) {
    const link = `https://berkeley.minaexplorer.com/transaction/${result.hash}`
    console.log(`${dts()}: hash=${result.hash} ${link}`);
  }

  static retryPending(txn: any) {
    console.log(`${dts()}: retryTxn=${txn.uid} retries=${txn.retries}`);
  }

  static waitingAccount(msg: string) {
    console.log(`${dts()}: waiting account ${msg}`);
  }

  static waitingTransaction(hash: string, elapsed: number, done: any) {
    console.log(
      `${dts()}: waiting txn ${elapsed}secs hash=${hash} done=${!!done}`
      +(done ? ` ${JSON.stringify(done)}` : "")
    );
  }

  static postedEv(ev: TxnEvent) {
    console.log(`${dts()}: postEvent ${ev.type} to=${ev.to} payload=${JSON.stringify(ev.payload)}`);
  }

  static zkAppInstance(id: string) {
    console.log(`${dts()}: zkApp instance id=${id}`)
  }

  static error(err: any) {
    console.log(`${dts()}: ERROR`, err);
  }
} 


function dts() {
  return (new Date()).toISOString();
}
