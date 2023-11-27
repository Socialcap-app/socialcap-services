export declare function getCommunity(params: any): Promise<import("../responses.js").ResultOrError>;
/**
 * Extends the getCommunity() to return information only available
 * to its administrator, such as pending validators approvals,
 * masterplans, etc...
 */
export declare function getAdminedCommunity(params: any): Promise<import("../responses.js").ResultOrError>;
export declare function updateCommunity(params: any): Promise<import("../responses.js").ResultOrError>;
export declare function getMyCommunities(params: any): Promise<import("../responses.js").ResultOrError>;
export declare function getAllCommunities(params: any): Promise<import("../responses.js").ResultOrError>;
export declare function prepareCommunityClaimsDownload(uid: string, fileName: string, states?: string): Promise<boolean>;
