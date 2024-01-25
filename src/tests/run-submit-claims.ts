/**
 * Submit all claims in DRAFT belonging to the TEST_PLAN_UID in testdb0
 * For each claims it will: 
 *  1. Call the submitClaim controller
 *  2. Change the claim state
 *  3. Post a transaction to create the Claim account
 */
import { logger, merkleStorage } from "../global.js";
import { DRAFT, CLAIMED } from "@socialcap/contracts-lib";
import { getClaimsByPlan } from "../dbs/claim-helpers.js";
import { submitClaim } from "../controllers/claims-controller.js";
import { delay } from "./test-helpers.js";

// the test plan in testdb0
// MINA Navigators
const TEST_PLAN_UID = '8a940b4b26404391ac416429a27df64c';

async function run(planUid: string) {

  let claims = await getClaimsByPlan(planUid, { states: [DRAFT]});

  for (let j=0; j < claims.length ; j++) {
    let claim: any = claims[j];

    let rs = await submitClaim({
      claim: claim,
      extras: {transaction: "", waitForPayment: false, addToQueue: true},
      user: { uid: claim.applicantUid }
    })
    console.log(`Submitted claim ${claim.uid} rs=`, rs);

    await delay(2000);
  }
}

// start the Db
merkleStorage.startup();

// we need the Db to be ready before we can do anything
// so we make it wait for 10000 secs before running
setTimeout(async () => {
  await run(TEST_PLAN_UID); 
}, 5000);
