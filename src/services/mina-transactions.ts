import axios from "axios";

export {
  waitForTransaction
}

/**
 * Waits for a MINA transaction to be included, and after completion it calls
 * the given callback or error.
 */
const INTERVAL = 10000; // evertyu 10 secs

async function waitForTransaction(
  txnId: string, 
  params: any, 
  onSuccess: (params: any) => void,
  onError: (params: any, error: any) => void
) {
  let ts = (new Date()).toISOString();
  console.log(`${ts} ... waiting for ${txnId} ...`);

  let timer = setTimeout(async () => {
    let rsp = await queryTxnStatus(txnId);
    console.log("Txn status=", rsp);
    let done = rsp.error === null ? rsp.data : null;
    console.log(`${ts} Txn ${txnId} pending=`, (!done));

    if (done && done.blockHeight && done.failureReason === null) {
      // we can now proceed with whatever does the callback
      onSuccess(params); 
      clearTimeout(timer)
      return;
    }

    if (done && done.failureReason !== null) {
      let message = (done.failureReason || []).map((t: any) => {
        return t.failures[0];      
      }).join(", ");

      // report error somehow
      onError(params, `Txn ${txnId} failed: ${message}`);
      clearTimeout(timer)
      return;
    }

    // reschedule 
    clearTimeout(timer);
    waitForTransaction(txnId, params, onSuccess, onError);
  }, INTERVAL) // every 10 secs
}


/**
 * Check if the transaction was included.
 * See: mina-transactions-queries.md
 * @returns
 */
async function queryTxnStatus(txnId: string): Promise<any> {
  try {
    const url = `https://berkeley.graphql.minaexplorer.com/`;
    
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
   console.log("queryTxnStatus rsp=", answer);
    return {
      data: answer,
      error: null,
    };
  } catch (err: any) {
    console.log("queryTxnStatus err=", err);
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
}

onlyIfMain();
