/**
 * Dispatchers
 * Theis is the set of Dispatchers used to submit transactions or actions
 * for a given type. There is one (and only one) Dispatcher per type.
 */
import { RawTxnData } from "./transaction-queues.js";
import { waitForTransaction } from "./wait-for-transaction.js";

export {
  AnyDispatcher
}


abstract class AnyDispatcher {

  onDone: (result: any) => void;
  onFailure: (error: any) => void;
  
  constructor(callbacks: {
    onDone: (result: any) => void,
    onFailure: (error: any) => void;
  }) {
    this.onDone = callbacks.onDone;
    this.onFailure = callbacks.onFailure
  }

  // this must be implemented by derived classes
  abstract dispatch(txn: RawTxnData): any;

  reportErrorOrWait(
    pendingTxn: any,
    params: any
  ) {
    if (! pendingTxn.isSuccess) {
      this.onFailure({
        error: { code: -1, message: "Could not sign or send transaction" }
      })
      return;
    }
  
    waitForTransaction(
      pendingTxn.hash, 
      params,
      // on Success
      (status: any) => { this.onDone({
        MinaTxId: `${pendingTxn.hash()}`,
        MinaTxStatus: status,
        params: params
      })},
      // onError
      (status: any, error: any) => { this.onFailure({
        MinaTxnId: `${pendingTxn.hash()}`,
        MinaTxnStatus: status,
        params: params,
        error: error
      })}
    );
  }
}




function checkTransaction(pendingTx: any) {
  // check if Tx was success or failed
  if (!pendingTx.isSuccess) {
    console.log('Error sending transaction (see above)');
    // process.exit(0); // we will NOT exit here, but retry latter !!!
    return false;
  }
  console.log(
    `Waiting for transaction to be included: https://berkeley.minaexplorer.com/transaction/${pendingTx.hash()}`
  );
  return true;
}
