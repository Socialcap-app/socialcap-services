import { Field, PublicKey } from "o1js";
import { TALLYING, WAITING, DONE } from "@socialcap/contracts-lib";
import { logger } from "../global.js";
import { getBatchesByPlan, SignedVote, unpackSignedData } from "../dbs/batch-helpers.js";
import { postSendClaimVote } from "../dbs/sequencer-helpers.js";

export { processVotesBatches }

/**
 * Process each batch in the closed voting Plan by traversing it and 
 * sending each vote to the correct ClaimVoting zkApp. 
 * @param planUid 
 */
async function processVotesBatches(
  plan: any
) {
  let planStrategy = JSON.parse((plan.strategy || "{}"));

  // get all batches belonging to this plan  
  let batches = await getBatchesByPlan(plan.uid, { states: [WAITING, DONE]});

  for (let k=0; k < (batches || []).length; k++) {
    let batch = batches[k];

    // votes in the batch
    let unpacked = JSON.parse(batch.signedData);
    let votes: SignedVote[] = unpacked.votes;

    for (let j=0; j < votes.length; j++) {
      let vote = votes[j];
      let txn = await postSendClaimVote({
        claimUid: vote.claimUid,
        planUid: plan.uid,
        batchUid: batch.uid,
        electorId: batch.signerAccountId,
        index: j,
        result: vote.result
      })
    }

    await delay(1000);
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
