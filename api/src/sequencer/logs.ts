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

  static running(qnames?: string[]) {
    console.log(`${dts()}: Sequencer.run(), qs=${JSON.stringify(qnames || '[]')}`);
  }

  static postedTxn(txn: any) {
    console.log(`${dts()}: postTransaction uid=${txn.uid} ${txn.type} data=${txn.data}`);
  }

  static dispatching(txn: any) {
    console.log(`${dts()}: dispatch uid=${txn.uid} ${txn.type} data=${JSON.stringify(txn.data)}`);
  }

} 


function dts() {
  return (new Date()).toISOString();
}
