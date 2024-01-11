[Socialcap API](../README.md) / [Exports](../modules.md) / index

# Module: index

## Table of contents

### Variables

- [mutationHandlers](index.md#mutationhandlers)
- [queryHandlers](index.md#queryhandlers)

## Variables

### mutationHandlers

• `Const` **mutationHandlers**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `add_claim` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = addClaim } |
| `add_claim.authorize` | `boolean` |
| `add_claim.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `add_plan` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = addPlan } |
| `add_plan.authorize` | `boolean` |
| `add_plan.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `join_community` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = joinCommunity } |
| `join_community.authorize` | `boolean` |
| `join_community.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `login` | \{ `authorize`: `boolean` = false; `fn`: (`params`: \{ `otp`: `string` ; `session_key`: `string`  }) => `Promise`\<`ResultOrError`\> = login } |
| `login.authorize` | `boolean` |
| `login.fn` | (`params`: \{ `otp`: `string` ; `session_key`: `string`  }) => `Promise`\<`ResultOrError`\> |
| `no_actions` | \{ `authorize`: `boolean` = false; `fn`: (`params`: `Object`) => `Promise`\<`ResultOrError`\> = noActions } |
| `no_actions.authorize` | `boolean` |
| `no_actions.fn` | (`params`: `Object`) => `Promise`\<`ResultOrError`\> |
| `promote_member` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = promoteMember } |
| `promote_member.authorize` | `boolean` |
| `promote_member.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `request_otp` | \{ `authorize`: `boolean` = false; `fn`: (`params`: `object`) => `Promise`\<`ResultOrError`\> = requestOtp } |
| `request_otp.authorize` | `boolean` |
| `request_otp.fn` | (`params`: `object`) => `Promise`\<`ResultOrError`\> |
| `sign_up` | \{ `authorize`: `boolean` = false; `fn`: (`params`: \{ `email`: `string` ; `full_name`: `string` ; `phone?`: `string` ; `telegram?`: `string`  }) => `Promise`\<`ResultOrError`\> = signUp } |
| `sign_up.authorize` | `boolean` |
| `sign_up.fn` | (`params`: \{ `email`: `string` ; `full_name`: `string` ; `phone?`: `string` ; `telegram?`: `string`  }) => `Promise`\<`ResultOrError`\> |
| `submit_claim` | \{ `authorize`: `boolean` = true; `fn`: (`params`: \{ `claim`: `any` ; `extras`: `any` ; `user`: `any`  }) => `Promise`\<`ResultOrError`\> = submitClaim } |
| `submit_claim.authorize` | `boolean` |
| `submit_claim.fn` | (`params`: \{ `claim`: `any` ; `extras`: `any` ; `user`: `any`  }) => `Promise`\<`ResultOrError`\> |
| `submit_task` | \{ `authorize`: `boolean` = true; `fn`: (`params`: \{ `claimUid`: `string` ; `extras`: \{ `addToQueue`: `boolean`  } ; `senderAccountId`: `string` ; `uid`: `string` ; `user`: `any`  }) => `Promise`\<`ResultOrError`\> = submitTask } |
| `submit_task.authorize` | `boolean` |
| `submit_task.fn` | (`params`: \{ `claimUid`: `string` ; `extras`: \{ `addToQueue`: `boolean`  } ; `senderAccountId`: `string` ; `uid`: `string` ; `user`: `any`  }) => `Promise`\<`ResultOrError`\> |
| `submit_tasks_batch` | \{ `authorize`: `boolean` = true; `fn`: (`params`: \{ `extras?`: \{ `addToQueue`: `boolean`  } ; `senderAccountId`: `string` ; `signedData`: `any` ; `user`: `any`  }) => `Promise`\<`ResultOrError`\> = submitTasksBatch } |
| `submit_tasks_batch.authorize` | `boolean` |
| `submit_tasks_batch.fn` | (`params`: \{ `extras?`: \{ `addToQueue`: `boolean`  } ; `senderAccountId`: `string` ; `signedData`: `any` ; `user`: `any`  }) => `Promise`\<`ResultOrError`\> |
| `update_claim` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = updateClaim } |
| `update_claim.authorize` | `boolean` |
| `update_claim.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `update_claim_state` | \{ `authorize`: `boolean` = true; `fn`: (`params`: \{ `state`: `number` ; `uid`: `string` ; `user`: `any`  }) => `Promise`\<`ResultOrError`\> = updateClaimState } |
| `update_claim_state.authorize` | `boolean` |
| `update_claim_state.fn` | (`params`: \{ `state`: `number` ; `uid`: `string` ; `user`: `any`  }) => `Promise`\<`ResultOrError`\> |
| `update_community` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = updateCommunity } |
| `update_community.authorize` | `boolean` |
| `update_community.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `update_member_role` | \{ `authorize`: `boolean` = true; `fn`: (`params`: \{ `communityUid`: `string` ; `personUid`: `string` ; `role`: `number` ; `user`: `any`  }) => `Promise`\<`ResultOrError`\> = updateMemberRole } |
| `update_member_role.authorize` | `boolean` |
| `update_member_role.fn` | (`params`: \{ `communityUid`: `string` ; `personUid`: `string` ; `role`: `number` ; `user`: `any`  }) => `Promise`\<`ResultOrError`\> |
| `update_plan` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = updatePlan } |
| `update_plan.authorize` | `boolean` |
| `update_plan.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `update_profile` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = updateProfile } |
| `update_profile.authorize` | `boolean` |
| `update_profile.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |

#### Defined in

[index.ts:20](https://github.com/Identicon-Dao/socialcap-services/blob/21d5347d/src/controllers/index.ts#L20)

___

### queryHandlers

• `Const` **queryHandlers**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `get_admined_community` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = getAdminedCommunity } |
| `get_admined_community.authorize` | `boolean` |
| `get_admined_community.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `get_all_communities` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = getAllCommunities } |
| `get_all_communities.authorize` | `boolean` |
| `get_all_communities.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `get_claim` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = getClaim } |
| `get_claim.authorize` | `boolean` |
| `get_claim.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `get_community` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = getCommunity } |
| `get_community.authorize` | `boolean` |
| `get_community.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `get_credential` | \{ `authorize`: `boolean` = false; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = getCredential } |
| `get_credential.authorize` | `boolean` |
| `get_credential.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `get_empty_set` | \{ `authorize`: `boolean` = false; `fn`: (`params`: `Object`) => `Promise`\<`ResultOrError`\> = queryEmptySet } |
| `get_empty_set.authorize` | `boolean` |
| `get_empty_set.fn` | (`params`: `Object`) => `Promise`\<`ResultOrError`\> |
| `get_my_claimables` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = getMyClaimables } |
| `get_my_claimables.authorize` | `boolean` |
| `get_my_claimables.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `get_my_claims` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = getMyClaims } |
| `get_my_claims.authorize` | `boolean` |
| `get_my_claims.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `get_my_communities` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = getMyCommunities } |
| `get_my_communities.authorize` | `boolean` |
| `get_my_communities.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `get_my_credentials` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = getMyCredentials } |
| `get_my_credentials.authorize` | `boolean` |
| `get_my_credentials.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `get_my_home` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = getMyHome } |
| `get_my_home.authorize` | `boolean` |
| `get_my_home.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `get_my_tasks` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = getMyTasks } |
| `get_my_tasks.authorize` | `boolean` |
| `get_my_tasks.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `get_nullifier` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = getNullifier } |
| `get_nullifier.authorize` | `boolean` |
| `get_nullifier.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `get_plan` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = getPlan } |
| `get_plan.authorize` | `boolean` |
| `get_plan.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `get_profile` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = getProfile } |
| `get_profile.authorize` | `boolean` |
| `get_profile.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `get_running_claims` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = getRunningClaims } |
| `get_running_claims.authorize` | `boolean` |
| `get_running_claims.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |
| `get_task` | \{ `authorize`: `boolean` = true; `fn`: (`params`: `any`) => `Promise`\<`ResultOrError`\> = getTask } |
| `get_task.authorize` | `boolean` |
| `get_task.fn` | (`params`: `any`) => `Promise`\<`ResultOrError`\> |

#### Defined in

[index.ts:41](https://github.com/Identicon-Dao/socialcap-services/blob/21d5347d/src/controllers/index.ts#L41)
