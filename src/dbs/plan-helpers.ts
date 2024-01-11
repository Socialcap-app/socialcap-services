import { prisma } from "../global.js";

export async function findMasterPlanByName(communityUid: string, name: string) {
  let plans = await prisma.plan.findMany({
    where: { AND: [
      { name: name },
      { communityUid: communityUid }
    ]}
  });

  if (! plans || !plans.length)
    return null;
  
  return plans[0]; // just return the first one we found
}

export async function getMasterPlan(uid: string) {
  let plan = await prisma.plan.findUnique({
    where: { uid: uid }
  });
  return plan ; 
}

/**
 * Change only the plan state.
 * @param uid 
 * @param state 
 * @returns the modified plan
 */
export async function changeMasterPlanState(uid: string, state: number) {
  let plan = await prisma.plan.update({
    where: { uid: uid },
    data: {
      state: state,
      updatedUTC: (new Date()).toISOString()
    }
  });
  return plan ; 
}
