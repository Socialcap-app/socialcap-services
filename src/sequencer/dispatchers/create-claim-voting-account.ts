import { Mina, AccountUpdate, PrivateKey, PublicKey, Field, fetchAccount } from "o1js";
import { ClaimVotingContract } from "@socialcap/claim-voting";
import { UID } from "@socialcap/contracts-lib";
import { DEPLOY_TX_FEE } from "./standard-fees.js";
import { AnyPayer, findPayer } from "./payers.js";
import { updateClaimAccountId } from "../../dbs/claim-helpers.js";
import { ACCOUNT_NOT_FOUND, WORKER_ERROR, NO_FEE_PAYER_AVAILABLE, IError, hasException, IResult } from "../core/error-codes.js";
import { RawTxnData, SequencerLogger as log, AnyDispatcher, TxnResult, Sender } from "../core/index.js"

export { CreateClaimVotingAccountDispatcher };


class CreateClaimVotingAccountDispatcher extends AnyDispatcher {

  static uname = 'CREATE_CLAIM_VOTING_ACCOUNT';

  name(): string { 
    return CreateClaimVotingAccountDispatcher.uname 
  };
 
  /**
   * Creates a new zkApp using the ClaimVotingContract. Each claim has 
   * its own zkApp account created just for doing the voting on it.
   *
   * @param txnData: 
   *  claimUid: the Uid of the Claim binded to this account
   *  strategy: {requiredVotes,requiredPositives...} params for voting
   * @param sender: the sender binded to this worker
   * @returns result of successfull transaction or error result
   */
  async dispatch(txnData: RawTxnData, sender: Sender) {
    // this data was send by postTransaction
    log.info(`Start dispatching task ${JSON.stringify(txnData)}`);
    const { claimUid, strategy } = txnData.data;

    // find the Deployer using the sender addresss
    const [deployer, error] = await findPayer(sender.accountId);
    if (!deployer) 
      return error;

    // we ALWAYS compile it
    await ClaimVotingContract.compile();
    log.info(`Done compiling ClaimVotingContract`);

    // we need to generate a new key pair for each deploy
    const zkappPrivkey = PrivateKey.random();
    const zkappPubkey = zkappPrivkey.toPublicKey();

    let zkApp = new ClaimVotingContract(zkappPubkey);
    log.info(`Created ClaimVotingContract zkApp=${zkappPubkey.toBase58()}`);
      
    let fuid = UID.toField(claimUid);
    let frv = Field(strategy.requiredVotes);
    let frp = Field(strategy.requiredPositives); 

    let result = await this.proveAndSend(
      // the transaction 
      () => {
        // IMPORTANT: the deployer account must already be funded 
        // or this will fail miserably ughhh
        AccountUpdate.fundNewAccount(deployer.publicKey);
        zkApp.deploy();
        zkApp.claimUid.set(fuid);
        zkApp.requiredVotes.set(frv);
        zkApp.requiredPositives.set(frp);
      }, 
      deployer.publicKey, DEPLOY_TX_FEE,   // feePayer and fee
      [deployer.privateKey, zkappPrivkey]  // sign keys
    );
    log.info(`Done proveAndSend result=${JSON.stringify(result)}`);

    if (result.error) return result;

    result.data = {
      claimUid: claimUid,
      strategy: strategy,
      claimAddress: zkappPubkey.toBase58(), 
    }
    return result;
  }

  async onSuccess(
    txnData: RawTxnData, 
    result: TxnResult
  ): Promise<IResult> {
    // if we are really finished , we need to update the associated accountId
    console.log("onSucess txnData=", txnData, " result=", result)
    const { claimUid, claimAddress } = txnData.data;
    await updateClaimAccountId(claimUid, { accountId: claimAddress });
    return { success: true };
  }
  
  async onFailure(
    txnData: RawTxnData, 
    result: TxnResult
  ): Promise<IResult> {
    // if failed, we set the accountId to empty string to mark it as unusable
    const { claimUid, claimAddress } = txnData.data;
    await updateClaimAccountId(claimUid, { accountId: "" });
    return { success: true };
  }
}
