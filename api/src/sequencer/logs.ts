/**
 * This is a specialized logger used to simplify logging in the Sequencer 
 * cycles. We want to avoid excesive/long console.log lines that interrupt 
 * code legibility.
 */

export class SequencerLogger {

  static _fullFileName = ""; // filename with full path included 

  static setup(fullname: string) {
    SequencerLogger._fullFileName = fullname;
  }

  static started() {
    console.log(`${dts()}: Started`);
  }

  static postedTx(tx: any) {
    console.log(`${dts()}: postTransaction uid=${tx.uid} tx=${JSON.stringify(tx)}`);
  }
} 


function dts() {
  return (new Date()).toISOString();
}
