import { Mina, Field, PrivateKey, PublicKey, UInt64 } from 'o1js';
import { ClaimsVotingFactory, VotingContract } from "@socialcap/contracts";

export { rollupClaims };

const ROLLUP_TX_FEE = 200_000_000;

/**
 * 
 * @param running all running claims
 * @param payerAccount 
 * @param payerSecret 
 * @returns the finished claims indexes 
 */
async function rollupClaims(
  running: any[],
  payerAccount: PublicKey,
  payerSecret: PrivateKey
): Promise<any[]> {
  let finishedQueue = []

  for (let j=0; j < running.length; j++) {
    if (!running[j].accountId)
      continue;

    let zkClaim = await ClaimsVotingFactory.getInstance(
      PublicKey.fromBase58(running[j].accountId)
    );
    let instance = zkClaim.instance;
    let instancePuk = zkClaim.address;

    // first check if finished (result > 0)
    let result: Field = instance.result.get();
    const isFinished = result.greaterThan(Field(0)).toBoolean();
    if (isFinished) {
      // add it to the queue and continue with other
      finishedQueue.push(
        await copyResults(instance, running[j])
      );
      continue; 
    }

    let claimUid: Field = await instance.claimUid.get();
    console.log("\nrollingClaims running claimUid= ", claimUid.toString());

    // do we have pending votes ?
    // CAUTION: we must be sure about what does reducer.getActions() really
    // returns because it may be misgiding
    let actionsState: Field = await instance.actionsState.get();
    console.log("actionsState=", actionsState.toString());

    let pending: any = await Mina.fetchActions(instancePuk, {
      fromActionState: actionsState
    });
    console.log("rollingClaims pending votes= ", JSON.stringify(pending,null,2));
    let pendingCount = pending.length;
    
    // if no pending votes we just go to the next instance ...
    // we run rollup ONLY when we have something to rollup
    if (pendingCount === 0) continue;

    // just retry to be sure its compiled ...
    console.log("recompling contract ...");
    await VotingContract.compile();
    
    // we should check here if payer has funds for TX fees
    // ...

    // run the rollup now
    try {
      let tx = await Mina.transaction(
        { sender: payerAccount, fee: ROLLUP_TX_FEE }, 
        () => { instance.rollupVotes(); }
      );
      await tx.prove();
      tx.sign([payerSecret]);
      let pendingTx = await tx.send();
  
      // check if Tx was success or failed
      if (!pendingTx.isSuccess) {
        console.log('error sending transaction (see above)');
        // process.exit(0); // we will NOT exit here, but retry latter !!!
        continue; 
      }
      console.log(
        `See transaction at https://berkeley.minaexplorer.com/transaction/${pendingTx.hash()}
        Waiting for transaction to be included...`
      );
  
      // TODO: I am not sure we need to do this or if we can send another transaction
      // while this one is being processed ...
      await pendingTx.wait();

      // if has finished add it to the finals queue  
      const done: Field = instance.result.get();
      const hasFinished = done.greaterThan(Field(0)).toBoolean();
      if (hasFinished) {
        finishedQueue.push(
          await copyResults(instance, running[j])
        );
      } 
    }
    catch (err: any) {
      console.log("rollingClaims failed on rollup=", err.toString())
    }
  }

  return finishedQueue; // the finished claims
}


async function copyResults(instance: any, claim:any) {
  return {
    claim: claim,
    result: await instance.result.get(),
    positive: await instance.positive.get(),
    negative: await instance.negative.get(),
    ignored: await instance.ignored.get()
  };
}