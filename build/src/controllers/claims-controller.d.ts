export declare function getClaim(params: any): Promise<import("../responses.js").ResultOrError>;
export declare function getMyClaims(params: any): Promise<import("../responses.js").ResultOrError>;
export declare function getMyClaimables(params: any): Promise<import("../responses.js").ResultOrError>;
/**
 * Gets all claim instance data that are in a voting state (CLAIMED).
 * We need them for doing rollups over and over again.
 * @param params
 */
export declare function getRunningClaims(params: any): Promise<import("../responses.js").ResultOrError>;
/**
 * Mutations
 */
export declare function addClaim(params: any): Promise<import("../responses.js").ResultOrError>;
export declare function updateClaim(params: any): Promise<import("../responses.js").ResultOrError>;
export declare function updateClaimState(params: {
    uid: string;
    state: number;
    user: any;
}): Promise<import("../responses.js").ResultOrError>;
export declare function submitClaim(params: {
    claim: any;
    extras: any;
    user: any;
}): Promise<import("../responses.js").ResultOrError>;
