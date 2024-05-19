import { noActions } from "./no-actions.js";
import { requestOtp, login } from "./sessions-controller.js";
import { signUp, updateProfile, getProfile } from "./persons-controller.js";
import { updateCommunity, getCommunity, getMyCommunities, getAllCommunities, checkCommunityNameExist } from "./communities-controller.js";
import { joinCommunity, promoteMember, updateMemberRole, getMembers } from "./members-controller.js";
import { getAdminedCommunity } from "./communities-controller.js"
import { getPlan, addPlan, updatePlan, getAdminedMasterPlans } from "./plans-controller.js";
import { getClaim, getMyClaims, addClaim, updateClaim, 
  updateClaimState, submitClaim, getRunningClaims } from "./claims-controller.js";
import { getTask, getMyTasks, getNullifier, submitTask, submitTasksBatch } from "./tasks-controller.js";
import { getCredential, getMyCredentials } from "./credentials-controller.js";
import { queryEmptySet } from "./empty-set.js"
import { getMyHome } from "./home-controllers.js";
import { enableVoting, stopClaimings, reassignElectors, closeVoting, reopenVoting } from "./plans-controller.js"; 
import { getClaimableMasterPlans, startTally, closeTally, issueCredentials } from "./plans-controller.js"; 

export { 
  queryHandlers,
  mutationHandlers,
};

const mutationHandlers = {
  'no_actions': { fn: noActions, authorize: false },
  'request_otp': { fn: requestOtp, authorize: false },
  'login': { fn: login, authorize: false },
  'sign_up': { fn: signUp, authorize: false },
  'update_profile': { fn: updateProfile, authorize: true },
  'update_community': { fn: updateCommunity, authorize: true },
  //'update_admined_community': { fn: updateAdminedCommunity, authorize: true },
  'join_community': { fn: joinCommunity, authorize: true },
  'promote_member': { fn: promoteMember, authorize: true },
  'update_member_role': { fn: updateMemberRole, authorize: true },
  'update_plan': { fn: updatePlan, authorize: true },
  'add_plan': { fn: addPlan, authorize: true },
  'add_claim': { fn: addClaim, authorize: true },
  'update_claim': { fn: updateClaim, authorize: true },
  'update_claim_state':  { fn: updateClaimState, authorize: true },
  'submit_claim': { fn: submitClaim, authorize: true },
  'submit_task':  { fn: submitTask, authorize: true },
  'submit_tasks_batch':  { fn: submitTasksBatch, authorize: true },
  'stop_claimings': { fn: stopClaimings, authorize: true},
  'enable_voting': { fn: enableVoting, authorize: true},
  'reassign_electors': { fn: reassignElectors, authorize: true},
  'close_voting': { fn: closeVoting, authorize: true},
  'reopen_voting': { fn: reopenVoting, authorize: true},
  'start_tally': { fn: startTally, authorize: true},
  'close_tally': { fn: closeTally, authorize: true},
  'issue_credentials': { fn: issueCredentials, authorize: true}
}

const queryHandlers = {
  'get_empty_set': { fn: queryEmptySet, authorize: false },
  'get_profile': { fn: getProfile, authorize: true },
  'get_my_home': { fn: getMyHome, authorize: true },
  'get_community': { fn: getCommunity, authorize: true },
  'get_my_communities': { fn: getMyCommunities, authorize: true },
  'get_all_communities': { fn: getAllCommunities, authorize: true },
  'get_members':  { fn: getMembers, authorize: true },
  'get_admined_community':  {  fn: getAdminedCommunity, authorize: true },
  'get_plan':  {  fn: getPlan, authorize: true },
  'get_admined_plans': { fn: getAdminedMasterPlans, authorize: true},
  // 'get_my_credentials': {  fn: getClaimables, authorize: true },
  'get_my_claims': {  fn: getMyClaims, authorize: true },
  'get_my_claimables': {  fn: getClaimableMasterPlans, authorize: true },
  'get_running_claims': {  fn: getRunningClaims, authorize: true },
  'get_claim': {  fn: getClaim, authorize: true },
  'get_task': { fn: getTask, authorize: true },
  'get_my_tasks': { fn: getMyTasks, authorize: true },
  'get_credential': { fn: getCredential, authorize: false },
  'get_my_credentials': { fn: getMyCredentials, authorize: true },
  'get_nullifier': { fn: getNullifier, authorize: true },
  'check_community_name_exist': {fn: checkCommunityNameExist, authorize: false}
};
