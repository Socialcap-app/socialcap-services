import 'dotenv/config';
import { 
  setupSequencer, 
  startSequencer 
} from "./sequencer/core/index.js";

import { 
  CreateClaimVotingAccountDispatcher,
  SendClaimVoteDispatcher
} from "./sequencer/dispatchers/index.js"
import { logger } from './global.js';

// load worker options from .env
let WORKERS = [];
let basePort = Number(process.env.WORKERS_BASE_PORT);
let baseUrl = String(process.env.WORKERS_BASE_URL);
for (let j=0; j < 1; j++) {
  let port = String(basePort+(j+1))
  let key = 'WORKER_'+(String(j+1).padStart(2, '0')); 
  let [pk,sk] = String(process.env[key]).split(',');
  WORKERS[j] = {
    accountId: pk, 
    secretKey: sk, 
    workerUrl: `${baseUrl}:${port}`
  }
}

setupSequencer({
  // we need to instantiate all senders and dispatchers, 
  // each worker uses exactly one Socialcap MINA sender account 
  dispatchers: [
    (new CreateClaimVotingAccountDispatcher()),
    (new SendClaimVoteDispatcher())
  ],
  workers: WORKERS,
})

startSequencer() ;
