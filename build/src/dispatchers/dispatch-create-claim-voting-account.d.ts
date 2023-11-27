import { RawTxnData, AnyDispatcher, TxnResult } from "../sequencer/index.js";
export { CreateClaimVotingAccountDispatcher };
declare class CreateClaimVotingAccountDispatcher extends AnyDispatcher {
    /**
     * Creates a new zkApp using the ClaimVotingContract. Each claim has
     * its own zkApp account created just for doing the voting on it.
     *
     * @param txnData:
     *  account: { id, publickKey, privateKey } keys of the account to create
     *  claimUid: the Uid of the Claim binded to this account
     *  strategy: {requiredVotes,requiredPositives...} params for voting
     * @returns result of successfull transaction
     * @throws exception on failure, will be handled by Sequencer.dispatcher
     */
    dispatch(txnData: RawTxnData): Promise<TxnResult>;
    onFinished(txnData: RawTxnData, result: TxnResult): Promise<TxnResult>;
}
