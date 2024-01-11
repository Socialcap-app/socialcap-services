import { prisma, logger } from "../global.js";
import { CANCELED,ASSIGNED,DONE,IGNORED } from "@socialcap/contracts-lib";

/**
 * Change the state of all ASSIGNED tasks in the Plan that were not completed 
 * by the electors. We mark them as IGNORED becuase the elector just ignored
 * them and did not submit his vote.
 * @param planUid - the plan containing the tasks to change
 * @param state the new state (default is IGNORED)
 */
export async function changeAssignedTasksStateByPlan(
  planUid: string, 
  state: number
): Promise<number> {
  let allAssigned = await prisma.task.findMany({ where: { planUid: planUid }});
  (allAssigned || []).forEach(async (t) => {
    await prisma.task.update({ 
      where: { uid: t.uid },
      data: {
        state: state,
        completedUTC: (new Date()).toISOString()
      } 
    });
  });
  return (allAssigned || []).length;
}
