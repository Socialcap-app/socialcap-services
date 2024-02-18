import { Field, PublicKey } from "o1js";
import { TALLYING, WAITING, VOTING, DONE } from "@socialcap/contracts-lib";
import { logger } from "../global.js";
import { getBatchesByPlan, SignedVote, unpackSignedData } from "../dbs/batch-helpers.js";
import { postCreateClaimVotingAccount, postSendClaimVote, SubmittedTxn } from "../dbs/sequencer-helpers.js";
import { getClaimsByPlan } from "../dbs/claim-helpers.js";

export { processVotesBatches, TallyProcessResult }

interface TallyProcessResult {
    batchesCount: number;
    votesCount: number;
    claimsCount: number;
    // the set of all created txns 
    transactions: SubmittedTxn[]
}


/**
 * Process each batch in the closed voting Plan by traversing it and 
 * sending each vote to the correct ClaimVoting zkApp. 
 * @param planUid 
 */
async function processVotesBatches(
  plan: any
): Promise<TallyProcessResult> {
  let batchesCount = 0, votesCount = 0, claimsCount = 0;
  let txns: SubmittedTxn[] = [];
  let claimsMap = new Map<string, any>();
  let countedClaims = new Map<string, boolean>();

  let planStrategy = JSON.parse((plan.strategy || "{}"));

  // get all batches belonging to this plan  
  let batches = await getBatchesByPlan(plan.uid, { states: [WAITING, DONE]});

  // get all claims for this plan, is needed to check if the claim already
  // has an zkApp account created for it
  let claims = await getClaimsByPlan(plan.uid, { states: [VOTING]});
  for (let j=0; j < claims.length; j++) {
    claimsMap.set(claims[j].uid, claims[j])
  }

  for (let k=0; k < (batches || []).length; k++) {
    let batch = batches[k];
    batchesCount++;

    // votes in the batch
    let unpacked = JSON.parse(batch.signedData);
    let votes: SignedVote[] = unpacked.votes;

    for (let j=0; j < votes.length; j++) {
      let vote = votes[j];
      votesCount++;

      // check if claim was already counted
      if (!countedClaims.has(vote.claimUid)) {
        countedClaims.set(vote.claimUid, true);
        claimsCount++;

        // check if we have an zkApp account for this claim and if not 
        // we send a create transaction BEFORE sending votes to it
        let claim = claimsMap.get(vote.claimUid);
        if (!claim.accountId) {
          let txn = await postCreateClaimVotingAccount({
            claimUid: vote.claimUid,
            strategy: planStrategy
          })
          txns.push({ uid: txn.uid, type: txn.type })
        }
      }

      // we can send the vote, BUT we do not need to check if it was counted
      // before, because the contract and the Nullifier will do that and 
      // will ignore an already processed vote
      let txn = await postSendClaimVote({
        claimUid: vote.claimUid,
        planUid: plan.uid,
        batchUid: batch.uid,
        electorId: batch.signerAccountId,
        index: j,
        result: vote.result
      })
      txns.push({ uid: txn.uid, type: txn.type })
    }

    await delay(1000);
  }

  return {
    batchesCount: batchesCount,
    votesCount: votesCount,
    claimsCount: claimsCount,
    transactions: txns
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
