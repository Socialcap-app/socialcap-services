import { prisma, logger } from "../global.js";
import { WAITING, DONE, IGNORED, REJECTED, UID } from "@socialcap/contracts-lib";

export interface SignedData {
  publicKey: string;
  data: string; 
  signature: {
    field: string;
    scalar: string;
  };
}

export interface UnpackedSignedData {
  publicKey: string;
  data: any;
  signature: {
    field: string;
    scalar: string;
  };
}

export interface SignedVote {
  uid: string, // the taskUid
  claimUid: string,
  claimAccountId: string,
  assigneeUid: string,
  communityUid: string,
  planUid: string
  result: string, // "+1: Positive" "-1: Negative" "0: Abstain" 
}

export interface VotesBatchMetadata {
  communityUid: string,// the community where the voting process is happening
  planUid: string, // the Master Plan Uid of the credential being voted
  assigneeUid: string, // the elector Uid who submitted this batch
}

export function unpackSignedData(signedData: SignedData): UnpackedSignedData { 
  // retrieve and parse received signed data
  return {
    publicKey: signedData.publicKey,
    signature: signedData.signature,
    data: JSON.parse(signedData.data),
  }
}


export async function createVotesBatch(params: {
  senderAccountId: string,
  signedData: SignedData,
}): Promise<any> {
  let { senderAccountId, signedData } = params;

  // retrieve and parse received signed data
  let unpacked = unpackSignedData(signedData);
  let votes = unpacked.data.votes || [];
  let root = unpacked.data.root;

  if (! votes.length) 
    // we just ignore this batch, because it has no votes
    return null;

  // get the first vote for this params, since they are repeated 
  // for every vote in the batch
  let firstVote = votes[0]; 

  // insert a new batch ready to be processed by the Batches Sequencer
  let batch = await prisma.batch.create({ data: {
    uid: UID.uuid4(),
    // sequence @default(autoincrement()) // Db assigns sequence number
    type: "VOTES", // mark as a VOTES batch
    metadata: JSON.stringify({
      communityUid: firstVote.communityUid,
      planUid: firstVote.planUid,
      assigneeUid: firstVote.assigneeUid,
    }),
    signerAccountId: senderAccountId, // this is the Signed data received    
    signedData: signedData.data, // JSON string
    signatureField: signedData.signature.field,
    signatureScalar: signedData.signature.scalar,
    size: votes.length,
    commitment: root, // the root of the BatchVote nullifier
    state: WAITING, // we wait for the sequencer to process it
    // submitedUTC @default(now()) // Db assigns the now UTC 
  }})

  return batch;
}

/**
 * Returns the list of batches belonging to a given plan and filtered by state
 * @param planUid 
 * @param { state: [] } 
 * @returns array of batches
 */
export async function getBatchesByPlan(planUid: string, params: { 
  states: number[]
}) {
  let batches = await prisma.batch.findMany({
    where: { state: { in: params.states }} 
  });
  if (! batches || !batches.length)
    return [];

  // filter batches by planUid 
  let filtered = batches.filter((t: any) => {
    const metadata = JSON.parse(t.metadata);
    return (metadata.planUid === planUid);
  });  

  return filtered;
}
