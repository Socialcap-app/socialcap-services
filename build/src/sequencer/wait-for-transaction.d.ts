import { TxnResult } from "./transaction-queues.js";
export { waitForTransaction };
declare function waitForTransaction(txnId: string): Promise<TxnResult>;
