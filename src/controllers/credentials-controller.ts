import { Mina, PublicKey, fetchAccount } from "o1js";
import { UID } from "@socialcap/contracts-lib";
//import { CLAIMED, WAITING, UNPAID, VOTING } from "@socialcap/collections";
import { fastify, prisma, logger } from "../global.js";
import { hasError, hasResult, raiseError } from "../responses.js";
import { getCredentialsInCommunity, findCredentialTransactions } from "../dbs/credential-helpers.js";
import { findClaim } from "../dbs/claim-helpers.js";
import { ClaimVotingContract } from "@socialcap/claim-voting";
// import { updateEntity, getEntity } from "../dbs/any-entity-helpers.js";


export interface OnchainCredentialData{
  chain: string; // devnet, berkeley, mainnet, zeko, ...
  address: string; // address of the zkApp claim account
  applicantUid: string;
  requiredQuorum: number;
  requiredPositives: number;
  positives:  bigint;
  negatives:  bigint;
  ignored:  bigint;
  transactions: {
    uid: string;
    type: string;
    sequence: bigint;
    hash: string;
    createdUTC: string;
    status: string;
    url: string;
  }[];
}

let VerificationKey: any | null = null;

async function isCompiled(vk: any | null): Promise<any | null> {
  if (!vk) {
    // TODO: use cache !
    try {
      let t0 = Date.now()
      const compiled = await ClaimVotingContract.compile();
      vk = compiled.verificationKey;
      let dt = (Date.now() - t0)/1000;
      console.log(`Compiled time=${dt}secs`);
      return vk;
    }
    catch (err) {
      throw Error("Unable to compile ClaimVotingContract contract");
    }
  }
  return vk;
}


export async function getCredential(params: any) {
  let uid = params.uid;
  
  //let data = await getEntity("credential", uid);
  let data = await prisma.credential.findUnique({ 
    where: { uid: uid }
  });
  if (!data) raiseError.DatabaseEngine(
    `Could not found Credential uid=${uid}`
  )

  return hasResult(data); 
}


/**
 * Get the Onchain (settled on MINA) info for this credential
 * @param params 
 * @param params.claimUid - UID of the claim that proved the credential
 * @param params.user - the user requesting it, extracted from the JWT token
 * @returns An OnchainCredentialData object with requested info
 */
export async function getCredentialOnchainData(params: {
  claimUid: string, 
  user: any
}) {
  let { claimUid, user } = params;
  
  let transactions = await findCredentialTransactions(claimUid);
    
  if (!(transactions || []).length) 
    raiseError.NotFound(`No transactions found for this claimUid=${claimUid}`);

  // the first transaction is allways the CREATE_CLAIM 
  let created = transactions.filter((t) => {
    return t.type === 'CREATE_CLAIM_VOTING_ACCOUNT'
  });
  let createData = JSON.parse(created[0].data);
 
  // set the Mina instance
  let Network = Mina.Network({
    mina: process.env.MINA_PROXY as string, 
    archive: process.env.MINA_ARCHIVE as string
  });
  Mina.setActiveInstance(Network);
  
  // check if account already exists
  let address = createData.claimAddress;
  /*
  let hasAccount = await fetchAccount(address);
  if (!hasAccount) 
    raiseError.NotFound(`No Account found for this claimUid=${claimUid}`);
  
  // now create the zkApp so we can query it 
  VerificationKey = await isCompiled(VerificationKey);
  let zkapp = new ClaimVotingContract(PublicKey.fromBase58(address));

  // get state vars
  let positives = zkapp.positive.get();
  let negatives = zkapp.negative.get();
  let ignored = zkapp.ignored.get();
  */
  let claim = await findClaim(claimUid);
  if (!claim) 
    raiseError.NotFound(`No claim found for this uid=${claimUid}`);

  // prepare data 
  let onchainData = {
    chain: 'berkeley',
    address: address,
    url: `https://minascan.io/berkeley/account/${address}/txs?type=zk-acc`,
    requiredQuorum: createData.strategy.requiredVotes,
    requiredPositives: createData.strategy.requiredPositives,
    applicantUid: claim?.applicantUid,
    positives: claim?.positiveVotes,
    negatives: claim?.negativeVotes,
    ignored: claim?.ignoredVotes,
    transactions: (transactions || []).map((t) => {
      return {
        uid: t.uid,
        type: (
          t.type === 'CREATE_CLAIM_VOTING_ACCOUNT' ? 'Created' : 
          t.type === 'SEND_CLAIM_VOTE' ? 'Vote' : ''
        ),  
        sequence: t.sequence,
        hash: t.txnHash,
        createdUTC: t.receivedUTC,
        status: t.stateDescr,
        url: `https://minascan.io/berkeley/tx/${t.txnHash}?type=zk-tx`
      }
    })
  }

  return hasResult(onchainData); 
}


export async function getMyCredentials(params: any) {
  const userUid = params.user.uid;
  const communityUid: string | undefined = params.communityUid;

  // all commnunity Uids where is a a member
  const credentials = await prisma.credential.findMany({
    where: { applicantUid: userUid, uid: communityUid  },
    orderBy: { issuedUTC: 'desc' }
  })
  if (! credentials) 
    return hasResult([]);

  return hasResult(credentials);
}


export async function getCommunityCredentials(params: {
  communityUid: string,
  user: any
}) {
  const userUid = params.user.uid;
  const communityUid: string = params.communityUid;

  // all commnunity Uids where is a a member
  const credentials = await getCredentialsInCommunity(
    communityUid
  )
  return hasResult(credentials);
}


///// MOCKUPS /////
const aCredentialMockup = {
  uid: "caaaaff63a48400a9ce57f3ad6960001",
  // the MINA account where this credential "lives"
  accountId: "B62x...01234", //
  // this are the other related MINA account ids
  applicantId: "B62qixo7ZaNjibjRh3dhU1rNLVzNUqDtgwyUB6n9xxYFrHEHmfJXbBf",
  claimId: "B62qoNJskZVfQVwf7jQ2vohCV1TzBgzaeTs1sayYb1ZDq6weLwV5CXP",
  // the source references (redundant by useful for querying)
  applicantUid: "ec3c6e254d0b42debd939d9a7bd7cacc",
  communityUid: "70ed0f69af174c399b1958c01dc191c0",
  claimUid: "fc2f96d6214b4b5696bf3a00eed12215",
  // type & description data
  type: "Community Active Help", // String?   @default("")
  description: "Rewarding those who helped others in a distingished form",//  String?   @default("")
  community: "My first DAO", // String? @default("")
  image: "bafybeig22bhtszvqbmenyekv7qb55hjqehriz6wmx7unsqygjieqxsc6dy", // String?   @default("")
  alias: "Manza", // String?   @default("")
  stars: 5, //Int?      @default(0)
  metadata: {}, // String?   @default("{}")
  revocable: false,
  issuedUTC: "2023-08-01T15:00:00.000Z", //    DateTime? @map("issued_utc")
  expiresUTC: "2023-08-01T15:00:00.000Z" //   DateTime? @map("expires _utc")
}
