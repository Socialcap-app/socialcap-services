import { setupSequencer, startSequencer } from "./sequencer/index.js";

import { CreateClaimVotingAccountDispatcher } from "./dispatchers/dispatch-create-claim-voting-account.js";

setupSequencer({
  // we need to instantiate all needed dispatchers, 
  // we will have just one instance for each dispatcher class
  dispatchers: [
    { 
      name: 'CREATE_CLAIM_VOTING_ACCOUNT', 
      dispatcher: new CreateClaimVotingAccountDispatcher()
    }
  ]
})

startSequencer() ;
