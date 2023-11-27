export { runVotesCountingProcess };
declare function runVotesCountingProcess(claim: any): Promise<{
    claim: any;
    nullifierUpdate: import("../dbs/offchain-merkle-map.js").OffchainMerkleMap;
} | undefined>;
