// import Fastify from 'fastify';
import { logger, merkleStorage } from "./global.js";
import { CLAIMED } from "@socialcap/contracts";
import { OffchainMerkleStorage } from "./dbs/offchain-merkle-storage.js";
import { OffchainMerkleMap } from "./dbs/offchain-merkle-map.js";
import { startClaimVotingProcess } from "./services/voting-process.js";
import { CommunityMembers } from "./dbs/members-helper.js";
import { getCommunityClaims, findCommunityByName } from "./dbs/community-helpers.js";

const COMMUNITY_NAME = 'MINA Navigators Community';
const VOTES_MERKLE_MAP = 10;
const NULLIFIER = 8;


/**
 * Start the voting process in batch mode for all CLAIMED claims 
 * in the give community,
 */
async function run(communityName: string) {

  // reset this ones so we can start fresh 
  // let votesMerkleMap = await OffchainMerkleStorage.resetMerkleMap(VOTES_MERKLE_MAP);

  let nullifier = await OffchainMerkleStorage.resetMerkleMap(NULLIFIER);

  // we now need to get all claims from this community
  let comn = await findCommunityByName(communityName);
  if (! comn) {
    console.log(`${COMMUNITY_NAME} NOT found`)
    return;
  }

  let members = await (new CommunityMembers()).build(comn.uid);

  let claims = await getCommunityClaims(comn.uid, members, [CLAIMED]);

  // now we can start the voting process for each claim
  for (let j=0; j < claims.length ; j++) {
    let claim: any = claims[j];
    let updates = await startClaimVotingProcess(claim);
    console.log(updates);

    // wait for X seconds before next one ...
    const DELAY = 10000;
    console.log(`Waiting ${DELAY} seconds`);
    await new Promise((resolve) => setTimeout(resolve, DELAY));
  }

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
  await run(COMMUNITY_NAME); 
}, 10000);
