import { Field, PublicKey } from "o1js";
import { VOTING, TALLYING, IGNORED } from "@socialcap/contracts-lib";
import { logger, prisma } from "../global.js";
import { changeAssignedTasksStateByPlan } from "../dbs/task-helpers.js";
import { changeMasterPlanState, getMasterPlan } from "../dbs/plan-helpers.js";
import { Sequencer } from "../sequencer/core/index.js";

export {
}

/**
 * Closes the voting process, and does not allow any more batches.
 * - plan state changes to TALLYING, to mark the VOTING as ended
 * - we must mark all unfinished tasks as IGNORED to avoid doing them 
 * - we must rollup all batches and settle them in MINA
 * - we must delete all ephemeral storage (FUTURE)
 * @param planUid the Plan where we stop the voting process
 * @returns the Txn linked to all batches rollup
 */
async function closeVoting(
  planUid: string
): Promise<string | null> {
  let plan = await getMasterPlan(planUid);
  if (plan?.state !== VOTING) {
    logger.error(`ERROR: We can not change plan=${planUid} state to TALLYING. The plan is not in the VOTING state`)
    return null
  }

  plan = await changeMasterPlanState(planUid, TALLYING);
  if (!plan) {
    logger.error(`ERROR: Changing plan=${planUid} state to TALLYING has FAILED for some DB reason`)
    return null
  }

  let count = await changeAssignedTasksStateByPlan(planUid, IGNORED); 

  // rollup all batches and settle them in MINA
   let txn = Sequencer.postTransaction(`plan-${planUid}`, {
    type: 'COMMIT_ALL_BATCHES', 
    data: {
      planUid: planUid
    }
  })

  return txn ;
} 
