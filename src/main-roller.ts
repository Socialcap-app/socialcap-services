import 'dotenv/config';
import { Mina, PublicKey, PrivateKey } from 'o1js';
import { logger, prisma } from "./global.js";
import { ClaimsVotingFactory, ClaimVotingContract, APPROVED, REJECTED, IGNORED } from "@socialcap/contracts";
import { rollupClaims } from "./services/voting-rollups.js";
//import { updateEntity } from './dbs/any-entity-helpers.js';
import { getRunningClaims } from './dbs/claims-helper.js';
import { updateEntity } from './dbs/any-entity-helpers.js';

console.log("\nRunning on Mina.Berkeley");

const 
  BERKELEY_URL = 'https://proxy.berkeley.minaexplorer.com/graphql',
  ARCHIVE_URL = 'https://archive.berkeley.minaexplorer.com/',
  SENDER_KEY = process.env.SENDER_KEY as string,
  SENDER_ID = process.env.SENDER_ID as string,
  DEPLOYER_KEY = process.env.DEPLOYER_KEY as string,
  DEPLOYER_ID = process.env.DEPLOYER_ID as string;

const Berkeley = Mina.Network({
  mina: BERKELEY_URL, 
  archive: ARCHIVE_URL
});

Mina.setActiveInstance(Berkeley);

console.log("compiling the Contract ");
//await ClaimVotingContract.compile();


/**
 * Run the server!
 */
async function rolling() {
  let senderAccount = PublicKey.fromBase58(SENDER_ID);
  let senderKey = PrivateKey.fromBase58(SENDER_KEY);

  for (;;) {
    // collect all running claims
    let claims = await getRunningClaims();
    // console.log("claims=", claims);

    // rollup all 
    let finished = await rollupClaims(
      claims,
      // we should think about who will be the payer here, maybe a special 
      // Socialcap account for this funded on demand ?
      senderAccount, senderKey
    );

    // change state of all finished Claims
    finished = await updateFinishedClaims(finished);

    // wait for 30 secs before next rollup
    await new Promise((resolve) => setTimeout(resolve, 10000)); 
  }
}


async function updateFinishedClaims(finished: any): Promise<any[]> {
  let updated: any[] = [];

  for (let j=0; j < finished.length; j++) {
    let data = finished[j];
    if (!data.result) continue;
    
    /*
    Claims states
      REJECTED,   
      APPROVED
      IGNORED ?

    ClaimVotingContract results
      VOTING = Field(0),   // Claim is still in the voting process
      APPROVED = Field(1),
      REJECTED = Field(2),
      CANCELED = Field(3); // TODO: not sure how can we change this state ?    
    */
    data.claim.state = data.result === 1 ? APPROVED : data.result === 2 ? REJECTED : IGNORED; 
    data.claim.positiveVotes = data.positive; 
    data.claim.negativeVotes = data.negative;
    data.claim.ignoredVotes = data.ignored;
    let now = (new Date()).toISOString();
    data.claim.updatedUTC = now;
    data.claim.votedUTC = now;
    data.claim.issuedUTC = now;
    let rs = await updateEntity("claim", data.claim.uid, data.claim);
    updated.push(rs.proved);
  }

  return updated;
}

// start 
rolling();
