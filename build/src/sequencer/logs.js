export class SequencerLogger {
    static setup(fullname) {
        SequencerLogger._fullFileName = fullname;
    }
    static started() {
        console.log(`${dts()}: Started`);
    }
    static running(qnames) {
        console.log(`${dts()}: Sequencer.run, queues=${JSON.stringify(qnames || '[]')}`);
    }
    static activeQueue(q) {
        console.log(`${dts()}: queue name=${q._queue} running=${q._txRunning || "NO"}`);
    }
    static postedTxn(txn) {
        console.log(`${dts()}: postTransaction uid=${txn.uid} ${txn.type} data=${JSON.stringify(txn.data)}`);
    }
    static dispatching(txn) {
        console.log(`${dts()}: dispatch uid=${txn.uid} ${txn.type} data=${JSON.stringify(txn.data)}`);
    }
    static pendingTxn(txn) {
        console.log(`${dts()}: pendingTxn=${txn.hash()}`);
    }
    static dispatchedTxn(result) {
        const link = `https://berkeley.minaexplorer.com/transaction/${result.hash}`;
        console.log(`${dts()}: hash=${result.hash} ${link}`);
    }
    static retryPending(txn) {
        console.log(`${dts()}: retryTxn=${txn.uid} retries=${txn.retries}`);
    }
    static waitingAccount(msg) {
        console.log(`${dts()}: waiting account ${msg}`);
    }
    static waitingTransaction(hash, elapsed, done) {
        console.log(`${dts()}: waiting txn ${elapsed}secs hash=${hash} done=${!!done}`
            + (done ? ` ${JSON.stringify(done)}` : ""));
    }
    static postedEv(ev) {
        console.log(`${dts()}: postEvent ${ev.type} subject=${ev.subject} payload=${JSON.stringify(ev.payload)}`);
    }
    static zkAppInstance(id) {
        console.log(`${dts()}: zkApp instance id=${id}`);
    }
    static error(err) {
        console.log(`${dts()}: ERROR`, err);
    }
}
SequencerLogger._fullFileName = ""; // filename with full path included 
function dts() {
    return (new Date()).toISOString();
}
//# sourceMappingURL=logs.js.map