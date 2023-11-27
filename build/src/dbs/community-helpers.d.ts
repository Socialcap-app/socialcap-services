import { CommunityMembers } from "./members-helper.js";
export declare function getCommunityClaims(uid: string, members: CommunityMembers, states?: number[]): Promise<any>;
export declare function getCommunityCounters(uid: string): Promise<{
    countMembers: number;
    countClaims: number;
    countCredentials: number;
}>;
export declare function findCommunityByName(name: string): Promise<(import("@prisma/client/runtime/library.js").GetResult<{
    uid: string;
    accountId: string | null;
    adminUid: string;
    state: string;
    name: string;
    description: string | null;
    image: string | null;
    createdUTC: Date;
    updatedUTC: Date;
    approvedUTC: Date | null;
    xadmins: string | null;
}, unknown, never> & {}) | null>;
