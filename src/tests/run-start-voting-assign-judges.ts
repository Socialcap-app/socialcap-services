/**
 * Submits (some) DRAFT claims in this PLANUID
 */

import { logger, merkleStorage } from "../global.js";
import { getMasterPlan } from "../dbs/plan-helpers.js";
import { getClaimsByPlan } from "../dbs/claim-helpers.js";

const PLAN_UID = '';


async function run(planUid: string) {

// 
// 
//   let members = await (new CommunityMembers()).build(comn.uid);
// 
//   let claims = await getCommunityClaims(comn.uid, members, [CLAIMED]);
// 
//   // now we can start the voting process for each claim
//   for (let j=0; j < claims.length ; j++) {
//     let claim: any = claims[j];
//     let updates = await startClaimVotingProcess(claim);
//     console.log(updates);
// 
//     // wait for X seconds before next one ...
//     const DELAY = 10000;
//     console.log(`Waiting ${DELAY} seconds`);
//     await new Promise((resolve) => setTimeout(resolve, DELAY));
//   }
// 
//   // send the Tx to MINA for zkApp.updateNullifier()
//   // we dont really need this ? 
//   /*
//   await MinaService.updateNullifierRoot(
//     nullifier, 
//     nullifierUpdate,
//     { electors: electors, claim: claim },
//     async (params: any) => { return ; }, // done !
//     (params: any, error: any) => {
//       // nothing we can do ... we just log it
//       logger.error(`updateNullifier root failed err=${error.toString()}`);
//     }
//   )
//   */
}


// we need the Db to be ready before we can do anything
// so we make it wait for 10000 secs before running
merkleStorage.startup();

// Run it
setTimeout(async () => {
  await run(PLAN_UID); 
}, 10000);
