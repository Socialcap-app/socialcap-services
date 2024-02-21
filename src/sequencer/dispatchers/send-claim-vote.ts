import { PrivateKey, PublicKey, Field, fetchAccount, MerkleMapWitness } from "o1js";
import { DONE, UID, ASSIGNED, sliced } from "@socialcap/contracts-lib";
import { ClaimElectorNullifier, ClaimElectorNullifierLeaf, ClaimVotingContract } from "@socialcap/claim-voting";
import { BatchVoteNullifierWitness, BatchVoteNullifier, BatchVoteNullifierLeaf } from '@socialcap/batch-voting';
import { DEPLOY_TX_FEE } from "./standard-fees.js";
import { getClaim } from "../../dbs/claim-helpers.js";
import { getJSON } from "../../dbs/nullifier-helpers.js";
import { RawTxnData, SequencerLogger as log, AnyDispatcher, TxnResult, Sender } from "../core/index.js"
import { AnyPayer, findPayer } from "./payers.js";
import { UNRESOLVED_ERROR, NOT_FOUND, hasException } from "../core/error-codes.js";

export { SendClaimVoteDispatcher };


function assertHasNotVoted(
  electorPuk: PublicKey,
  claimUid: Field,
  nullifierRoot: Field,
  nullifierWitness: MerkleMapWitness
) {
  // compute a root and key from the given Witness using the only valid 
  // value ASSIGNED, other values indicate that the elector was 
  // never assigned to this claim or that he has already voted on it
  const [witnessRoot, witnessKey] = nullifierWitness.computeRootAndKey(
    Field(ASSIGNED) /* WAS ASSIGNED BUT NOT VOTED YET */
  );
  console.log("witnessRoot", witnessRoot.toString());
  console.log("witnessKey", witnessKey.toString());

  const key: Field = ClaimElectorNullifierLeaf.key(electorPuk, claimUid);
  console.log("claimUid", claimUid.toString());
  console.log("electorPuk", electorPuk.toBase58());
  console.log("nullifierKey", key.toString());
  console.log("nullifierRoot", nullifierRoot.toString());

  // check the witness obtained root matchs the Nullifier root
  nullifierRoot.assertEquals(witnessRoot, "Invalid elector root or already voted") ;

  // check the witness obtained key matchs the elector+claim key 
  witnessKey.assertEquals(key, "Invalid elector key or already voted");
}

function assertIsInBatch(
  electorPuk: PublicKey,
  claimUid: Field,
  vote: Field,
  batchRoot: Field,
  batchWitness: BatchVoteNullifierWitness
) {
  let leafValue = BatchVoteNullifierLeaf.value(electorPuk, claimUid, vote);
  let recalculatedRoot = batchWitness.calculateRoot(leafValue);
  console.log(`assertBatch=${batchRoot.toString() === recalculatedRoot.toString()} batchRoot=${sliced(batchRoot.toString())} recalculatedRoot=${sliced(recalculatedRoot.toString())}`);
  recalculatedRoot.assertEquals(batchRoot);  
}


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

    // this data was send by postTransaction
    log.info(`Start dispatching task ${JSON.stringify(txnData)}`);

    // find the Deployer secret keys using the sender addresss
    // find the Deployer using the sender addresss
    const [deployer, error] = await findPayer(sender.accountId);
    if (!deployer) 
      return error;

    // get the claim and check we akready have a zkApp binded to it
    const claim = await getClaim(claimUid);
    if (! claim!.accountId) return {
      error: hasException({
        code: UNRESOLVED_ERROR,
        message: `Claim ${claimUid} has no associated zkApp account`
      })
    }

    const electorPuk = PublicKey.fromBase58(electorAccountId);

    // vote in batch Nullifier
    let batchNullifier = await getJSON<BatchVoteNullifier>(
      `batch-vote-nullifier-${batchUid}`, 
      new BatchVoteNullifier()
    ) as BatchVoteNullifier;
    const batchRoot = batchNullifier.root();
    const batchWitness = batchNullifier.witness(BigInt(index));

    console.log(`batch vote index=${index} vote=${vote}`);  
    assertIsInBatch(
      electorPuk, UID.toField(claimUid), Field(vote),
      batchRoot, batchWitness
    );

    // claim and elector Nullifier AHORA !  
    let claimNullifier = await getJSON<ClaimElectorNullifier>(
      `claim-elector-nullifier-${planUid}`, 
      new ClaimElectorNullifier()
    ) as ClaimElectorNullifier;
    const claimRoot = claimNullifier.root();
    const claimKey = ClaimElectorNullifierLeaf.key(electorPuk, UID.toField(claimUid));
    const claimWitness = claimNullifier.witness(claimKey);

    assertHasNotVoted(
      electorPuk, UID.toField(claimUid),
      claimRoot, claimWitness
    );  


    // we ALWAYS compile it
    await ClaimVotingContract.compile();

    // now get the zkApp itself
    let hasAccount = await fetchAccount({ publicKey: claim!.accountId });
    if (! hasAccount) return {
      error: hasException({
        code: UNRESOLVED_ERROR,
        message: `Could not fetch the zkApp account=${claim!.accountId}`
      })
    }
    let zkClaim = new ClaimVotingContract(
      PublicKey.fromBase58(claim!.accountId)
    );
    let zkAppClaimUid = zkClaim.claimUid.get();
    console.log(`assertAppClaimUid ${sliced(claim!.accountId)} ${sliced(UID.toField(claimUid).toString())} ${sliced(zkAppClaimUid.toString())}`)

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

    result.data = txnData.data;
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
