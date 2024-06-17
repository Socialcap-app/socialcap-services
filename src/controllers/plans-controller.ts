import { UID } from "@socialcap/contracts-lib";
import { DRAFT, ACTIVE, CLAIMED, ASSIGNED, VOTING, TALLYING, DONE, CANCELED, APPROVED, REJECTED } from "@socialcap/contracts-lib";
import { fastify, prisma } from "../global.js";
import { hasError, hasResult, raiseError } from "../responses.js";
import { updateEntity, getEntity } from "../dbs/any-entity-helpers.js";
import { getMasterPlan, changeMasterPlanState, findAdminedMasterPlans } from "../dbs/plan-helpers.js";
import { getMyClaimableMasterPlans } from "../dbs/plan-helpers.js";
import { assignAllElectors } from "../services/voting-assign-electors.js";
import { closeAllVoting } from "../services/voting-close-voting.js";
import { processVotesBatches, TallyProcessResult } from "../services/voting-process-votes.js";
import { getClaimsByPlan, updateClaimAccountId } from "../dbs/claim-helpers.js";
import { getCommunity } from "./communities-controller.js";

interface Claimable {
  uid: string; // the UID of the MasterPlan ...
  communityUid: string;
  state: number;
  community: string;
  type: string; // this is the Masterplan name, used as 'type' in Credentials
  description: string;
  image: string;
  startsUTC: string;
  endsUTC: string;
  available: number;
  total: number;
  fee: number;
  joined: boolean;
}

export async function getPlan(params: any) {
  const uid = params.uid;
  let data = await getEntity("plan", uid);
  data.evidence = JSON.parse(data.evidence);
  data.strategy = JSON.parse(data.strategy);
  return hasResult(data);
}


export async function getAdminedMasterPlans(params: {
  user: any,
}) {
  const plans = await findAdminedMasterPlans(params.user.uid)
  return hasResult(plans);
}

/**
 * Get admin community admined master plans
 * @param params - the request 'params'
 * @param params.communityUid - `uuid` of the required community
 * @param params.user - the requesting user - should be an admin
 * @returns An array of master plans
 */
export async function getAdminedCommunityPlans(params: { user: any, communityUid: string }) {
  const uid = params.communityUid;

  let data = await getEntity("community", uid);

  // check if user is the Admin
  if (!(data.adminUid === params.user.uid || data.xadmins.includes(params.user.uid)))
    raiseError.ForbiddenError("Not the Admin of this community !");

  const plans = await prisma.plan.findMany({
    where: { communityUid: { equals: uid } },
    orderBy: { name: 'asc' }
  })
  return hasResult(plans);
}

export async function addPlan(params: any) {
  const uid = UID.uuid4(); // a new plan
  params.new = true;

  let rs = await updateEntity("plan", uid, params);

  return hasResult({
    plan: rs.proved,
    transaction: rs.transaction
  });
}


export async function updatePlan(params: any) {
  const uid = params.uid;

  params.evidence = JSON.stringify(params.evidence || "[]");
  params.strategy = JSON.stringify(params.strategy || "{}");
  params.state = parseInt(params.state || 1);
  let rs = await updateEntity("plan", uid, params);

  return hasResult({
    plan: rs.proved,
    transaction: rs.transaction
  });
}


/**
 * Get all ACTIVE Masterplans, filtered by the "joined" state.
 * Either all the active ones, or the ones the ones from joined communities.
 * @param params.joined - If false returns ALL, if true the ones I have joined
 * @returns - Masterplans list
 */
export async function getClaimableMasterPlans(params: {
  joined?: boolean,
  user: any
}) {
  const userUid = params.user.uid;
  const plans = await getMyClaimableMasterPlans(
    userUid,
    (params.joined !== undefined) ? params.joined : true
  );

  // and patch into the Claimables
  let claimables = (plans || []).map((t: any) => {
    return {
      uid: t.uid, // the UID of the MasterPlan ...
      communityUid: t.communityUid,
      state: t.state,
      community: t.community,
      type: t.type, 
      description: t.description,
      image: t.image,
      banner: t.banner, // Masterplans have avatars AND banners
      startsUTC: t.startsUtc,
      endsUTC: t.endsUtc,
      available: t.available,
      total: t.total,
      fee: t.fee,
      joined: t.joined
    } as Claimable;
  })

  return hasResult(claimables);
}


/**
 * Manage the different Master plan state changes 
 * and the actions related to this plan
 * 
 * Plan states:
 * - DRAFT:     when a new master plan is created
 * - ACTIVE:    when plan is active and people can submit claims
 * - CLAIMED:   all claims received, no more claims allowed
 * - VOTING:    we have enabled voting and electors can vote
 * - TALLYING: no more votes allowed, are counting votes 
 * - DONE:     we are done, we can issue creds nows 
 * - CANCELED:  when we have canceled a plan (will not be used)
 */
const VALID_STATE_CHANGE = {
  DRAFT: [ACTIVE, CANCELED],
  ACTIVE: [DRAFT, CLAIMED, CANCELED],
  CLAIMED: [VOTING, ACTIVE, CANCELED],
  VOTING: [TALLYING, CLAIMED, CANCELED],
  TALLYING: [VOTING, DONE, CANCELED]
}


/**
 * Stop the claimings process. No more submissions will be accepted.
 * @param params 
 * @returns 
 */
export async function stopClaimings(params: {
  planUid: string
  user: any,
}) {
  let plan = await getMasterPlan(params.planUid);
  if (plan?.state !== ACTIVE)
    return hasError.PreconditionFailed(`Plan ${plan?.uid} is not in the ACTIVE state.We can stop it.`)

  let rs = await changeMasterPlanState(plan.uid, CLAIMED);
  return hasResult(rs)
}


/**
 * Enable the voting process to start. 
 * 
 * The first thing we need to do before electors can vote is assign the 
 * electors, and then we can enable all selected electors to start voting.
 * The selected electors will have a task for each assigned claim.
 * 
 * All claims that had been assigned electors will change its state to VOTING,
 * and the whole plan will change state to VOTING. 
 * 
 * When the Plan is in the VOTING state we can not receive any more claims
 * and electors can not be reassigned (yet).
 * 
 * @param planUid the Masterplan that we will be assigning electors to
 * @param user the user making the request 
 * @returns the modified plan
 */
export async function enableVoting(params: {
  planUid: string
  user: any,
}) {
  let plan = await getMasterPlan(params.planUid);
  if (plan?.state !== CLAIMED)
    return hasError.PreconditionFailed(`Plan ${plan?.uid} is not in the CLAIMED state.We can not assign electors to it.`)

  let assigned = await assignAllElectors(params.planUid);
  console.log("Assigned=", assigned);
  if (assigned.claimsCount === 0)
    return hasError.NotFound(`Plan ${plan?.uid} has no claims.We can not assign electors to it.`)
  if (assigned.electorsCount === 0)
    return hasError.NotFound(`Plan ${plan?.uid} has no electors assigned.We can not proceed with the voting.`)

  let rs = await changeMasterPlanState(plan.uid, VOTING);
  return hasResult(rs)
}


/**
 * Reassign electors to claims that have just been CLAIMED.
 * We can not reassign electors to VOTING claims.
 * @param params planUid
 * @returns { plan, assigned: { claimsCount, electorsCount } }
 */
export async function reassignElectors(params: {
  planUid: string
  user: any,
}) {
  let plan = await getMasterPlan(params.planUid);
  if (plan?.state !== VOTING)
    return hasError.PreconditionFailed(`Plan ${plan?.uid} is not in the VOTING state.We can not reassign electors to it.`)

  let assigned = await assignAllElectors(params.planUid);
  if (assigned.claimsCount === 0)
    return hasError.NotFound(`Plan ${plan?.uid} has no claims.We can not assign electors to it.`)
  if (assigned.electorsCount === 0)
    return hasError.NotFound(`Plan ${plan?.uid} has no electors assigned.We can not proceed with the voting.`)

  return hasResult({
    plan: plan,
    assigned: assigned
  })
}


/**
 * Close the voting process.
 * After this, nobody can send its votes, and alls tasks should be deleted
 * or at least marked as done.
 * Then we can start counting the votes, but it MUST be started manually, we 
 * do not start counting just when the voting is closed.
 * @param planUid
 * @returns { plan }
 */
export async function closeVoting(params: {
  planUid: string
  user: any,
}) {
  let plan = await getMasterPlan(params.planUid);
  if (plan?.state !== VOTING)
    return hasError.PreconditionFailed(`Plan ${plan?.uid} is not in the VOTING state. We can not close voting.`)

  // services/voting-close-voting
  let done = await closeAllVoting(plan);

  let rs = await changeMasterPlanState(plan.uid, TALLYING);
  return hasResult({
    plan: rs,
    transaction: done.transaction
  })
}


export async function reopenVoting(params: {
  planUid: string
  user: any,
}) {
  let plan = await getMasterPlan(params.planUid);
  if (plan?.state !== TALLYING)
    return hasError.PreconditionFailed(`Plan ${plan?.uid} is not in the TALLYING state. We can not reopen voting.`)

  let rs = await changeMasterPlanState(plan.uid, VOTING);
  return hasResult(rs)
}


/**
 * Start the tally.
 * Here we process al received votes batches and send each collected vote 
 * to the corresponding claim zkApp.
 * @param params 
 */
export async function startTally(params: {
  planUid: string
  user: any,
}) {
  let plan = await getMasterPlan(params.planUid);
  if (plan?.state !== TALLYING)
    return hasError.PreconditionFailed(`Plan ${plan?.uid} is not in the TALLYING state. We can not start counting votes.`)

  // COUNT VOTES HERE !!!
  let done = await processVotesBatches(plan) as TallyProcessResult;

  let rs = await changeMasterPlanState(plan.uid, TALLYING);

  return hasResult({
    plan: rs,
    processed: done
  })
}


export async function closeTally(params: {
  planUid: string
  user: any,
}) {
  let plan = await getMasterPlan(params.planUid);
  if (plan?.state !== TALLYING)
    return hasError.PreconditionFailed(`Plan ${plan?.uid} is not in the TALLYING state. We can not close the tally.`)

  let rs = await changeMasterPlanState(plan.uid, DONE);

  return hasResult(rs)
}

/**
 * Issue all credentials approved in the plan.
 * We will not reissue credentials already issued.
 */
export async function issueCredentials(params: {
  planUid: string
  user: any,
}) {
  let plan = await getMasterPlan(params.planUid);
  if (!plan)
    return hasError.PreconditionFailed(`Plan ${params.planUid} does not exist. We can not issue credentials.`)
  if (plan?.state !== DONE)
    return hasError.PreconditionFailed(`Plan ${plan?.uid} is not in the DONE state. We can not issue credentials.`)
  let commnunity = await getEntity("community", plan.communityUid);

  // get approved claims
  const claims = await getClaimsByPlan(plan.uid, { states: [APPROVED] });
  let credentials: any[] = [];
  for (const claim of claims) {
    const credential = await prisma.credential.create({
      data: {
        uid: UID.uuid4(),
        accountId: claim.accountId!,
        applicantId: claim.applicantUid,
        claimId: claim.accountId!,
        applicantUid: claim.applicantUid,
        communityUid: claim.communityUid,
        claimUid: claim.uid,
        type: plan?.name,
        description: plan?.description,
        community: commnunity?.name,
        image: commnunity?.image,
        alias: commnunity?.alias,
        stars: commnunity?.stars,
        metadata: commnunity?.metadata,
        revocable: plan?.revocable,
        issuedUTC: claim.issuedUTC,
        expiresUTC: claim.dueUTC
      },
    });
    console.log("Added Credential=", credential);
    credentials.push(credential);
  }

  return hasResult(credentials)
}
