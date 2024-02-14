import { Field, PublicKey } from "o1js";
import { VOTING, TALLYING, IGNORED } from "@socialcap/contracts-lib";
import { logger, prisma } from "../global.js";
import { changeAssignedTasksStateByPlan } from "../dbs/task-helpers.js";
import { changeMasterPlanState, getMasterPlan } from "../dbs/plan-helpers.js";
import { postCommitAllBatches } from "../dbs/sequencer-helpers.js";

export { closeAllVoting };


/**
 * Closes the voting process, and does not allow any more batches.
 * - plan state changes to TALLYING, to mark the VOTING as ended
 * - we must mark all unfinished tasks as IGNORED to avoid doing them 
 * - we must rollup all batches and settle them in MINA
 * - we must delete all ephemeral storage (FUTURE)
 * @param planUid the Plan where we stop the voting process
 * @returns the Txn linked to all batches rollup
 */
async function closeAllVoting(
  plan: any
): Promise<any | null> {
  //  mark all unfinished tasks as IGNORED to avoid doing them 
  let count = await changeAssignedTasksStateByPlan(plan.uid, IGNORED); 

  // rollup all batches and settle them in MINA
  let txn = await postCommitAllBatches(plan.uid)

  return {
    unfinishedTasksCount: count,
    transaction: txn
  }
} 
