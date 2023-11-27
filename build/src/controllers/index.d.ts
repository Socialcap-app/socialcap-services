import { noActions } from "./no-actions.js";
import { requestOtp, login } from "./sessions-controller.js";
import { signUp, updateProfile, getProfile } from "./persons-controller.js";
import { updateCommunity, getCommunity, getMyCommunities, getAllCommunities } from "./communities-controller.js";
import { joinCommunity, promoteMember, updateMemberRole } from "./members-controller.js";
import { getAdminedCommunity } from "./communities-controller.js";
import { getPlan, addPlan, updatePlan } from "./plans-controller.js";
import { getClaim, getMyClaimables, getMyClaims, addClaim, updateClaim, updateClaimState, submitClaim, getRunningClaims } from "./claims-controller.js";
import { getTask, getMyTasks, getNullifier, submitTask, submitTasksBatch } from "./tasks-controller.js";
import { getCredential, getMyCredentials } from "./credentials-controller.js";
import { queryEmptySet } from "./empty-set.js";
import { getMyHome } from "./home-controllers.js";
export { queryHandlers, mutationHandlers, };
declare const mutationHandlers: {
    no_actions: {
        fn: typeof noActions;
        authorize: boolean;
    };
    request_otp: {
        fn: typeof requestOtp;
        authorize: boolean;
    };
    login: {
        fn: typeof login;
        authorize: boolean;
    };
    sign_up: {
        fn: typeof signUp;
        authorize: boolean;
    };
    update_profile: {
        fn: typeof updateProfile;
        authorize: boolean;
    };
    update_community: {
        fn: typeof updateCommunity;
        authorize: boolean;
    };
    join_community: {
        fn: typeof joinCommunity;
        authorize: boolean;
    };
    promote_member: {
        fn: typeof promoteMember;
        authorize: boolean;
    };
    update_member_role: {
        fn: typeof updateMemberRole;
        authorize: boolean;
    };
    update_plan: {
        fn: typeof updatePlan;
        authorize: boolean;
    };
    add_plan: {
        fn: typeof addPlan;
        authorize: boolean;
    };
    add_claim: {
        fn: typeof addClaim;
        authorize: boolean;
    };
    update_claim: {
        fn: typeof updateClaim;
        authorize: boolean;
    };
    update_claim_state: {
        fn: typeof updateClaimState;
        authorize: boolean;
    };
    submit_claim: {
        fn: typeof submitClaim;
        authorize: boolean;
    };
    submit_task: {
        fn: typeof submitTask;
        authorize: boolean;
    };
    submit_tasks_batch: {
        fn: typeof submitTasksBatch;
        authorize: boolean;
    };
};
declare const queryHandlers: {
    get_empty_set: {
        fn: typeof queryEmptySet;
        authorize: boolean;
    };
    get_profile: {
        fn: typeof getProfile;
        authorize: boolean;
    };
    get_my_home: {
        fn: typeof getMyHome;
        authorize: boolean;
    };
    get_community: {
        fn: typeof getCommunity;
        authorize: boolean;
    };
    get_my_communities: {
        fn: typeof getMyCommunities;
        authorize: boolean;
    };
    get_all_communities: {
        fn: typeof getAllCommunities;
        authorize: boolean;
    };
    get_admined_community: {
        fn: typeof getAdminedCommunity;
        authorize: boolean;
    };
    get_plan: {
        fn: typeof getPlan;
        authorize: boolean;
    };
    get_my_claims: {
        fn: typeof getMyClaims;
        authorize: boolean;
    };
    get_my_claimables: {
        fn: typeof getMyClaimables;
        authorize: boolean;
    };
    get_running_claims: {
        fn: typeof getRunningClaims;
        authorize: boolean;
    };
    get_claim: {
        fn: typeof getClaim;
        authorize: boolean;
    };
    get_task: {
        fn: typeof getTask;
        authorize: boolean;
    };
    get_my_tasks: {
        fn: typeof getMyTasks;
        authorize: boolean;
    };
    get_credential: {
        fn: typeof getCredential;
        authorize: boolean;
    };
    get_my_credentials: {
        fn: typeof getMyCredentials;
        authorize: boolean;
    };
    get_nullifier: {
        fn: typeof getNullifier;
        authorize: boolean;
    };
};
