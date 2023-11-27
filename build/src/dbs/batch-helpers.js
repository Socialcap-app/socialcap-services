import { prisma } from "../global.js";
import { WAITING, UID } from "@socialcap/contracts";
export async function createVotesBatch(params) {
    // retrieve and parse received signed data
    let data = params.signedData.data || "[]";
    let votes = JSON.parse(data);
    if (!votes.length)
        // we just ignore this batch, because it has no votes
        return null;
    // get the first vote for this params, since they are repaated 
    // for every vote in the batch
    let firstVote = votes[0];
    // insert a new batch ready to be processed by the Batches Sequencer
    let batch = await prisma.batch.create({ data: {
            uid: UID.uuid4(),
            // sequence @default(autoincrement()) // Db assigns sequence number
            type: "VOTES",
            metadata: JSON.stringify({
                communityUid: firstVote.communityUid,
                planUid: firstVote.planUid,
                assigneeUid: firstVote.assigneeUid,
            }),
            signerAccountId: params.senderAccountId,
            signedData: params.signedData.data,
            signatureField: params.signedData.signature.field,
            signatureScalar: params.signedData.signature.scalar,
            size: votes.length,
            commitment: "",
            state: WAITING, // we wait for the sequencer to process it
            // submitedUTC @default(now()) // Db assigns the now UTC 
        } });
    return batch;
}
/**
 * Returns the list of batches belonging to a given plan and filtered by state
 * @param planUid
 * @param state
 * @returns array of batches
 */
export async function getBatchesByPlan(planUid, state) {
    let batches = await prisma.batch.findMany({
        where: { state: state }
    });
    if (!batches || !batches.length)
        return [];
    // filter batches by planUid 
    let filtered = batches.filter((t) => {
        const metadata = JSON.parse(t.metadata);
        return (metadata.planUid === planUid);
    });
    return filtered;
}
//# sourceMappingURL=batch-helpers.js.map