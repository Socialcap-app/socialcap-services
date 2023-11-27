export { startClaimVotingProcess };
declare function startClaimVotingProcess(claim: any): Promise<{
    claim: any;
    nullifierUpdate: import("../dbs/offchain-merkle-map.js").OffchainMerkleMap;
} | undefined>;
