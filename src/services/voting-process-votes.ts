import { Field, PublicKey } from "o1js";
import { TALLYING, WAITING, DONE } from "@socialcap/contracts-lib";
import { logger } from "../global.js";
import { getBatchesByPlan, SignedVote } from "../dbs/batch-helpers.js";
import { getMasterPlan } from "../dbs/plan-helpers.js";
import { Sequencer } from "../sequencer/core/index.js";

export { processVotesBatches }

/**
 * Process each batch in the closed voting Plan by traversing it and 
 * sending each vote to the correct ClaimVoting zkApp. 
 * @param planUid 
 */
async function processVotesBatches(
  planUid: string
) {
  let plan = await getMasterPlan(planUid);
  if (plan?.state !== TALLYING) {
    logger.error(`ERROR: Plan=${planUid} is not in the TALLYING state.`)
    return null
  }
  let planStrategy = JSON.parse((plan.strategy || "{}"));

  // get all batches belonging to this plan  
  let batches = await getBatchesByPlan(planUid, { states: [WAITING, DONE]});

  for (let j=0; j < (batches || []).length; j++) {
    await dispatchBatchVotes(batches[j], plan); 
    await delay(1000);
  }
}


/**
 * Dispatchs all votes in a given batch to the zkApp using the Sequencer
 * Before dispatching the votes we must verify the signed data.
 * @param batch 
 * @param plan 
 */

async function dispatchBatchVotes(
  batch: any,
  plan: any
) {
  // check signature and decrypt data
  // $TODO$

  // votes in the batch
  let votes: SignedVote[] = JSON.parse(batch.signedData || "[]");

  for (let j=0; j < votes.length; j++) {
    let vote = votes[j];
    Sequencer.postTransaction(`claim-${vote.claimUid}`, {
      type: 'SEND_CLAIM_VOTE',
      data: {
        planUid: plan.uid,
        batchUid: batch.uid,
        claimUid: vote.claimUid,
        electorAccountId: batch.signerAccountId,
        index: j,
        vote: vote.result
      }
    })
  }
}


function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
