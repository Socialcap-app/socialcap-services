import { PrivateKey, PublicKey } from "o1js";
import { Sequencer } from "../sequencer/core/index.js";
import { randomUUID } from "crypto";

// we need to generate a new key pair for each deploy

function ruid() {
  let u = randomUUID().replaceAll("-",'');
  return u;
}

setTimeout(async () => {
  let uid = ruid();
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
  console.log("Posted txn=", txn);
}, 1000)


setTimeout(async () => {
  let uid = ruid();
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
  console.log("Posted txn=", txn);
}, 1000)
