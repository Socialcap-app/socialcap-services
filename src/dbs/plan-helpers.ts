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


/**
 * Get all active Masterplans beloging to communities 
 * where the user is an active member (roles: 1,2,3)
 * and that are not yet ended.
 */
export async function getMyClaimableMasterPlans(
  userUid: string,
  joined: boolean
) {
  const states = [ACTIVE];
  joined = (joined !== undefined) ? joined : true;
  const today2359 = (new Date()).toISOString().split('T')[0]+'T23:59:59';
  const today0000 = (new Date()).toISOString().split('T')[0]+'T00:00:00';
  /*
  const plans = await Sql`
    SELECT 
      pl.uid, name, description, image, 
      state, state_descr, 
      starts_utc, ends_utc, pl.created_utc, updated_utc, pl.approved_utc, 
      community, pl.community_uid, admins, 
      pl.available,pl.fee,pl.total,
      mm.person_uid, mm.role as member_role
    FROM plans_view pl, members mm
    WHERE pl.community_uid = mm.community_uid
     AND mm.role in ('1','2','3')	
     AND mm.person_uid = ${ userUid }
     AND pl.state in ${ Sql(states) } and ends_utc > ${ today } 
  `;
  **/
  const plans = await Sql`
    SELECT 
      pv.uid, 
      name as type, 
      description, 
      image, banner,
      state, state_descr, 
      starts_utc, ends_utc, 
      pv.created_utc, updated_utc, pv.approved_utc, 
      community, pv.community_uid, 
      admins, 
      pv.available,pv.fee,pv.total,
      CASE WHEN m.community_uid IS NOT NULL THEN true ELSE false END AS joined
    FROM 
      plans_view pv
      LEFT JOIN members m 
        ON pv.community_uid = m.community_uid
        AND m.role IN ('1', '2', '3')
        AND m.person_uid = ${ userUid }
    WHERE 
      pv.state in ${ Sql(states) } 
      AND starts_utc <= ${ today0000 } 
      AND ends_utc > ${ today2359 } 
      ${ joined 
        ? Sql` AND m.community_uid IS NOT NULL`
        : Sql``
      }
  `;
  return (plans || []);
}
