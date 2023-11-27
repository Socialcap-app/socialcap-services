import { VOTING } from "@socialcap/contracts";
import { prisma } from "../global.js";
/**
 * Gets all claim instance data that are in a voting state (CLAIMED).
 * We need them for doing rollups over and over again.
 * @param params
 */
export async function getRunningClaims(params) {
    // all commnunity Uids where is a a member
    const claims = await prisma.claim.findMany({
        where: { state: VOTING },
        orderBy: { createdUTC: 'asc' }
    });
    return claims || [];
}
export async function updateClaimVotes(params) {
    const claim = await prisma.claim.update({
        where: { uid: params.uid },
        data: {
            positiveVotes: params.positive,
            negativeVotes: params.negative,
            ignoredVotes: params.ignored,
            updatedUTC: (new Date()).toISOString()
        }
    });
    return claim;
}
export async function updateClaimAccountId(params) {
    const claim = await prisma.claim.update({
        where: { uid: params.uid },
        data: {
            accountId: params.accountId,
            updatedUTC: (new Date()).toISOString()
        }
    });
    return claim;
}
//# sourceMappingURL=claims-helper.js.map