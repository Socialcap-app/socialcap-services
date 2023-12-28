import { Mina, AccountUpdate, PrivateKey, PublicKey, Field } from "o1js";
import { ClaimVotingContract, UID } from "@socialcap/contracts";
import { Payers } from "./payers.js"
import { DEPLOY_TX_FEE } from "./standard-fees.js";
import { RawTxnData, SequencerLogger as log, AnyDispatcher, TxnResult } from "../core/index.js"

export { CreateClaimVotingAccountDispatcher };


class Pepe {
  static xname = 'pepe';
}

class CreateClaimVotingAccountDispatcher extends AnyDispatcher {

  static uname = 'CREATE_CLAIM_VOTING_ACCOUNT';

  name(): string { 
    return CreateClaimVotingAccountDispatcher.uname 
  };

  maxRetries(): number {
    return 3;
  }

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
  async dispatch(txnData: RawTxnData) {
    // this data was send by postTransaction
    const { claimUid, strategy } = txnData.data;
    
    const deployer = Payers.DEPLOYER;

    // we ALWAYS compile it
    await ClaimVotingContract.compile();

    // we need to generate a new key pair for each deploy
    const zkappPrivkey = PrivateKey.random();
    const zkappPubkey = zkappPrivkey.toPublicKey();

    let zkApp = new ClaimVotingContract(zkappPubkey);
    log.zkAppInstance(zkappPubkey.toBase58());
      
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

    result.data = {
      claimUid: claimUid,
      strategy: strategy,
      accountId: zkappPubkey.toBase58(), 
      // privateKey: zkappPrivkey.toBase58()
    }

    return result;
  }


  async onSuccess(
    txnData: RawTxnData, 
    result: TxnResult
  ): Promise<TxnResult> {
    const { claimUid, accountId } = txnData.data;

    // if we are really finished , we need to update the associated Claim
    return await this.postEvent({
      type: 'claim_zkapp_account_created',
      subject: `claim.${claimUid}`,
      payload: {
        claimUid: claimUid,
        accountId: accountId,
        // privateKey: privateKey
      }        
    }, result);
  }

  async onFailure(
    txnData: RawTxnData, 
    result: TxnResult
  ): Promise<TxnResult> {
    const { claimUid, accountId } = txnData.data;
    return result;
  }
}
