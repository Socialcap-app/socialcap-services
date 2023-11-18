import { setupSequencer, startSequencer } from "./sequencer/index.js";

import { CreateClaimVotingAccountDispatcher } from "./dispatchers/dispatch-create-claim-voting-account.js";

setupSequencer({
  dispatchers: [
    { 
      name: 'CREATE_CLAIM_VOTING_ACCOUNT', 
      dispatcher: CreateClaimVotingAccountDispatcher
    }
  ]
})

startSequencer() ;
