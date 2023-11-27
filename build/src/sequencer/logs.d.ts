/**
 * This is a specialized logger used to simplify logging in the Sequencer
 * cycles. We want to avoid excesive/long console.log lines that interrupt
 * code legibility.
 */
import { TxnEvent } from "./transaction-events.js";
export declare class SequencerLogger {
    static _fullFileName: string;
    static setup(fullname: string): void;
    static started(): void;
    static running(qnames?: string[]): void;
    static activeQueue(q: any): void;
    static postedTxn(txn: any): void;
    static dispatching(txn: any): void;
    static pendingTxn(txn: any): void;
    static dispatchedTxn(result: any): void;
    static retryPending(txn: any): void;
    static waitingAccount(msg: string): void;
    static waitingTransaction(hash: string, elapsed: number, done: any): void;
    static postedEv(ev: TxnEvent): void;
    static zkAppInstance(id: string): void;
    static error(err: any): void;
}
