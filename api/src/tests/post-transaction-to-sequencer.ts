import { PrivateKey, PublicKey } from "o1js";
import { postTransaction } from "../sequencer/index.js";


// we need to generate a new key pair for each deploy

setTimeout(async () => {
  let txn = await postTransaction("CREATE_CLAIM_VOTING_ACCOUNT", {
    type: 'CREATE_CLAIM_VOTING_ACCOUNT',
    data: {
      claimUid: "4a0102",
      strategy: {
        requiredPositives: 2,
        requiredVotes: 3
      }
    }
  })
}, 1000)

setTimeout(async () => {
  let txn = await postTransaction("CREATE_CLAIM_VOTING_ACCOUNT", {
    type: 'CREATE_CLAIM_VOTING_ACCOUNT',
    data: {
      claimUid: "4a0202",
      strategy: {
        requiredPositives: 3,
        requiredVotes: 5
      }
    }
  })
}, 1000)
