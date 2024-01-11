[Socialcap API](../README.md) / [Modules](../modules.md) / dbs/plan-helpers

# Module: dbs/plan-helpers

## Table of contents

### Functions

- [changeMasterPlanState](dbs_plan_helpers.md#changemasterplanstate)
- [findMasterPlanByName](dbs_plan_helpers.md#findmasterplanbyname)
- [getMasterPlan](dbs_plan_helpers.md#getmasterplan)

## Functions

### changeMasterPlanState

▸ **changeMasterPlanState**(`uid`, `state`): `Promise`\<`GetResult`\<\{ `alias`: ``null`` \| `string` ; `approvedUTC`: ``null`` \| `Date` ; `available`: ``null`` \| `number` ; `communityShare`: ``null`` \| `number` ; `communityUid`: `string` ; `createdUTC`: `Date` ; `description`: ``null`` \| `string` ; `endsUTC`: ``null`` \| `Date` ; `evidence`: ``null`` \| `string` ; `expiration`: ``null`` \| `number` ; `fee`: ``null`` \| `number` ; `image`: ``null`` \| `string` ; `name`: `string` ; `protocolShare`: ``null`` \| `number` ; `revocable`: ``null`` \| `boolean` ; `rewardsShare`: ``null`` \| `number` ; `startsUTC`: ``null`` \| `Date` ; `state`: `number` ; `strategy`: ``null`` \| `string` ; `template`: ``null`` \| `string` ; `total`: ``null`` \| `number` ; `uid`: `string` ; `updatedUTC`: `Date`  }, `unknown`, `never`\> & {}\>

Change only the plan state.

#### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |
| `state` | `number` |

#### Returns

`Promise`\<`GetResult`\<\{ `alias`: ``null`` \| `string` ; `approvedUTC`: ``null`` \| `Date` ; `available`: ``null`` \| `number` ; `communityShare`: ``null`` \| `number` ; `communityUid`: `string` ; `createdUTC`: `Date` ; `description`: ``null`` \| `string` ; `endsUTC`: ``null`` \| `Date` ; `evidence`: ``null`` \| `string` ; `expiration`: ``null`` \| `number` ; `fee`: ``null`` \| `number` ; `image`: ``null`` \| `string` ; `name`: `string` ; `protocolShare`: ``null`` \| `number` ; `revocable`: ``null`` \| `boolean` ; `rewardsShare`: ``null`` \| `number` ; `startsUTC`: ``null`` \| `Date` ; `state`: `number` ; `strategy`: ``null`` \| `string` ; `template`: ``null`` \| `string` ; `total`: ``null`` \| `number` ; `uid`: `string` ; `updatedUTC`: `Date`  }, `unknown`, `never`\> & {}\>

the modified plan

#### Defined in

[src/dbs/plan-helpers.ts:30](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/plan-helpers.ts#L30)

___

### findMasterPlanByName

▸ **findMasterPlanByName**(`communityUid`, `name`): `Promise`\<``null`` \| `GetResult`\<\{ `alias`: ``null`` \| `string` ; `approvedUTC`: ``null`` \| `Date` ; `available`: ``null`` \| `number` ; `communityShare`: ``null`` \| `number` ; `communityUid`: `string` ; `createdUTC`: `Date` ; `description`: ``null`` \| `string` ; `endsUTC`: ``null`` \| `Date` ; `evidence`: ``null`` \| `string` ; `expiration`: ``null`` \| `number` ; `fee`: ``null`` \| `number` ; `image`: ``null`` \| `string` ; `name`: `string` ; `protocolShare`: ``null`` \| `number` ; `revocable`: ``null`` \| `boolean` ; `rewardsShare`: ``null`` \| `number` ; `startsUTC`: ``null`` \| `Date` ; `state`: `number` ; `strategy`: ``null`` \| `string` ; `template`: ``null`` \| `string` ; `total`: ``null`` \| `number` ; `uid`: `string` ; `updatedUTC`: `Date`  }, `unknown`, `never`\> & {}\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `communityUid` | `string` |
| `name` | `string` |

#### Returns

`Promise`\<``null`` \| `GetResult`\<\{ `alias`: ``null`` \| `string` ; `approvedUTC`: ``null`` \| `Date` ; `available`: ``null`` \| `number` ; `communityShare`: ``null`` \| `number` ; `communityUid`: `string` ; `createdUTC`: `Date` ; `description`: ``null`` \| `string` ; `endsUTC`: ``null`` \| `Date` ; `evidence`: ``null`` \| `string` ; `expiration`: ``null`` \| `number` ; `fee`: ``null`` \| `number` ; `image`: ``null`` \| `string` ; `name`: `string` ; `protocolShare`: ``null`` \| `number` ; `revocable`: ``null`` \| `boolean` ; `rewardsShare`: ``null`` \| `number` ; `startsUTC`: ``null`` \| `Date` ; `state`: `number` ; `strategy`: ``null`` \| `string` ; `template`: ``null`` \| `string` ; `total`: ``null`` \| `number` ; `uid`: `string` ; `updatedUTC`: `Date`  }, `unknown`, `never`\> & {}\>

#### Defined in

[src/dbs/plan-helpers.ts:3](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/plan-helpers.ts#L3)

___

### getMasterPlan

▸ **getMasterPlan**(`uid`): `Promise`\<``null`` \| `GetResult`\<\{ `alias`: ``null`` \| `string` ; `approvedUTC`: ``null`` \| `Date` ; `available`: ``null`` \| `number` ; `communityShare`: ``null`` \| `number` ; `communityUid`: `string` ; `createdUTC`: `Date` ; `description`: ``null`` \| `string` ; `endsUTC`: ``null`` \| `Date` ; `evidence`: ``null`` \| `string` ; `expiration`: ``null`` \| `number` ; `fee`: ``null`` \| `number` ; `image`: ``null`` \| `string` ; `name`: `string` ; `protocolShare`: ``null`` \| `number` ; `revocable`: ``null`` \| `boolean` ; `rewardsShare`: ``null`` \| `number` ; `startsUTC`: ``null`` \| `Date` ; `state`: `number` ; `strategy`: ``null`` \| `string` ; `template`: ``null`` \| `string` ; `total`: ``null`` \| `number` ; `uid`: `string` ; `updatedUTC`: `Date`  }, `unknown`, `never`\> & {}\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |

#### Returns

`Promise`\<``null`` \| `GetResult`\<\{ `alias`: ``null`` \| `string` ; `approvedUTC`: ``null`` \| `Date` ; `available`: ``null`` \| `number` ; `communityShare`: ``null`` \| `number` ; `communityUid`: `string` ; `createdUTC`: `Date` ; `description`: ``null`` \| `string` ; `endsUTC`: ``null`` \| `Date` ; `evidence`: ``null`` \| `string` ; `expiration`: ``null`` \| `number` ; `fee`: ``null`` \| `number` ; `image`: ``null`` \| `string` ; `name`: `string` ; `protocolShare`: ``null`` \| `number` ; `revocable`: ``null`` \| `boolean` ; `rewardsShare`: ``null`` \| `number` ; `startsUTC`: ``null`` \| `Date` ; `state`: `number` ; `strategy`: ``null`` \| `string` ; `template`: ``null`` \| `string` ; `total`: ``null`` \| `number` ; `uid`: `string` ; `updatedUTC`: `Date`  }, `unknown`, `never`\> & {}\>

#### Defined in

[src/dbs/plan-helpers.ts:17](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/plan-helpers.ts#L17)
