import { PrivateKey, PublicKey } from "o1js";
import { Sequencer } from "../sequencer/core/index.js";


// we need to generate a new key pair for each deploy

setTimeout(async () => {
  let uid = "6a012037";
  let txn = await Sequencer.postTransaction(`claims-${uid}`, {
    type: 'CREATE_CLAIM_VOTING_ACCOUNT',
    data: {
      claimUid: uid,
      strategy: {
        requiredPositives: 7,
        requiredVotes: 7
      }
    }
  })
}, 1000)


setTimeout(async () => {
  let uid = "6a012038";
  let txn = await Sequencer.postTransaction(`claims-${uid}`, {
    type: 'CREATE_CLAIM_VOTING_ACCOUNT',
    data: {
      claimUid: uid,
      strategy: {
        requiredPositives: 8,
        requiredVotes: 8
      }
    }
  })
}, 1000)
