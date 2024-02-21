import 'dotenv/config';
import { Mina, Field, PublicKey, MerkleMapWitness, fetchAccount } from "o1js";
import { merkleStorage } from "../global.js";
import { UID, ASSIGNED, WAITING, DONE, VOTING, sliced } from "@socialcap/contracts-lib";
import { BatchVoteNullifierWitness, BatchVoteNullifier, BatchVoteNullifierLeaf } from '@socialcap/batch-voting';
import { ClaimElectorNullifier, ClaimElectorNullifierLeaf, ClaimVotingContract } from "@socialcap/claim-voting";
import { getJSON } from "../dbs/nullifier-helpers.js";
import { getClaimsByPlan } from "../dbs/claim-helpers.js";
import { getBatchesByPlan, SignedVote, unpackSignedData } from "../dbs/batch-helpers.js";
import { delay } from "./test-helpers.js";

// the test plan in testdb0
// MINA Navigators
const TEST_PLAN_UID = '8a940b4b26404391ac416429a27df64c';

await ClaimVotingContract.compile();

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

  const key: Field = ClaimElectorNullifierLeaf.key(electorPuk, claimUid);
  console.log(`assertRoot=${nullifierRoot.toString() === witnessRoot.toString()} root=${sliced(nullifierRoot.toString())} witnessRoot=${sliced(witnessRoot.toString())}`);
  console.log(`assertKey=${key.toString() === witnessKey.toString()} key=${sliced(key.toString())} witnesskey=${sliced(witnessKey.toString())}`);

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


async function run(planUid: string) {
  let batchesCount = 0, votesCount = 0, claimsCount = 0;
  let claimsMap = new Map<string, any>();
  let countedClaims = new Map<string, boolean>();

  // get all batches belonging to this plan  
  let batches = await getBatchesByPlan(planUid, { states: [WAITING, DONE]});

  // the claims are needed too
  let claims = await getClaimsByPlan(planUid, { states: [VOTING]});
  for (let j=0; j < claims.length; j++) {
    claimsMap.set(claims[j].uid, claims[j])
  }

  let claimNullifier = await getJSON<ClaimElectorNullifier>(
    `claim-elector-nullifier-${planUid}`, 
    new ClaimElectorNullifier()
  ) as ClaimElectorNullifier;

  for (let k=0; k < (batches || []).length; k++) {
    let batch = batches[k];
    batchesCount++;

    // votes in the batch
    let unpacked = JSON.parse(batch.signedData);
    let votes: SignedVote[] = unpacked.votes;
    let electorPuk = PublicKey.fromBase58(batch.signerAccountId);

    // use the batchUid to get the BatchNullifier
    let batchNullifier = await getJSON<BatchVoteNullifier>(
      `batch-vote-nullifier-${batch.uid}`, 
      new BatchVoteNullifier()
    ) as BatchVoteNullifier;

    for (let j=0; j < votes.length; j++) {
      let vote = votes[j];
      votesCount++;
      console.log(`\nbatch=${k} vote=${j} claim=${sliced(vote.claimUid)} elector=${sliced(batch.signerAccountId)}`)

      // assert the claimUid in the zkApp
      let claimAccountId = claimsMap.get(vote.claimUid).accountId;
      let hasAccount = await fetchAccount({ publicKey: claimAccountId });
      let zkClaim = new ClaimVotingContract(
        PublicKey.fromBase58(claimAccountId)
      );
      let zkAppClaimUid = zkClaim.claimUid.get();
      console.log(`assertClaimUid ${sliced(claimAccountId)} ${sliced(UID.toField(vote.claimUid).toString())} ${sliced(zkAppClaimUid.toString())}`)
  
      // assert the ClaimElector Nullifier for each vote
      const claimRoot = claimNullifier.root();
      const claimKey = ClaimElectorNullifierLeaf.key(
        electorPuk, 
        UID.toField(vote.claimUid)
      );
      const claimWitness = claimNullifier.witness(claimKey);
      assertHasNotVoted(
        electorPuk, UID.toField(vote.claimUid),
        claimRoot, claimWitness
      );  

      // check it is part of the batch merkle tree
      const batchRoot = batchNullifier.root();
      const batchWitness = batchNullifier.witness(BigInt(j));
      assertIsInBatch(
        electorPuk, UID.toField(vote.claimUid), Field(vote.result),
        batchRoot, batchWitness
      );
    }

    await delay(1000);
  }
}

// start the Db
merkleStorage.startup();

let Network = Mina.Network({
  mina: process.env.MINA_PROXY as string, 
  archive: process.env.MINA_ARCHIVE as string
});
Mina.setActiveInstance(Network);

// we need the Db to be ready before we can do anything
// so we make it wait for 10000 secs before running
setTimeout(async () => {
  await run(TEST_PLAN_UID); 
}, 5000);
