import { Mina, AccountUpdate, PrivateKey, PublicKey, Field } from "o1js";
import { ClaimElectorNullifier, ClaimElectorNullifierLeaf, ClaimVotingContract } from "@socialcap/claim-voting";
import { DONE, UID } from "@socialcap/contracts-lib";
import { DEPLOY_TX_FEE } from "./standard-fees.js";
import { RawTxnData, SequencerLogger as log, AnyDispatcher, TxnResult, Sender } from "../core/index.js"
import { OffchainMerkleStorage } from "../../dbs/offchain-merkle-storage.js";
import { getClaim } from "../../dbs/claim-helpers.js";
import { BatchVoteNullifier } from "@socialcap/batch-voting";
import { getJSON } from "../../dbs/nullifier-helpers.js";

export { SendClaimVoteDispatcher };


class SendClaimVoteDispatcher extends AnyDispatcher {

  static uname = 'SEND_CLAIM_VOTE';

  name(): string { 
    return SendClaimVoteDispatcher.uname; 
  };

  maxRetries(): number {
    return 3;
  }

  /**
   * Dispatches a vote to the zkApp Claim. The transaction creates an action 
   * and dispatches it.  
   *
   * @param txnData: 
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
    let batchNullifier = await getJSON<BatchVoteNullifier>(`batch-${batchUid}`, 
      new BatchVoteNullifier()
    ) as BatchVoteNullifier;
    const batchRoot = batchNullifier.root();
    const batchWitness = batchNullifier.witness(index);

    let claimNullifier = await getJSON<ClaimElectorNullifier>(`claim-${claimUid}`, 
      new ClaimElectorNullifier()
    ) as ClaimElectorNullifier;
    const claimRoot = claimNullifier.root();
    const claimWitness = claimNullifier.witness(ClaimElectorNullifierLeaf.key(
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

    let result = await this.proveAndSend(
      // the transaction 
      () => {
        zkClaim.dispatchVote(
          electorPuk,
          Field(vote), // +1 positive, -1 negative or 0 ignored
          batchRoot,
          batchWitness,
          claimRoot,
          claimWitness
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
    /*
    MUST update Nullifiers here ...
    */
    return result;
  }

  async onFailure(
    txnData: RawTxnData, 
    result: TxnResult
  ): Promise<TxnResult> {
    return result;
  }
}
