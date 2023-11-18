/**
 * Dispatchers
 * Theis is the set of Dispatchers used to submit transactions or actions
 * for a given type. There is one (and only one) Dispatcher per type.
 */
import { AnyDispatcher } from "./any-dispatcher.js";

export { Dispatchers, addDispatcher, IDispatcherEntry }

interface IDispatcherEntry {
  name: string;
  dispatcher: any
}

const Dispatchers: Map<string, any> = new Map();

function addDispatcher(
  name: string, 
  dispatcher: AnyDispatcher) 
{
  Dispatchers.set(name, dispatcher);
}

/*
async function sendClaimVote() { return }
async function rollupClaimVotes() { return }
async function createVotingBatchesAccount() { return }
async function receiveVotesBatch() { return }
async function commitAllBatches() { return }

any = {
  "CREATE_CLAIM_VOTING_ACCOUNT": CreateClaimVotingAccountDispatcher,
  "SEND_CLAIM_VOTE": sendClaimVote,
  "ROLL_UP_CLAIM_VOTES": rollupClaimVotes,
  "CREATE_VOTING_BATCHES_ACCOUNT": createVotingBatchesAccount,
  "RECEIVE_VOTES_BATCH": receiveVotesBatch,
  "COMMIT_ALL_BATCHES": commitAllBatches,
}
*/

