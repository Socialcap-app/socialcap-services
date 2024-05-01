import { UID, CLAIMED, WAITING, UNPAID, VOTING } from "@socialcap/contracts-lib";
import { fastify, prisma, logger } from "../global.js";
import { hasError, hasResult, raiseError } from "../responses.js";
import { waitForTransaction } from "../services/mina-transactions.js";
import { updateEntity, getEntity } from "../dbs/any-entity-helpers.js";
import { getMasterPlan } from "../dbs/plan-helpers.js";
import { postCreateClaimVotingAccount } from "../dbs/sequencer-helpers.js"; 


export async function getClaim(params: any) {
  const uid = params.uid;
  let data = await getEntity("claim", uid);
  data.evidenceData = JSON.parse(data.evidenceData || "[]");
  return hasResult(data); 
}

export async function getMyClaims(params: any) {
  const userUid = params.user.uid;

  // all commnunity Uids where is a a member
  const claims = await prisma.claim.findMany({
    where: { applicantUid: userUid },
    orderBy: { createdUTC: 'asc' }
  })
  if (! claims) 
    return hasResult([]);
    
  const planUids  = claims.map((t) => t.planUid);
  const plans = await prisma.plan.findMany({
    where: { uid: { in: planUids } }
  })
  const mapPlans: any = {};
  (plans || []).map((t) => { mapPlans[t.uid] = t;})
    
  const cmnUids  = claims.map((t) => t.communityUid);
  const orgs = await prisma.community.findMany({
    where: { uid: { in: cmnUids } }
  })
  const mapOrgs: any = {};
  (orgs || []).map((t) => { mapOrgs[t.uid] = t;})

  // and patch some additional data into each Claim
  let claimed = (claims || []).map((t: any) => {
    const org = mapOrgs[t.communityUid];
    const plan = mapPlans[t.planUid];
    t.community = org.name;
    t.type = plan.name;
    t.description = plan.description;
    t.image = plan.image; 
    return t; 
  })

  return hasResult(claimed);
}


/**
 * Gets all claim instance data that are in a voting state (CLAIMED).
 * We need them for doing rollups over and over again.
 * @param params 
 */
export async function getRunningClaims(params: any) {
  // all commnunity Uids where is a a member
  const claims = await prisma.claim.findMany({
    where: { state: CLAIMED },
    orderBy: { createdUTC: 'asc' }
  })
  return hasResult({
    claims: claims || []
  })
}


/**
 * Mutations
 */
export async function addClaim(params: any) {
  const uid = UID.uuid4(); // a new plan
  params.new = true;

  params.evidenceData = JSON.stringify(params.evidenceData || "[]");
  params.state = parseInt(params.state || 1);
  params.createdUTC = (new Date()).toISOString();
  params.updatedUTC = params.createdUTC;
  let rs = await updateEntity("claim", uid, params);

  return hasResult({
    claim: rs.proved,
    transaction: rs.transaction
  }); 
}

export async function updateClaim(params: any) {
  const uid = params.uid;

  params.evidenceData = JSON.stringify(params.evidenceData || "[]");
  params.state = parseInt(params.state || 1);
  let rs = await updateEntity("claim", uid, params);

  return hasResult({
    claim: rs.proved,
    transaction: rs.transaction
  }); 
}

export async function updateClaimState(params: {
  uid: string,
  state: number,
  user: any
}) {
  const uid = params.uid;

  // firts get the current instance
  let data = await getEntity("claim", uid);

  // change just the state and update
  data.state = params.state || 1;

  let rs = await updateEntity("claim", uid, params);

  return hasResult({
    claim: rs.proved,
    transaction: rs.transaction
  }); 
}


export async function submitClaim(params: {
    claim: any,
    extras: any,
    user: any
  }) {
  const claim = params.claim;
  const uid = claim.uid;
  let {transaction, waitForPayment, addToQueue} = params.extras ;
  
  let rs: any;
  claim.evidenceData = JSON.stringify(claim.evidenceData || "[]");
  claim.state = parseInt(claim.state || 1);

  let plan = await getMasterPlan(claim.planUid);
  let strategy = plan?.strategy ? JSON.parse(plan?.strategy) : {};

  // check if we need to add it to the ClaimsQueue for latter processing
  let txn: any = null;
  if (addToQueue) {
    // we dont need to wait for payment, so we mark it as CLAIMED right now
    // the voting process will be started latter
    claim.state = CLAIMED; 
    rs = await updateEntity("claim", uid, claim);

    // if we don't have a created MINA account for this claim
    // we need to create it by dispatching the transaction 
    if (!claim.accountId) {
      txn = await postCreateClaimVotingAccount({
        claimUid: uid, 
        strategy: strategy
      });
    }
  }

  // check if we need to wait for Payment
  if (waitForPayment) {
    // we mark it as WAITING because we are not sure we will receive payment
    claim.state = WAITING; // waiting before not yet paid ...
    rs = await updateEntity("claim", uid, claim);
      //     waitForTransaction(
      //       transaction.hash, 
      //       params, 
      //       async (params: any) => {
      //         params.state = CLAIMED;
      //         await updateEntity("claim", params.uid, params);
      //         console.log("Succcess. Must start the voting process.");
      // 
      //         // we dont await for it, we just let it start whenever it can
      //         // startClaimVotingProcess(params);
      //       }, 
      //       async (params: any, err: any) => {
      //         logger.error(err);
      //         params.state = UNPAID; // Payment failed, must repay and resend
      //         await updateEntity("claim", params.uid, params);
      //       }
      //  );
  }

  return hasResult({
    claim: rs.proved,
    transaction: txn
  }); 
}
