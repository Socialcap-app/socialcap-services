import { PublicKey, Field } from "o1js";
import { UID, CANCELED, ASSIGNED, DONE, IGNORED } from "@socialcap/contracts-lib";
import { BatchVoteNullifier, BatchVoteNullifierLeaf } from "@socialcap/batch-voting";
import { fastify, prisma, logger } from "../global.js";
import Sql from "../dbs/sql-helpers.js";
import { hasError, hasResult, raiseError } from "../responses.js";
import { waitForTransaction } from "../services/mina-transactions.js";
import { updateEntity, getEntity } from "../dbs/any-entity-helpers.js";
import { saveJSON } from "../dbs/nullifier-helpers.js";
import { CommunityMembers } from "../dbs/members-helpers.js";
import { createVotesBatch, unpackSignedData } from "../dbs/batch-helpers.js";
import { assignAllElectors } from "../services/voting-assign-electors.js";
import { postReceiveVotesBatch } from "../dbs/sequencer-helpers.js";
import { Sequencer } from "../sequencer/core/index.js";

export async function getTask(params: any) {
  const uid = params.uid;
  let data = await getEntity("task", uid);

  let claim = await getEntity("claim", data.claimUid);
  let plan = await getEntity("plan", claim.planUid);
  let comn = await getEntity("community", claim.communityUid);
  claim.evidenceData = JSON.parse(claim.evidenceData);
  plan.strategy = JSON.parse(plan.strategy);
  claim.requiredVotes = plan.strategy.minVotes;
  claim.requiredPositives = plan.strategy.minPositives;
  data.claim = claim;
  data.plan = plan;
  data.community = comn;
  return hasResult(data);
}

export async function getMyTasks(params: any) {
  const userUid = params.user.uid;
  const states = params.states ?? undefined;
  let query = Sql`
    SELECT * 
    FROM tasks_view
    WHERE assignee_uid = ${userUid} 
  `;

  if (states !== null && states !== undefined && states.length > 0) {
    const statesArr = states.map((s: number) => s);
    query = Sql` ${query} AND state = ANY(${statesArr})`;
  }

  query = Sql` ${query} ORDER BY state ASC`;
  let tasks = await query;
  let patched = (tasks || []);
  return hasResult(patched);

  /* 
    // all commnunity Uids where is a a member
    const tasks = await prisma.task.findMany({
      where: { assigneeUid: userUid },
      orderBy: { assignedUTC: 'asc' }
    })
    if (! tasks) 
      return hasResult([]);
  
    const cluids  = tasks.map((t) => t.claimUid);
    const claims = await prisma.claim.findMany({
      where: { uid: { in: cluids } }
    })
    const mapClaims: any = {};
    (claims || []).map((t) => { mapClaims[t.uid] = t;})
  
    const pluids  = claims.map((t) => t.planUid);
    const plans = await prisma.plan.findMany({
      where: { uid: { in: pluids } }
    })
    const mapPlans: any = {};
    (plans || []).map((t) => { mapPlans[t.uid] = t;})
  
    const comnuids  = claims.map((t) => t.communityUid);
    const comns = await prisma.community.findMany({
      where: { uid: { in: comnuids } }
    })
    const mapComns: any = {};
    (comns || []).map((t) => { mapComns[t.uid] = t;})
    
    // just for the first community for NOW $TODO$
    const members = await (new CommunityMembers()).build(comnuids[0]);
  
    // we patch some additional data into each Task
    let patched = (tasks || []).map((t: any) => {
      t.claim = mapClaims[t.claimUid];
      t.plan = mapPlans[t.claim.planUid];
      t.community = mapComns[t.claim.communityUid];
      t.applicant = members.findByUid(t.claim.applicantUid);
      return t; 
    })
   */
}


/**
 * Submits one particular Task
 */
export async function submitTask(params: {
  uid: string,
  senderAccountId: string,
  claimUid: string,
  extras: {
    addToQueue: boolean // TRUE if Batch, FALSE otherwise
  }
  user: any,
}) {
  const uid = params.uid;
  let { addToQueue } = params.extras; // TRUE if Batch, FALSE otherwise

  // change the state of the Task
  let task = await prisma.task.update({
    where: { uid: uid },
    data: { state: DONE },
  })

  /**
   * We will do this latter because we will be doing Batch processing of the Votes 
  */
  if (!addToQueue) {
    // we need to also update the Nullifier !
    // let key: Field = NullifierProxy.key(
    //   PublicKey.fromBase58(params.senderAccountId),
    //   UID.toField(params.claimUid)
    // )
    // let state: Field = Field(DONE);
  }

  return hasResult({
    task: task,
    transaction: { id: "" } // { id: params.txn?.hash || "" }
  })
}


/**
 * Submits a batch of votes for many claims and tasks
 * @param senderAccountId
 * @param signedData
 * @param extras - { addToQueue: boolean } addToQueue=true
 * @param user
 */
export async function submitTasksBatch(params: {
  senderAccountId: string,
  signedPack: any,
  extras?: { addToQueue: boolean }
  user: any,
}) {
  let { senderAccountId, signedPack } = params;
  let { addToQueue } = params.extras || { addToQueue: true };

  console.log("signedPack publicKey=", signedPack.publicKey);
  console.log("signedPack signature=", signedPack.signature);
  console.log("signedPack data=", signedPack.data);
  let unpacked = unpackSignedData(signedPack);
  let votes = unpacked.data.votes || [];
  let root = unpacked.data.root;

  let tasks = [];
  let leafs: { value: Field }[] = [];
  for (let j = 0; j < votes.length; j++) {
    let vote = votes[j];

    // change the state of the Task
    let task = await prisma.task.update({
      where: { uid: votes[j].uid },
      data: {
        state: DONE,
        result: votes[j].result // $TODO$ this MUST be hidden 
      },
    })

    // change the state of the claim ??? NOT Yet
    tasks.push(task);

    // create a Nullifier leaf for each vote so we can build the nullifier
    leafs.push({
      value: BatchVoteNullifierLeaf.value(
        PublicKey.fromBase58(senderAccountId),
        UID.toField(vote.claimUid),
        Field(vote.result)
      )
    })
  }

  // create the BatchVote Nullifier
  let nullifier = new BatchVoteNullifier().addLeafs(leafs);
  console.log("nullifier root=", nullifier.root().toString());
  console.log("root=", root);
  // Todo: disabled root check until we have a proper merkle tree implementation on both ui and api - o1js version issues on related packages
  // assert root is same as signed and submitted
  // if (root != nullifier.root().toString())
  //   return hasError.PreconditionFailed(`Submitted batch root does not match the signed data merkle root`)

  // create and save the Batch for processing
  let batch = await createVotesBatch({
    senderAccountId: senderAccountId,
    signedData: signedPack
  });
  logger.info(`VotesBatch created uid=${batch.uid} sequence=${batch.sequence} size=${batch.size} state=${batch.state}`);

  // save Nullifier
  await saveJSON<BatchVoteNullifier>(`batch-vote-nullifier-${batch.uid}`, nullifier);
  logger.info(`BatchVoteNullifier created uid=${batch.uid} root=${nullifier.root()}`);

  // finally send the Batch to MINA
  /* TODO: activate latter
  let txn = await postReceiveVotesBatch(
    batch.uid, 
    senderAccountId, 
    signedPack
  );
  */

  return hasResult({
    tasks: tasks,
    transaction: "" //
  })
}


/**
 * Helpers
 */
export async function getNullifier(params: any) {
  let leafs = {};//await getNullifierLeafs();
  return hasResult(leafs);
}
