import { PrivateKey, PublicKey } from "o1js";
import { Sequencer } from "../sequencer/core/index.js";


// we need to generate a new key pair for each deploy

setTimeout(async () => {
  let txn = await Sequencer.postTransaction("CREATE_CLAIM_VOTING_ACCOUNT", {
    type: 'CREATE_CLAIM_VOTING_ACCOUNT',
    data: {
      claimUid: "6a01103",
      strategy: {
        requiredPositives: 7,
        requiredVotes: 7
      }
    }
  })
}, 1000)

setTimeout(async () => {
  let txn = await Sequencer.postTransaction("CREATE_CLAIM_VOTING_ACCOUNT", {
    type: 'CREATE_CLAIM_VOTING_ACCOUNT',
    data: {
      claimUid: "6b0104",
      strategy: {
        requiredPositives: 8,
        requiredVotes: 8
      }
    }
  })
}, 1000)
