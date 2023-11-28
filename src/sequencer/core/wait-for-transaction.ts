import axios from "axios";
import { TxnResult } from "./transaction-queues.js";
import { SequencerLogger as log } from "./logs.js";
import { 
  TRANSACTION_FAILED_EXCEPTION,
  TRANSACTION_WAITING_TIME_EXCEEDED,
  hasException 
} from "./error-codes.js";

export { waitForTransaction };


/**
 * Waits for a transaction success or failure.
 * @param txnId 
 * @returns a TxnResult 
 * @throws does not throw, allways returns a TxnResult
*/
const INTERVAL = 10000; // every 10 secs
const MAX_RETRIES = 200; 
const GRAPHQL_ENDPOINT =  "https://berkeley.graphql.minaexplorer.com/";

async function waitForTransaction(
  txnId: string
): Promise<TxnResult> {
  let counter = 0;

  for (;;) {
    if (counter > MAX_RETRIES) {
      // break here and return
      return {
        hash: txnId,
        done: {},
        error: hasException(TRANSACTION_WAITING_TIME_EXCEEDED, {
          "timeoutAt": counter * INTERVAL
        })
      };
    }

    let rsp = await queryTxnStatus(txnId);
    let done = rsp.error === null ? rsp.data : null;
    log.waitingTransaction(txnId, counter*INTERVAL/1000, done);

    if (done && done.blockHeight && done.failureReason === null) {
      // we can now proceed with whatever does the callback
      return {
        hash: txnId,
        done: done
      }; 
    }

    if (done && done.failureReason !== null) {
      // this is a Mina error
      let message = (done.failureReason || []).map((t: any) => {
        return t.failures[0];      
      }).join(", ");

      return {
        hash: txnId,
        done: done,
        error: hasException(TRANSACTION_FAILED_EXCEPTION, done.failureReason)
      };
    }

    if (rsp.error) {
      // This is an Axios (or other) error
      return {
        hash: txnId,
        done: {},
        error: hasException(TRANSACTION_FAILED_EXCEPTION, rsp.error)
      };
    }
  
    // no response ... wait and retry
    counter++;
    await new Promise((resolve) => setTimeout(resolve, INTERVAL));
  }
}


/**
 * Check if the transaction was included.
 * See: mina-transactions-queries.md
 * @returns
 */
async function queryTxnStatus(txnId: string): Promise<any> {
  try {
    const url = GRAPHQL_ENDPOINT;
    
    const headers = {}; // no headers needed

    const payload = {
      "query": `{\n  zkapp(query: {hash: \"${txnId}\"}) {
        blockHeight
        failureReason {
          failures
          index
        }    
      }\n}`,
      "variables":null
    };    

    const response = await axios.post(url, payload, { ...headers });
    // expected 
    /*
    "data": {
      "data": {
        "zkapp": {
          "blockHeight": 6896,
          "failureReason": null
        }
      }
    },
    "error": null
    */
   
    const answer = response.data?.data?.zkapp;
    //console.log("queryTxnStatus rsp=", answer);
    return {
      data: answer,
      error: null,
    };
  } catch (err: any) {
    //console.log("queryTxnStatus err=", err);
    return {
      data: null,
      error: err,
    };
  }

  return true;
}


/**
 * Only runs if it is called as main() from the command line for quick tests.
 */
async function onlyIfMain() {
  let argvs = process.argv;
  console.log(`Run #{argvs[0}} ${argvs[1]}`);
  if (!argvs[1].includes("mina-transactions.js")) return;

  /*
  // Success: "5JvC6JAHU3qdmgL6CmnjSWKSPsKZGcT8rQhL8husgMRfH8tpYuAQ"
  let rspOk = await queryTxnStatus("5JvC6JAHU3qdmgL6CmnjSWKSPsKZGcT8rQhL8husgMRfH8tpYuAQ");
  console.log("Response=", JSON.stringify(rspOk,null,2));  

  // Failed: "5JvKrrANa1Vtmpd7XqmHVQu8d8EkjEGesFVsetrMrmDTbTWBqFrq"
  let rspErr = await queryTxnStatus("5JvKrrANa1Vtmpd7XqmHVQu8d8EkjEGesFVsetrMrmDTbTWBqFrq");
  console.log("Response=", JSON.stringify(rspErr,null,2));  

  // # 5JtgHzh9sfNdbeFQofXNZ6jTyJAWsJ73tHko4yZVh9sHiTrsHUcH
  let rspPending = await queryTxnStatus("5JtgHzh9sfNdbeFQofXNZ6jTyJAWsJ73tHko4yZVh9sHiTrsHUcH");
  console.log("Response=", JSON.stringify(rspPending,null,2));  
  */
  /*
  waitForTransaction(
    "5JvKrrANa1Vtmpd7XqmHVQu8d8EkjEGesFVsetrMrmDTbTWB0000",
    {},
    (params: any) => {
      console.log("DONE");
    },
    (err: any) => {
      console.log("ERR", err);
    }
  )

  waitForTransaction(
    "5JvKrrANa1Vtmpd7XqmHVQu8d8EkjEGesFVsetrMrmDTbTWB0001",
    {},
    (params: any) => {
      console.log("DONE");
    },
    (err: any) => {
      console.log("ERR", err);
    }
  )

  waitForTransaction(
    "5JvKrrANa1Vtmpd7XqmHVQu8d8EkjEGesFVsetrMrmDTbTWB0002",
    {},
    (params: any) => {
      console.log("DONE");
    },
    (err: any) => {
      console.log("ERR", err);
    }
  )
  */
}

onlyIfMain();
