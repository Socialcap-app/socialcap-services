import 'dotenv/config';
import { 
  setupSequencer, 
  startSequencer 
} from "./sequencer/core/index.js";

import { 
  CreateClaimVotingAccountDispatcher,
  SendClaimVoteDispatcher
} from "./sequencer/dispatchers/index.js"

const SENDER_KEY = process.env.SENDER_KEY as string;
const SENDER_ID = process.env.SENDER_ID as string;
const DEPLOYER_KEY = process.env.DEPLOYER_KEY as string;
const DEPLOYER_ID = process.env.DEPLOYER_ID as string;


setupSequencer({
  // we need to instantiate all senders and dispatchers, 
  // each worker uses exactly one Socialcap MINA sender account 
  dispatchers: [
    (new CreateClaimVotingAccountDispatcher()),
    (new SendClaimVoteDispatcher())
  ],
  workers: [
    { 
      accountId: DEPLOYER_ID, 
      secretKey: DEPLOYER_KEY, 
      workerUrl: "http://localhost:3081" 
    },
    { 
      accountId: SENDER_ID, 
      secretKey: SENDER_KEY, 
      workerUrl: "http://localhost:3082" 
    },
  ]
})

startSequencer() ;
