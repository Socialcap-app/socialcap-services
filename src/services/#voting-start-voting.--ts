import { Field, PublicKey } from "o1js";
import { VOTING, TALLYING, IGNORED, DONE } from "@socialcap/contracts-lib";
import { logger, prisma } from "../global.js";
import { changeAssignedTasksStateByPlan } from "../dbs/task-helpers.js";
import { changeMasterPlanState, getMasterPlan } from "../dbs/plan-helpers.js";
import { Sequencer } from "../sequencer/core/index.js";

export { startVoting }


/**
 * Starts the voting process, and does not allow any more claims.
 * - plan state changes to VOTING
 * - need to create the  PlanVotingAccount 
 * @param planUid the Plan where we start the voting process
 * @returns the Txn linked to the PlanVoting account creation
 */
async function startVoting(
  planUid: string
): Promise<string | null> {
  let plan = await getMasterPlan(planUid);
  if (plan?.state === VOTING)
    return null; // already voting

  if (plan?.state === TALLYING || plan?.state === DONE) { 
    logger.error(`ERROR: We can not change plan=${planUid} state to VOTING.`)
    return null
  }

  plan = await changeMasterPlanState(planUid, VOTING);
  if (!plan) {
    logger.error(`ERROR: Changing plan=${planUid} state to VOTING has FAILED for some DB reason`)
    return null
  }

   let txn = Sequencer.postTransaction(`plan-${planUid}`, {
    type: 'CREATE_PLAN_VOTING_ACCOUNT', 
    data: {
      planUid: plan.uid,
      communityUid: plan.communityUid
    }
  })

  return txn ;
} 
