export declare function getTask(params: any): Promise<import("../responses.js").ResultOrError>;
export declare function getMyTasks(params: any): Promise<import("../responses.js").ResultOrError>;
/**
 * Submits one particular Task
 */
export declare function submitTask(params: {
    uid: string;
    senderAccountId: string;
    claimUid: string;
    extras: {
        addToQueue: boolean;
    };
    user: any;
}): Promise<import("../responses.js").ResultOrError>;
/**
 * Submits a batch of votes for many claims and tasks
 */
export declare function submitTasksBatch(params: {
    senderAccountId: string;
    signedData: any;
    extras?: {
        addToQueue: boolean;
    };
    user: any;
}): Promise<import("../responses.js").ResultOrError>;
/**
 * Helpers
 */
export declare function getNullifier(params: any): Promise<import("../responses.js").ResultOrError>;
