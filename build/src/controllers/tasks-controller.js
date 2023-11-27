import { PublicKey, Field } from "o1js";
import { NullifierProxy, UID } from "@socialcap/contracts";
import { DONE } from "@socialcap/contracts";
import { prisma, logger } from "../global.js";
import { hasResult } from "../responses.js";
import { getEntity } from "../dbs/any-entity-helpers.js";
import { getNullifierLeafs, updateNullifier } from "../dbs/nullifier-helpers.js";
import { CommunityMembers } from "../dbs/members-helper.js";
import { createVotesBatch } from "../dbs/batch-helpers.js";
export async function getTask(params) {
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
export async function getMyTasks(params) {
    const userUid = params.user.uid;
    // all commnunity Uids where is a a member
    const tasks = await prisma.task.findMany({
        where: { assigneeUid: userUid },
        orderBy: { assignedUTC: 'asc' }
    });
    if (!tasks)
        return hasResult([]);
    const cluids = tasks.map((t) => t.claimUid);
    const claims = await prisma.claim.findMany({
        where: { uid: { in: cluids } }
    });
    const mapClaims = {};
    (claims || []).map((t) => { mapClaims[t.uid] = t; });
    const pluids = claims.map((t) => t.planUid);
    const plans = await prisma.plan.findMany({
        where: { uid: { in: pluids } }
    });
    const mapPlans = {};
    (plans || []).map((t) => { mapPlans[t.uid] = t; });
    const comnuids = claims.map((t) => t.communityUid);
    const comns = await prisma.community.findMany({
        where: { uid: { in: comnuids } }
    });
    const mapComns = {};
    (comns || []).map((t) => { mapComns[t.uid] = t; });
    // just for the first community for NOW $TODO$
    const members = await (new CommunityMembers()).build(comnuids[0]);
    // we patch some additional data into each Task
    let patched = (tasks || []).map((t) => {
        t.claim = mapClaims[t.claimUid];
        t.plan = mapPlans[t.claim.planUid];
        t.community = mapComns[t.claim.communityUid];
        t.applicant = members.findByUid(t.claim.applicantUid);
        return t;
    });
    return hasResult(patched);
}
/**
 * Submits one particular Task
 */
export async function submitTask(params) {
    const uid = params.uid;
    let { addToQueue } = params.extras; // TRUE if Batch, FALSE otherwise
    // change the state of the Task
    let task = await prisma.task.update({
        where: { uid: uid },
        data: { state: DONE },
    });
    /**
     * We will do this latter because we will be doing Batch processing of the Votes
    */
    if (!addToQueue) {
        // we need to also update the Nullifier !
        let key = NullifierProxy.key(PublicKey.fromBase58(params.senderAccountId), UID.toField(params.claimUid));
        let state = Field(DONE);
        await updateNullifier(key, state);
    }
    return hasResult({
        task: task,
        transaction: { id: "" } // { id: params.txn?.hash || "" }
    });
}
/**
 * Submits a batch of votes for many claims and tasks
 */
export async function submitTasksBatch(params) {
    let { senderAccountId, signedData } = params;
    let { addToQueue } = params.extras || { addToQueue: true };
    console.log(signedData);
    let votes = JSON.parse(signedData.data || "[]");
    let tasks = [];
    for (let j = 0; j < votes.length; j++) {
        // change the state of the Task
        let task = await prisma.task.update({
            where: { uid: votes[j].uid },
            data: {
                state: DONE,
                result: votes[j].result
            },
        });
        // chain the state of the claim ??? NOT Yet
        tasks.push(task);
    }
    // create and save the Batch for processing
    let batch = await createVotesBatch({
        senderAccountId: params.senderAccountId,
        signedData: params.signedData
    });
    logger.info(`VotesBatch created uid=${batch.uid} sequence=${batch.sequence} size=${batch.size} state=${batch.state}`);
    return hasResult({
        tasks: tasks,
        transaction: { id: "" } // { id: params.txn?.hash || "" }
    });
}
/**
 * Helpers
 */
export async function getNullifier(params) {
    let leafs = await getNullifierLeafs();
    return hasResult(leafs);
}
//# sourceMappingURL=tasks-controller.js.map