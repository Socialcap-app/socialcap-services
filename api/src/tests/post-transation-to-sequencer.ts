import { PrivateKey, PublicKey } from "o1js";
import { postTransaction } from "../sequencer/index.js";


// we need to generate a new key pair for each deploy

setTimeout(async () => {
  const privateKey = PrivateKey.random();
  const publicKey = privateKey.toPublicKey();
  let account = {
    id: publicKey.toBase58(),
    publicKey: publicKey.toBase58(),
    privateKey: privateKey.toBase58()
  }
  
  let txn = await postTransaction("CREATE_CLAIM_VOTING_ACCOUNT", {
    type: 'CREATE_CLAIM_VOTING_ACCOUNT',
    data: {
      account: account,
      claimUid: "4a01",
      strategy: {
        requiredPositives: 2,
        requiredVotes: 3
      }
    }
  })
}, 1000)

setTimeout(async () => {
  const privateKey = PrivateKey.random();
  const publicKey = privateKey.toPublicKey();
  let account = {
    id: publicKey.toBase58(),
    publicKey: publicKey.toBase58(),
    privateKey: privateKey.toBase58()
  }
  
  let txn = await postTransaction("CREATE_CLAIM_VOTING_ACCOUNT", {
    type: 'CREATE_CLAIM_VOTING_ACCOUNT',
    data: {
      account: account,
      claimUid: "4a02",
      strategy: {
        requiredPositives: 2,
        requiredVotes: 3
      }
    }
  })
}, 1000)
