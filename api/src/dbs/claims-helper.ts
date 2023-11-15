import { UID } from "@socialcap/contracts";
import { CLAIMED, WAITING, UNPAID, VOTING } from "@socialcap/contracts";
import { fastify, prisma, logger } from "../global.js";

/**
 * Gets all claim instance data that are in a voting state (CLAIMED).
 * We need them for doing rollups over and over again.
 * @param params 
 */
export async function getRunningClaims(params?: any) {
  // all commnunity Uids where is a a member
  const claims = await prisma.claim.findMany({
    where: { state: VOTING },
    orderBy: { createdUTC: 'asc' }
  })
  return claims || [];
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


