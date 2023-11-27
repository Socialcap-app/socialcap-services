import { PrivateKey, PublicKey, Field } from "o1js";
export { ClaimsVotingFactory, VotingInstance };
declare const ClaimsVotingFactory: {
    compile: typeof compileVotingContract;
    deploy: typeof deployVotingContract;
    getInstance: typeof getVotingInstance;
};
type VotingInstance = {
    instance: any;
    address: PublicKey;
    secret?: PrivateKey;
    txn?: string;
};
declare function compileVotingContract(proofsEnabled?: boolean): Promise<void>;
declare function deployVotingContract(claimUid: Field, requiredVotes: Field, requiredPositives: Field, deployerAccount: PublicKey, deployerKey: PrivateKey, isLocal?: boolean): Promise<VotingInstance>;
declare function getVotingInstance(publicKey: PublicKey): Promise<VotingInstance>;
