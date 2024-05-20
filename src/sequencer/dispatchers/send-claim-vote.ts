import { PrivateKey, PublicKey, Field, fetchAccount, MerkleMapWitness, MerkleWitness } from "o1js";
import { DONE, UID, ASSIGNED, sliced, VOTING } from "@socialcap/contracts-lib";
import { ClaimElectorNullifier, ClaimElectorNullifierLeaf, ClaimVotingContract } from "@socialcap/claim-voting";
import { BatchVoteNullifierWitness, BatchVoteNullifier, BatchVoteNullifierLeaf } from '@socialcap/batch-voting';
import { DEPLOY_TX_FEE } from "./standard-fees.js";
import { getClaim, updateClaimResults } from "../../dbs/claim-helpers.js";
import { getJSON, saveJSON } from "../../dbs/nullifier-helpers.js";
import { RawTxnData, SequencerLogger as log, AnyDispatcher, TxnResult, Sender } from "../core/index.js"
import { AnyPayer, findPayer } from "./payers.js";
import { WORKER_ERROR, UNRESOLVED_ERROR, NOT_FOUND, hasException, IError, IResult } from "../core/error-codes.js";

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
  let recalculatedRoot = (batchWitness as any).calculateRoot(leafValue);
  console.log(`assertBatch=${batchRoot.toString() === recalculatedRoot.toString()} batchRoot=${sliced(batchRoot.toString())} recalculatedRoot=${sliced(recalculatedRoot.toString())}`);
  recalculatedRoot.assertEquals(batchRoot);  
}


/**
 * Gievn the Claim UID, get the associated zkApp accountId and 
 * get the alerady deployed zkApp instance (zkClaim) for it.
 * @param uid - the claim uid 
 * @returns [zkClaim, error]
 */
async function getZkClaim(uid: string): Promise<[
  ClaimVotingContract | null, IError | null
]> {
    // get the claim and check we already have a zkApp binded to it
    const claim = await getClaim(uid);
    if (! claim?.accountId) return [null, hasException({
        code: UNRESOLVED_ERROR,
        message: `Claim ${uid} has no associated zkApp account`
      })
    ]

    // we ALWAYS compile it
    await ClaimVotingContract.compile();

    // now get the zkApp itself
    let hasAccount = await fetchAccount({ publicKey: claim!.accountId });
    if (! hasAccount) return [null, hasException({
        code: UNRESOLVED_ERROR,
        message: `Could not fetch the zkClaim account=${claim!.accountId}`
      })
    ]

    let zkClaim = new ClaimVotingContract(
      PublicKey.fromBase58(claim!.accountId)
    );

    // assert the Claim UID
    let zkAppClaimUid = zkClaim.claimUid.get();
    // console.log(`assert zkClaim=${sliced(claim!.accountId)} uid=${sliced(UID.toField(uid).toString())} zkClaim.claimUid=${sliced(zkAppClaimUid.toString())}`)
    if (zkAppClaimUid.toString() !== UID.toField(uid).toString()) return [null, hasException({
      code: UNRESOLVED_ERROR,
      message: `Assert failed: zkClaim.claimUid=${zkAppClaimUid.toString} NOT EQUALS claim.uid=${uid}`
    })
  ]

  return [zkClaim, null];
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
    let [deployer, errorNoPayer] = await findPayer(sender.accountId);
    if (!deployer) 
      return errorNoPayer;

    // get the claim and check we already have a zkApp binded to it
    let [zkClaim, errorBadClaim] = await getZkClaim(claimUid);
    if (!zkClaim)
      return errorBadClaim;

    const electorPuk = PublicKey.fromBase58(electorAccountId);

    // vote in batch Nullifier
    let batchNullifier = await getJSON<BatchVoteNullifier>(
      `batch-vote-nullifier-${batchUid}`, 
      new BatchVoteNullifier()
    ) as BatchVoteNullifier;
    const batchRoot = batchNullifier.root();
    const batchWitness = batchNullifier.witness(BigInt(index));

    // claim and elector Nullifier AHORA !  
    let claimNullifier = await getJSON<ClaimElectorNullifier>(
      `claim-elector-nullifier-${planUid}`, 
      new ClaimElectorNullifier()
    ) as ClaimElectorNullifier;
    const claimRoot = claimNullifier.root();
    const claimKey = ClaimElectorNullifierLeaf.key(electorPuk, UID.toField(claimUid));
    const claimWitness = claimNullifier.witness(claimKey);

    let result = await this.proveAndSend(
      // the transaction 
      () => {
        zkClaim!.dispatchVote(
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
  ): Promise<IResult> {
    const { claimUid, planUid, electorAccountId } = txnData.data;

    /* first update vote Nullifier */
    const nullifierUid = `claim-elector-nullifier-${planUid}`;
    let nullifier = new ClaimElectorNullifier();
    nullifier = await getJSON<ClaimElectorNullifier>(nullifierUid, nullifier);
    nullifier.set(ClaimElectorNullifierLeaf.key(
        PublicKey.fromBase58(electorAccountId), 
        UID.toField(claimUid)
      ), 
      Field(DONE)
    );
    await saveJSON<ClaimElectorNullifier>(nullifierUid, nullifier);

    // get and asert the current claim
    let [zkClaim, errorBadClaim] = await getZkClaim(claimUid);
    if (! zkClaim) return {
      success: false,
      error: errorBadClaim as IError
    }
    
    // now check state and see if claim voting has finished
    let status = Number(zkClaim.result.get().toString());
    if (status === VOTING)
      return { success: true };

    // we have finished, update Claim state and voting results
    await updateClaimResults(claimUid, { 
      state: status,
      positive: Number(zkClaim.positive.get().toString()),
      negative: Number(zkClaim.negative.get().toString()),
      ignored: Number(zkClaim.ignored.get().toString())
    });
    return { success: true };
  }

  async onFailure(
    txnData: RawTxnData, 
    result: TxnResult
  ): Promise<IResult> {
    return { success: true };
  }
}
