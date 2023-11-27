interface SignedData {
    publicKey: string;
    data: string;
    signature: {
        field: string;
        scalar: string;
    };
}
export declare function createVotesBatch(params: {
    senderAccountId: string;
    signedData: SignedData;
}): Promise<any>;
/**
 * Returns the list of batches belonging to a given plan and filtered by state
 * @param planUid
 * @param state
 * @returns array of batches
 */
export declare function getBatchesByPlan(planUid: string, state: number): Promise<any[]>;
export {};
