/**
 * requestOTP
 * @param params Object: { email }
 * @returns MutationResult
 */
export declare function requestOtp(params: object): Promise<import("../responses.js").ResultOrError>;
/**
 * login
 * @param params Object: { session_key, otp }
 * @returns MutationResult
 */
export declare function login(params: {
    session_key: string;
    otp: string;
}): Promise<import("../responses.js").ResultOrError>;
