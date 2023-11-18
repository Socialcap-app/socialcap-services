import { postTransaction } from "../sequencer/index.js";

setTimeout(async () => {
  let txn = await postTransaction("CREATE_CLAIM_VOTING_ACCOUNT", {
    type: 'CREATE_CLAIM_VOTING_ACCOUNT',
    data: {
      claimUid: "5555555",
      strategy: {
        requiredPositives: 2,
        requiredVotes: 3
      }
    }
  })
}, 1000)
