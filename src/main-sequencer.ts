import { 
  setupSequencer, 
  startSequencer 
} from "./sequencer/core/index.js";

import {
  CREATE_CLAIM_VOTING_ACCOUNT,
  SEND_CLAIM_VOTE,
  CREATE_VOTING_PLAN_ACCOUNT,
  RECEIVE_VOTES_BATCH,
  COMMIT_ALL_BATCHES,
  CreateClaimVotingAccountDispatcher,
  SendClaimVoteDispatcher
} from "./sequencer/dispatchers/index.js"

setupSequencer({
  // we need to instantiate all needed dispatchers, 
  // we will have just one instance for each dispatcher class
  dispatchers: [
    (new CreateClaimVotingAccountDispatcher()),
    (new SendClaimVoteDispatcher())
  ]
})

startSequencer() ;
