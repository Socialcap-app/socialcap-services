import { RawTxnData, TxnResult, Sequencer } from "../sequencer/core/index.js";
import { SignedData } from "./batch-helpers.js";

export {
  RawTxnData,
  TxnResult,
  SubmittedTxn,
  postReceiveVotesBatch,
  postCommitAllBatches,
  postCreateClaimVotingAccount,
  postSendClaimVote
}

interface SubmittedTxn {
  type: string;
  uid: string;
}


async function postReceiveVotesBatch(
  batchUid: string,
  senderId: string,
  signedPack: SignedData
): Promise<RawTxnData> {
  let txn = await Sequencer.postTransaction(`batch-${batchUid}`, {
    type: 'RECEIVE_VOTES_BATCH',
    data: {
      batchUid: batchUid,
      senderAccountId: senderId,
      signedData: signedPack      
    }
  })
  return txn;
}

async function postCommitAllBatches(
  planUid: string
): Promise<RawTxnData> {
  let txn = await Sequencer.postTransaction(`plan-${planUid}`, {
    type: 'COMMIT_ALL_BATCHES', 
    data: {
      planUid: planUid
    }
  })
  return txn
}

async function postCreateClaimVotingAccount(params: {
  claimUid: string,
  strategy: any
}): Promise<RawTxnData> {
  let txn = await Sequencer.postTransaction(`claim-${params.claimUid}`, {
    type: 'CREATE_CLAIM_VOTING_ACCOUNT',
    data: {
      claimUid: params.claimUid,
      strategy: {
        requiredPositives: params.strategy.minPositives,
        requiredVotes: params.strategy.minVotes
      }
    }
  })
  return txn;
}  

async function postSendClaimVote(params: {
  claimUid: string,
  planUid: string,
  batchUid: string,
  electorId: string,
  index: number,
  result: string
}): Promise<RawTxnData> {
  let txn = await Sequencer.postTransaction(`claim-${params.claimUid}`, {
    type: 'SEND_CLAIM_VOTE',
    data: {
      planUid: params.planUid,
      batchUid: params.batchUid,
      claimUid: params.claimUid,
      electorAccountId: params.electorId,
      index: params.index,
      vote: params.result
    }
  });
  return txn;
}  
