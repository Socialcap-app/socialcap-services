/**
 * Submits (some) DRAFT claims in this PLANUID
 */

import { logger, merkleStorage } from "../global.js";
import { getMasterPlan } from "../dbs/plan-helpers.js";
import { getClaimsByPlan } from "../dbs/claim-helpers.js";
import { assignAllElectors } from "../services/voting-assign-electors.js";

// the test plan in testdb1
// MINA Navigators
const TEST_PLAN_UID = '8a940b4b26404391ac416429a27df64c';

async function run(planUid: string) {
  await assignAllElectors(planUid);
}

// start the Db
merkleStorage.startup();

// we need the Db to be ready before we can do anything
// so we make it wait for 10000 secs before running
setTimeout(async () => {
  await run(TEST_PLAN_UID); 
}, 5000);
