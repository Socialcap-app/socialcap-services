/**
 * Gets all claim instance data that are in a voting state (CLAIMED).
 * We need them for doing rollups over and over again.
 * @param params
 */
export declare function getRunningClaims(params?: any): Promise<(import("@prisma/client/runtime/library.js").GetResult<{
    uid: string;
    communityUid: string;
    applicantUid: string;
    planUid: string;
    state: number;
    accountId: string | null;
    alias: string | null;
    createdUTC: Date;
    updatedUTC: Date;
    votedUTC: Date | null;
    issuedUTC: Date | null;
    dueUTC: Date | null;
    requiredVotes: number | null;
    requiredPositives: number | null;
    positiveVotes: number | null;
    negativeVotes: number | null;
    ignoredVotes: number | null;
    evidenceData: string | null;
}, unknown, never> & {})[]>;
export declare function updateClaimVotes(params: {
    uid: string;
    positive: number;
    negative: number;
    ignored: number;
}): Promise<import("@prisma/client/runtime/library.js").GetResult<{
    uid: string;
    communityUid: string;
    applicantUid: string;
    planUid: string;
    state: number;
    accountId: string | null;
    alias: string | null;
    createdUTC: Date;
    updatedUTC: Date;
    votedUTC: Date | null;
    issuedUTC: Date | null;
    dueUTC: Date | null;
    requiredVotes: number | null;
    requiredPositives: number | null;
    positiveVotes: number | null;
    negativeVotes: number | null;
    ignoredVotes: number | null;
    evidenceData: string | null;
}, unknown, never> & {}>;
export declare function updateClaimAccountId(params: {
    uid: string;
    accountId: string;
}): Promise<import("@prisma/client/runtime/library.js").GetResult<{
    uid: string;
    communityUid: string;
    applicantUid: string;
    planUid: string;
    state: number;
    accountId: string | null;
    alias: string | null;
    createdUTC: Date;
    updatedUTC: Date;
    votedUTC: Date | null;
    issuedUTC: Date | null;
    dueUTC: Date | null;
    requiredVotes: number | null;
    requiredPositives: number | null;
    positiveVotes: number | null;
    negativeVotes: number | null;
    ignoredVotes: number | null;
    evidenceData: string | null;
}, unknown, never> & {}>;
