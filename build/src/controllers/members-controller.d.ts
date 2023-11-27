export declare function joinCommunity(params: any): Promise<import("../responses.js").ResultOrError>;
export declare function updateMemberRole(params: {
    communityUid: string;
    personUid: string;
    role: number;
    user: any;
}): Promise<import("../responses.js").ResultOrError>;
export declare function promoteMember(params: any): Promise<import("../responses.js").ResultOrError>;
