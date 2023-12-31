/**
 * Counts the votes
 */
import { Field, PublicKey, PrivateKey, Mina, MerkleMap } from "o1js";
import { UID, VotingInstance, ClaimsVotingFactory, NullifierProxy } from "@socialcap/contracts";
import { VOTING, CLAIMED } from "@socialcap/contracts-lib";
import { logger } from "../global.js";
import { getValidators, getAuditors } from "../dbs/members-helpers.js";
import { getEntity, updateEntity } from "../dbs/any-entity-helpers.js"
import { getMasterPlan } from "../dbs/plan-helpers.js";
import { getClaimsByPlan, updateClaimAccountId } from "../dbs/claim-helpers.js";
import { getBatchesByPlan } from "../dbs/batch-helpers.js";
import { addElectorsToNullifier, getNullifierOrRaise } from "../dbs/nullifier-helpers.js";
import { MinaService, setMinaNetwork } from "./mina-service.js";
import { VotingStrategy } from "./voting-strategy.js";
import { assignTaskToElectors } from "./voting-assignments.js";

import { Sequencer } from "../sequencer/core/sequencer.js";

export { runVotesCountingProcess }


/**
 * We count the number of claims with no Account created.
 * @param claims 
 */
function checkClaimVotingAccounts(claims: any[]): boolean {

}



async function createClaimVotingAccounts(plan: any, claims: any[]) {
  // we now traverse claims to create the account if not created
  for (let j=0; j < claims.length; j++) {
    let claim = claims[j];

    if (! claim.accountId) {
      // we must dispatch a transaction for creating the account
      await Sequencer.postTransaction('voting_accounts_creation', {
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
  }
}


async function processVotesBatch()

async function __runVotesCountingProcess()
/* 
// get the Masterplan data
let plan = await getPlan(planUid);

// get all claims in CLAIMED state for this Masterplan
let claims = await getClaimsByPlan(planUid, [CLAIMED]); 

// get all VotingBatches for this Masterplan
let batches = await getBatchesByPlan(planUid, WAITING);

// we repeat until all votes have been dispatched
const 
  ALL_DISPATCHED = 1, 
  HAS_PENDING_VOTES = 2, 
  UNABLE_TO_DISPATCH = 3;

let status = HAS_PENDING_VOTES;

while (status === HAS_PENDING_VOTES && status !== UNABLE_TO_DISPATCH) {
  status = await dispatchBatchVotes(batch);
}

async function dispatchBatchVotes(batch): Promise<number> {
  // check signature and decrypt data
  
  // we traverse all votes in the batch
  
  if the claim has no account (either empty or ?)
  // send to Sequencer so we can create it
  
  if the claim has an account
  // send the vote to the Sequencer so we can count it
}
















*/


















async function runVotesCountingProcess(
  claim: any,
) {
  try {
    if (claim.state !== CLAIMED)
      return;

    console.log("\n\n\n-------");
    console.log("Claim=", claim.uid, claim.state, claim.planUid, claim.communityUid);

    let plan = await getEntity("plan", claim.planUid);
    let planStrategy = JSON.parse(plan.strategy);

    console.log("Strategy=", planStrategy);
    
    // MUST be sure before deploying ...
    setMinaNetwork();

    /*
    let deployed: VotingInstance = await ClaimsVotingFactory.deploy(
      UID.toField(params.uid), 
      Field(strategy.minVotes),
      Field(strategy.minPositives),
      PublicKey.fromBase58(process.env.DEPLOYER_ID as string),
      PrivateKey.fromBase58(process.env.DEPLOYER_KEY as string),
    );
    */ 

    // get validators and auditors set  
    let validators = await getValidators(claim.communityUid);
    let auditors = await getAuditors(claim.communityUid);

    console.log("Auditors=", auditors);
    
    // now select the electors using the strategy binded to this plan
    let electors = (new VotingStrategy(planStrategy)).selectElectors(
      validators,
      auditors
    );

    console.log("Electors=", electors);

    // now prepare the Nullifier to avoid invalid/double voting 
    console.log("Add electors to nullifier=",claim);
    const nullifier = await getNullifierOrRaise();
    let nullifierUpdate = await addElectorsToNullifier(
      nullifier, 
      claim.uid, 
      electors
    );

    // after the Nullifier was updated we can now 
    // assign the task to the selected electors
    console.log("startVoting claim=",claim);
    await assignTaskToElectors(claim, electors); 

    let params = {
      uid: claim.uid,
      accountId: '', // $TODO$ deployed.address.toBase58();
      state: VOTING
    } 
    let result = await updateEntity("claim", params.uid, params);
    claim = result.proved;

    return {
      claim,
      nullifierUpdate
    }
  }
  catch (err: any) {
    logger.error("Could not startClaimVotingProcess err="+err.toString());
  }
}
