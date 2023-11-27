/**
 * signUp
 * Starts the onboarding process for a new user.
 * @param params Object: { email, ... }
 * @returns MutationResult
 */
export declare function signUp(params: {
    full_name: string;
    email: string;
    phone?: string;
    telegram?: string;
}): Promise<import("../responses.js").ResultOrError>;
export declare function getProfile(params: any): Promise<import("../responses.js").ResultOrError>;
export declare function updateProfile(params: any): Promise<import("../responses.js").ResultOrError>;
