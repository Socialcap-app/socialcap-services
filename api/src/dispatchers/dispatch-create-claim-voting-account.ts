import { Mina, AccountUpdate, PrivateKey, PublicKey, Field } from "o1js";
import { ClaimVotingContract, UID } from "@socialcap/contracts";
import { Payers } from "./payers.js"
import { DEPLOY_TX_FEE } from "./standard-fees.js";
import { RawTxnData,
  SequencerLogger as log, 
  postTxnEvent, 
  UNABLE_TO_UPDATE_INDEXDB,
  hasException,
  AnyDispatcher,
  UNABLE_TO_POST_TRANSACTION_EVENT,
  TxnEvent
} from "../sequencer/index.js"

export { CreateClaimVotingAccountDispatcher };


class CreateClaimVotingAccountDispatcher extends AnyDispatcher {

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
    // the 'account {id, privateKey}' SHOULD have been generated before 
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

    const result = await this.proveAndSend(
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
      // feePayer and fee
      deployer.publicKey, DEPLOY_TX_FEE,
      // sign keys
      [deployer.privateKey, zkappPrivkey]
    );

    // if we were successfull, we need to update the Claim in the IndexDb
    // so we post a Transaction event to report this
    if (!result.error) {
      let ev: TxnEvent = {
        type: 'claim_zkapp_account_created',
        to: `claim:${claimUid}`,
        payload: {
          claimUid: claimUid,
          accountId: zkappPubkey.toBase58(),
          privateKey: zkappPrivkey.toBase58()
        }        
      }
      let updated = await postTxnEvent(ev);
      if (! updated) {
        result.error = hasException(UNABLE_TO_POST_TRANSACTION_EVENT, ev);
        return result;
      }
    }

    return result;
  }
}
