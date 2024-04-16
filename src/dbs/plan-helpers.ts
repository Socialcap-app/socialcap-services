import { DRAFT, ACTIVE } from "@socialcap/contracts-lib";
import { prisma } from "../global.js";
import Sql from "./sql-helpers.js";

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


/**
 * Change only the plan state.
 * @param uid 
 * @param state 
 * @returns the modified plan
 */
export async function findAdminedMasterPlans(userUid: string) {
  const states = [DRAFT, ACTIVE];
  const plans = await Sql`
    SELECT 
      uid, name, state, state_descr, 
      description, image,
      community, community_uid, 
      created_utc, updated_utc
    FROM plans_view
    WHERE 
      state in ${ Sql(states) } 
      and admins ilike ${ '%'+userUid+'%' }
    ORDER BY state_descr asc, name asc
  `;
  return (plans || []);
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
