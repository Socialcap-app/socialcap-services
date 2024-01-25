import { UID } from "@socialcap/contracts-lib";
import { CLAIMED, WAITING, UNPAID, VOTING } from "@socialcap/contracts-lib";
import { fastify, prisma, logger } from "../global.js";

/**
 * Gets a claim given its unique uid.
 * @param uid 
 * @returns Claim object (prisma.claim) or Null
 */
export async function getClaim(uid: string) {
  let data = await prisma.claim.findUnique({ where: { uid: uid }});
  return data; 
}

/**
 * Gets all claim instance data that are in a voting state (CLAIMED).
 * We need them for doing rollups over and over again.
 * @param params 
 * @returns array of running claims
 */
export async function getRunningClaims(params?: any) {
  // all commnunity Uids where is a a member
  const claims = await prisma.claim.findMany({
    where: { state: VOTING },
    orderBy: { createdUTC: 'asc' }
  })
  return claims || [];
}

/**
 * Get all claims in the given states, belonging to this plan. 
 * @param planUid 
 * @param params 
 * @returns 
 */
export async function getClaimsByPlan(planUid: string, params: {
  states: number[]
}) {
  const claims = await prisma.claim.findMany({
    where: { AND: [
      { planUid: { equals: planUid }},
      { state: { in: params.states || [] }}
    ]},
    orderBy: { createdUTC: 'desc' }
  })
  return claims || [];

  // let filtered = (claims || []).filter((claim) => {
  //   console.log("included? ", params.states, claim.state, params.states.includes(claim.state as number) )
  //   return (params.states.includes(claim.state))
  // })
  // return filtered || [];
}

export async function updateClaimVotes(params: {
  uid: string,
  positive: number,
  negative: number,
  ignored: number
}) {
  const claim = await prisma.claim.update({
    where: { uid: params.uid },
    data: { 
      positiveVotes: params.positive,
      negativeVotes: params.negative,
      ignoredVotes: params.ignored,
      updatedUTC: (new Date()).toISOString()
    }
  })  

  return claim;
}


export async function updateClaimAccountId(uid: string, params: {
  accountId: string
}) {
  const claim = await prisma.claim.update({
    where: { uid: uid },
    data: { 
      accountId: params.accountId,
      updatedUTC: (new Date()).toISOString()
    }
  })  

  return claim;
}
