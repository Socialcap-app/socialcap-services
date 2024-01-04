import { CLAIMED, WAITING, VOTING } from "@socialcap/contracts-lib";
import { getMasterPlan } from "../dbs/plan-helpers.js";
import { getClaimsByPlan, updateClaimAccountId } from "../dbs/claim-helpers.js";
import { getBatchesByPlan } from "../dbs/batch-helpers.js";
import { SignedVote, VotesBatchMetadata } from "../dbs/batch-helpers.js";
import { Sequencer } from "../sequencer/core/index.js"

/*
VotesBatch {
    uid: UID.uuid4(),
    // sequence @default(autoincrement()) // Db assigns sequence number
    type: "VOTES", // mark as a VOTES batch
    metadata: JSON.stringify({
      communityUid: firstVote.communityUid,
      planUid: firstVote.planUid,
      assigneeUid: firstVote.assigneeUid,
    }),
    signerAccountId: params.senderAccountId, // this is the Signed data received    
    signedData: params.signedData.data, // JSON string
    signatureField: params.signedData.signature.field,
    signatureScalar: params.signedData.signature.scalar,
    size: votes.length,
    commitment: "", // initially it is empty
    state: WAITING, // we wait for the sequencer to process it
    // submitedUTC @default(now()) // Db assigns the now UTC 
}

export interface SignedVote {
  uid: string, // the taskUid
  claimUid: string,
  assigneeUid: string,
  communityUid: string,
  planUid: string
  result: string, // "+1: Positive" "-1: Negative" "0: Abstain" 
}

export interface VotesBatchMetadata {
  communityUid: string,// the community where the voting process is happening
  planUid: string, // the Master Plan Uid of the credential being voted
  assigneeUid: string, // the elector Uid who submitted this batch
}
*/

const 
  ALL_DISPATCHED = 1, 
  HAS_PENDING_VOTES = 2, 
  UNABLE_TO_DISPATCH = 3;

const qname = (uid: string) => `claim-${uid}`; // the queue name 

/** 
 * Starts the tallying process and dispatches all votes in every batch
 * till all votes have been dispatched or process has failed.
 */
async function startTallying(planUid: string, options: {}) {

  // get the Masterplan data
  let plan = await getMasterPlan(planUid);

  // get all claims in CLAIMED state for this Masterplan
  let claims = await getClaimsByPlan(planUid, { states: [CLAIMED] }); 

  // get all VotingBatches for this Masterplan
  let batches = await getBatchesByPlan(planUid, { states: [WAITING] });

  // we repeat until all votes have been dispatched
  for (let j=0; j < batches.length; j++) {

    let status = HAS_PENDING_VOTES;
  
    while (status === HAS_PENDING_VOTES || status !== UNABLE_TO_DISPATCH) {
      status = await dispatchBatchVotes(batches[j], claims, plan);

      // wait before trying again
      await delay(5000);
    }
  }
}


async function dispatchBatchVotes(
  batch: any,
  claims: any[],
  plan: any
): Promise<number> {
  // check signature and decrypt data
  
  // build a claims Dictio to improve searching a claim
  const claimsDictio = new Map<string, any>();
  claims.forEach((claim) => {
    claimsDictio.set(claim.uid, claim);
  })

  // we traverse all votes in the batch
  let votes = JSON.parse(batch.signedData || "[]");

  let count = 0;

  for (let j=0; j < votes.length; j++) {
    let vote = votes[j] as SignedVote;
    console.log(`\nVote claim=${vote.claimUid} result=${vote.result} elector=${batch.signerAccountId} `);

    let claim = claimsDictio.get(vote.claimUid);
    if (!claim.accountId)
      await createClaimVotingAccount(claim, plan);

    await dispatchClaimVote(vote, claim, batch);  
  }  

  return ALL_DISPATCHED;
}


async function createClaimVotingAccount(claim: any, plan: any) {
    // we must dispatch a transaction for creating the account
    await Sequencer.postTransaction(qname(claim.uid), {
      type: 'CREATE_CLAIM_VOTING_ACCOUNT',
      data: {
        claimUid: claim.uid,
        strategy: plan.strategy,
      }
    });

    // and change the AccountId to '?' so we do not process it again
    claim = await updateClaimAccountId(claim.uid, {
      accountId: '?' // unknown for now, until the Sequencer changes it
    }) 
}


async function dispatchClaimVote(vote: any, claim: any, batch: any) {
    // we must dispatch a transaction for creating the account
    await Sequencer.postTransaction(qname(claim.uid), {
      type: 'SEND_CLAIM_VOTE',
      data: {
        claimUid: claim.uid,
        vote: vote.result,
        batchUid: batch.uid
      }
    });
}


function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
