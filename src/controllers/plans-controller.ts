import { UID } from "@socialcap/contracts-lib";
import { DRAFT, ACTIVE, CLAIMED, ASSIGNED, VOTING, TALLYING, DONE, CANCELED } from "@socialcap/contracts-lib";
import { fastify, prisma } from "../global.js";
import { hasError, hasResult, raiseError } from "../responses.js";
import { updateEntity, getEntity } from "../dbs/any-entity-helpers.js";
import { getMasterPlan, changeMasterPlanState } from "../dbs/plan-helpers.js";
import { assignAllElectors } from "../services/voting-assign-electors.js";
import { closeAllVoting } from "../services/voting-close-voting.js";
import { processVotesBatches, TallyProcessResult } from "../services/voting-process-votes.js";


export async function getPlan(params: any) {
  const uid = params.uid;
  let data = await getEntity("plan", uid);
  data.evidence = JSON.parse(data.evidence);
  data.strategy = JSON.parse(data.strategy);
  return hasResult(data); 
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
  let plan = await getMasterPlan(params.planUid) ;
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
  let plan = await getMasterPlan(params.planUid) ;
  if (plan?.state !== CLAIMED) 
    return hasError.PreconditionFailed(`Plan ${plan?.uid} is not in the CLAIMED state.We can not assign electors to it.`)

  let assigned = await assignAllElectors(params.planUid);
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
  let plan = await getMasterPlan(params.planUid) ;
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
  let plan = await getMasterPlan(params.planUid) ;
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
  let plan = await getMasterPlan(params.planUid) ;
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
  let plan = await getMasterPlan(params.planUid) ;
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
  let plan = await getMasterPlan(params.planUid) ;
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
}
