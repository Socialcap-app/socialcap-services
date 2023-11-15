// import Fastify from 'fastify';
import { logger, merkleStorage } from "./global.js";
import { WAITING } from "@socialcap/contracts";
import { OffchainMerkleStorage } from "./dbs/offchain-merkle-storage.js";
import { findCommunityByName } from "./dbs/community-helpers.js";
import { findMasterPlanByName } from "./dbs/plan-helpers.js";
import { getBatchesByPlan } from "./dbs/batch-helpers.js";
import { updateClaimVotes } from "./dbs/claims-helper.js";

const COMMUNITY_NAME = 'MINA Navigators Community';
const PLAN_NAME = 'MINA Navigators Hackaton';
const VOTES_MERKLE_MAP = 10;
const NULLIFIER = 8;


/**
 * Traverse all votes batches and count the votes for each claim
 * in the given community.
 */
async function run(communityName: string, planName: string) {

  let nullifier = await OffchainMerkleStorage.getMerkleMap(NULLIFIER);

  let comn = await findCommunityByName(communityName);
  if (! comn) {
    console.log(`${communityName} NOT found`)
    return;
  }

  let plan = await findMasterPlanByName(comn.uid, planName);
  if (! plan) {
    console.log(`${planName} NOT found`)
    return;
  }

  let batches = await getBatchesByPlan(plan.uid, WAITING);

  interface ClaimVotes {
    uid: string,
    positive: number,
    negative: number,
    ignored: number
  }

  let collector: any = {}; // this will be the claims voting collector dictio

  // now we can start traversing the votes batches
  for (let j=0; j < batches.length ; j++) {
    
    let batch: any = batches[j];
    console.log(`\nBatch ${batch.uid} elector=${batch.signerAccountId} plan=${plan.uid}`);

    // we need to verify the signature 
    // if (! verifiedSignedData(batch) 
    // continue; // next batch

    let votes = JSON.parse(batch.signedData || "[]") as any[];

    for (let j=0; j < votes.length; j++) {
      let vote = votes[j];
      console.log(vote);
      console.log(`\nVote claim=${vote.claimUid} result=${vote.result} elector=${batch.signerAccountId} `);

      let result = {
        positive: (vote.result === "1") ? 1 : 0,
        negative: (vote.result === "-1") ? 1 : 0,
        ignored: (vote.result === "0") ? 1 : 0,
      }

      // check if the claimCollector exists
      if (! collector[vote.claimUid]) {
        collector[vote.claimUid] = {
          uid: "",
          positive: 0,
          negative: 0,
          ignored: 0
        }
      }

      // sum the votes for this claim !
      let claimVotes = collector[vote.claimUid];
      collector[vote.claimUid] = {
        uid: vote.claimUid,
        positive: claimVotes.positive + result.positive,
        negative: claimVotes.negative + result.negative,
        ignored: claimVotes.ignored + result.ignored
      }
    }
  }

  console.log("\n\n\nFinal count Claim + - 0");
  Object.keys(collector).forEach(async (key) => {
    let t = collector[key];
    console.log(`Claim ${t.uid}  Y=${t.positive} N=${t.negative} A=${t.ignored}`);

    let claim = await updateClaimVotes({
      uid: t.uid,
      positive: t.positive,
      negative: t.negative,
      ignored: t.ignored
    })
  })

  // send the Tx to MINA for zkApp.updateNullifier()
  // we dont really need this ? 
  /*
  await MinaService.updateNullifierRoot(
    nullifier, 
    nullifierUpdate,
    { electors: electors, claim: claim },
    async (params: any) => { return ; }, // done !
    (params: any, error: any) => {
      // nothing we can do ... we just log it
      logger.error(`updateNullifier root failed err=${error.toString()}`);
    }
  )
  */

}


// we need the Db to be ready before we can do anything
// so we make it wait for 10000 secs before running
merkleStorage.startup();

// Run it
setTimeout(async () => {
  await run(COMMUNITY_NAME, PLAN_NAME); 
}, 10000);
