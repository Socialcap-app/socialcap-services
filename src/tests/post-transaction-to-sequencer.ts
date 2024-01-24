import { PrivateKey, PublicKey } from "o1js";
import { Sequencer } from "../sequencer/core/index.js";
import { randomUUID } from "crypto";

// we need to generate a new key pair for each deploy

let ruid = () => randomUUID().replaceAll("-",'');
let qname = (uid: string) => `claim-${uid}`;

setTimeout(async () => {
  let uid = ruid();
  let txn = await Sequencer.postTransaction(qname(uid), {
    type: 'CREATE_CLAIM_VOTING_ACCOUNT',
    data: {
      claimUid: uid,
      strategy: {
        requiredPositives: 2,
        requiredVotes: 3
      }
    }
  })
  console.log("Posted txn=", txn);
}, 1000)


setTimeout(async () => {
  let uid = ruid();
  let txn = await Sequencer.postTransaction(qname(uid), {
    type: 'CREATE_CLAIM_VOTING_ACCOUNT',
    data: {
      claimUid: uid,
      strategy: {
        requiredPositives: 2,
        requiredVotes: 3
      }
    }
  })
  console.log("Posted txn=", txn);
}, 1000)

setTimeout(async () => {
  let uid = ruid();
  let txn = await Sequencer.postTransaction(qname(uid), {
    type: 'CREATE_CLAIM_VOTING_ACCOUNT',
    data: {
      claimUid: uid,
      strategy: {
        requiredPositives: 2,
        requiredVotes: 3
      }
    }
  })
  console.log("Posted txn=", txn);
}, 1000)
