import { prisma } from "../global.js";
import { DRAFT, CLAIMED, IGNORED, VOTING, UNPAID, REJECTED, APPROVED } from "@socialcap/contracts";
export async function getCommunityClaims(uid, members, states) {
    states = states || [DRAFT, CLAIMED, IGNORED, VOTING, UNPAID, REJECTED, APPROVED];
    // first the bare claims for this community (ALL of them)
    let claims = await prisma.claim.findMany({
        where: { AND: [
                { communityUid: uid },
                { state: { in: states } }
            ] },
        orderBy: { applicantUid: 'asc' }
    });
    // add the applicant info to every claim
    claims = (claims || []).map((claim) => {
        claim.applicant = members.findByUid(claim.applicantUid);
        return claim;
    });
    return claims;
}
export async function getCommunityCounters(uid) {
    const nMembers = await prisma.members.count({
        where: { communityUid: uid },
    });
    const nClaims = await prisma.claim.count({
        where: { AND: [{ communityUid: uid }, { state: CLAIMED }] }
    });
    const nCredentials = await prisma.credential.count({
        where: { communityUid: uid },
    });
    return {
        countMembers: nMembers || 0,
        countClaims: nClaims || 0,
        countCredentials: nCredentials || 0
    };
}
export async function findCommunityByName(name) {
    let communities = await prisma.community.findMany({
        where: { name: name }
    });
    if (!communities || !communities.length)
        return null;
    return communities[0]; // just return the first one we found
}
//# sourceMappingURL=community-helpers.js.map