import { Mina, AccountUpdate, PrivateKey, PublicKey, Field } from "o1js";
import { ClaimElectorNullifier, ClaimElectorNullifierLeaf, ClaimVotingContract } from "@socialcap/claim-voting";
import { DONE, UID } from "@socialcap/contracts-lib";
import { DEPLOY_TX_FEE } from "./standard-fees.js";
import { RawTxnData, SequencerLogger as log, AnyDispatcher, TxnResult, Sender } from "../core/index.js"
import { OffchainMerkleStorage } from "../../dbs/offchain-merkle-storage.js";
import { getClaim } from "../../dbs/claim-helpers.js";
import { BatchVoteNullifier } from "@socialcap/batch-voting";

export { SendClaimVoteDispatcher };


class SendClaimVoteDispatcher extends AnyDispatcher {

  static uname = 'SEND_CLAIM_VOTES';

  name(): string { 
    return SendClaimVoteDispatcher.uname; 
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
  async dispatch(txnData: RawTxnData, sender: Sender) {
    // this data was send by postTransaction
    const { 
      planUid,
      batchUid,
      claimUid, 
      electorAccountId,
      index,
      vote, // +1, -1, 0 (encrypted with sender Puk ?)
    } = txnData.data;

    console.log("Sender ", sender.accountId);
    const deployer = {
      address: sender.accountId,
      publicKey: PublicKey.fromBase58(sender.accountId),
      privateKey: PrivateKey.fromBase58(sender.secretKey)
    };

    const claimUidf = UID.toField(claimUid);
    const electorPuk = PublicKey.fromBase58(electorAccountId);

    // use the batchUid to get the BatchNullifier
    const batchNullifier = new BatchVoteNullifier();
    const batchRoot = batchNullifier.root();
    const batchWitness = batchNullifier.witness(index);

    // use the planUid to get the PlanNullifier
    const planNullifier = new ClaimElectorNullifier();
    const planRoot = planNullifier.root();
    const planWitness = planNullifier.witness(ClaimElectorNullifierLeaf.key(
      electorPuk, claimUidf
    ));

    // we ALWAYS compile it
    await ClaimVotingContract.compile();

    // get the claim and check we akready have a zkApp binded to it
    const claim = await getClaim(claimUid);
    if (!claim!.accountId) {
      return {
        error: {}
      }
    }

    // now get the zkApp itself
    let zkClaim = new ClaimVotingContract(
      PublicKey.fromBase58(claim!.accountId)
    );

/*     // we need to generate a new key pair for each deploy
    const zkappPrivkey = PrivateKey.random();
    const zkappPubkey = zkappPrivkey.toPublicKey();

    let zkApp = new ClaimVotingContract(zkappPubkey);
    log.zkAppInstance(zkappPubkey.toBase58());
      
    let fuid = UID.toField(claimUid);
    let frv = Field(strategy.requiredVotes);
    let frp = Field(strategy.requiredPositives); 
    */
    let result = await this.proveAndSend(
      // the transaction 
      () => {
        zkClaim.dispatchVote(
          electorPuk,
          Field(vote), // +1 positive, -1 negative or 0 ignored
          batchRoot,
          batchWitness,
          planRoot,
          planWitness
        ); 
      }, 
      deployer.publicKey, DEPLOY_TX_FEE,   // feePayer and fee
      [deployer.privateKey]  // sign keys
    );

    result.data = {
      claimUid: claimUid,
      nullifierKey: Field(0),
      voted: DONE
    }
    return result;
  }

  async onSuccess(
    txnData: RawTxnData, 
    result: TxnResult
  ): Promise<TxnResult> {
    const { claimUid } = txnData.data;
    // const { nullifierKey, voted } = result.data;
    /*
    MUST update PlanNullifier.set(nullifierKey, DONE)
    */
    return result;
  }

  async onFailure(
    txnData: RawTxnData, 
    result: TxnResult
  ): Promise<TxnResult> {
    const { claimUid, accountId } = txnData.data;
    return result;
  }
}
