[Socialcap API](../README.md) / [Modules](../modules.md) / dbs/claim-helpers

# Module: dbs/claim-helpers

## Table of contents

### Functions

- [getClaim](dbs_claim_helpers.md#getclaim)
- [getClaimsByPlan](dbs_claim_helpers.md#getclaimsbyplan)
- [getRunningClaims](dbs_claim_helpers.md#getrunningclaims)
- [updateClaimAccountId](dbs_claim_helpers.md#updateclaimaccountid)
- [updateClaimVotes](dbs_claim_helpers.md#updateclaimvotes)

## Functions

### getClaim

▸ **getClaim**(`uid`): `Promise`\<``null`` \| `GetResult`\<\{ `accountId`: ``null`` \| `string` ; `alias`: ``null`` \| `string` ; `applicantUid`: `string` ; `communityUid`: `string` ; `createdUTC`: `Date` ; `dueUTC`: ``null`` \| `Date` ; `evidenceData`: ``null`` \| `string` ; `ignoredVotes`: ``null`` \| `number` ; `issuedUTC`: ``null`` \| `Date` ; `negativeVotes`: ``null`` \| `number` ; `planUid`: `string` ; `positiveVotes`: ``null`` \| `number` ; `requiredPositives`: ``null`` \| `number` ; `requiredVotes`: ``null`` \| `number` ; `state`: `number` ; `uid`: `string` ; `updatedUTC`: `Date` ; `votedUTC`: ``null`` \| `Date`  }, `unknown`, `never`\> & {}\>

Gets a claim given its unique uid.

#### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |

#### Returns

`Promise`\<``null`` \| `GetResult`\<\{ `accountId`: ``null`` \| `string` ; `alias`: ``null`` \| `string` ; `applicantUid`: `string` ; `communityUid`: `string` ; `createdUTC`: `Date` ; `dueUTC`: ``null`` \| `Date` ; `evidenceData`: ``null`` \| `string` ; `ignoredVotes`: ``null`` \| `number` ; `issuedUTC`: ``null`` \| `Date` ; `negativeVotes`: ``null`` \| `number` ; `planUid`: `string` ; `positiveVotes`: ``null`` \| `number` ; `requiredPositives`: ``null`` \| `number` ; `requiredVotes`: ``null`` \| `number` ; `state`: `number` ; `uid`: `string` ; `updatedUTC`: `Date` ; `votedUTC`: ``null`` \| `Date`  }, `unknown`, `never`\> & {}\>

Claim object (prisma.claim) or Null

#### Defined in

[src/dbs/claim-helpers.ts:10](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/claim-helpers.ts#L10)

___

### getClaimsByPlan

▸ **getClaimsByPlan**(`planUid`, `params`): `Promise`\<`GetResult`\<\{ `accountId`: ``null`` \| `string` ; `alias`: ``null`` \| `string` ; `applicantUid`: `string` ; `communityUid`: `string` ; `createdUTC`: `Date` ; `dueUTC`: ``null`` \| `Date` ; `evidenceData`: ``null`` \| `string` ; `ignoredVotes`: ``null`` \| `number` ; `issuedUTC`: ``null`` \| `Date` ; `negativeVotes`: ``null`` \| `number` ; `planUid`: `string` ; `positiveVotes`: ``null`` \| `number` ; `requiredPositives`: ``null`` \| `number` ; `requiredVotes`: ``null`` \| `number` ; `state`: `number` ; `uid`: `string` ; `updatedUTC`: `Date` ; `votedUTC`: ``null`` \| `Date`  }, `unknown`, `never`\> & {}[]\>

Get all claims in the given states, belonging to this plan.

#### Parameters

| Name | Type |
| :------ | :------ |
| `planUid` | `string` |
| `params` | `Object` |
| `params.states` | `number`[] |

#### Returns

`Promise`\<`GetResult`\<\{ `accountId`: ``null`` \| `string` ; `alias`: ``null`` \| `string` ; `applicantUid`: `string` ; `communityUid`: `string` ; `createdUTC`: `Date` ; `dueUTC`: ``null`` \| `Date` ; `evidenceData`: ``null`` \| `string` ; `ignoredVotes`: ``null`` \| `number` ; `issuedUTC`: ``null`` \| `Date` ; `negativeVotes`: ``null`` \| `number` ; `planUid`: `string` ; `positiveVotes`: ``null`` \| `number` ; `requiredPositives`: ``null`` \| `number` ; `requiredVotes`: ``null`` \| `number` ; `state`: `number` ; `uid`: `string` ; `updatedUTC`: `Date` ; `votedUTC`: ``null`` \| `Date`  }, `unknown`, `never`\> & {}[]\>

#### Defined in

[src/dbs/claim-helpers.ts:36](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/claim-helpers.ts#L36)

___

### getRunningClaims

▸ **getRunningClaims**(`params?`): `Promise`\<`GetResult`\<\{ `accountId`: ``null`` \| `string` ; `alias`: ``null`` \| `string` ; `applicantUid`: `string` ; `communityUid`: `string` ; `createdUTC`: `Date` ; `dueUTC`: ``null`` \| `Date` ; `evidenceData`: ``null`` \| `string` ; `ignoredVotes`: ``null`` \| `number` ; `issuedUTC`: ``null`` \| `Date` ; `negativeVotes`: ``null`` \| `number` ; `planUid`: `string` ; `positiveVotes`: ``null`` \| `number` ; `requiredPositives`: ``null`` \| `number` ; `requiredVotes`: ``null`` \| `number` ; `state`: `number` ; `uid`: `string` ; `updatedUTC`: `Date` ; `votedUTC`: ``null`` \| `Date`  }, `unknown`, `never`\> & {}[]\>

Gets all claim instance data that are in a voting state (CLAIMED).
We need them for doing rollups over and over again.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `any` |

#### Returns

`Promise`\<`GetResult`\<\{ `accountId`: ``null`` \| `string` ; `alias`: ``null`` \| `string` ; `applicantUid`: `string` ; `communityUid`: `string` ; `createdUTC`: `Date` ; `dueUTC`: ``null`` \| `Date` ; `evidenceData`: ``null`` \| `string` ; `ignoredVotes`: ``null`` \| `number` ; `issuedUTC`: ``null`` \| `Date` ; `negativeVotes`: ``null`` \| `number` ; `planUid`: `string` ; `positiveVotes`: ``null`` \| `number` ; `requiredPositives`: ``null`` \| `number` ; `requiredVotes`: ``null`` \| `number` ; `state`: `number` ; `uid`: `string` ; `updatedUTC`: `Date` ; `votedUTC`: ``null`` \| `Date`  }, `unknown`, `never`\> & {}[]\>

array of running claims

#### Defined in

[src/dbs/claim-helpers.ts:21](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/claim-helpers.ts#L21)

___

### updateClaimAccountId

▸ **updateClaimAccountId**(`uid`, `params`): `Promise`\<`GetResult`\<\{ `accountId`: ``null`` \| `string` ; `alias`: ``null`` \| `string` ; `applicantUid`: `string` ; `communityUid`: `string` ; `createdUTC`: `Date` ; `dueUTC`: ``null`` \| `Date` ; `evidenceData`: ``null`` \| `string` ; `ignoredVotes`: ``null`` \| `number` ; `issuedUTC`: ``null`` \| `Date` ; `negativeVotes`: ``null`` \| `number` ; `planUid`: `string` ; `positiveVotes`: ``null`` \| `number` ; `requiredPositives`: ``null`` \| `number` ; `requiredVotes`: ``null`` \| `number` ; `state`: `number` ; `uid`: `string` ; `updatedUTC`: `Date` ; `votedUTC`: ``null`` \| `Date`  }, `unknown`, `never`\> & {}\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |
| `params` | `Object` |
| `params.accountId` | `string` |

#### Returns

`Promise`\<`GetResult`\<\{ `accountId`: ``null`` \| `string` ; `alias`: ``null`` \| `string` ; `applicantUid`: `string` ; `communityUid`: `string` ; `createdUTC`: `Date` ; `dueUTC`: ``null`` \| `Date` ; `evidenceData`: ``null`` \| `string` ; `ignoredVotes`: ``null`` \| `number` ; `issuedUTC`: ``null`` \| `Date` ; `negativeVotes`: ``null`` \| `number` ; `planUid`: `string` ; `positiveVotes`: ``null`` \| `number` ; `requiredPositives`: ``null`` \| `number` ; `requiredVotes`: ``null`` \| `number` ; `state`: `number` ; `uid`: `string` ; `updatedUTC`: `Date` ; `votedUTC`: ``null`` \| `Date`  }, `unknown`, `never`\> & {}\>

#### Defined in

[src/dbs/claim-helpers.ts:72](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/claim-helpers.ts#L72)

___

### updateClaimVotes

▸ **updateClaimVotes**(`params`): `Promise`\<`GetResult`\<\{ `accountId`: ``null`` \| `string` ; `alias`: ``null`` \| `string` ; `applicantUid`: `string` ; `communityUid`: `string` ; `createdUTC`: `Date` ; `dueUTC`: ``null`` \| `Date` ; `evidenceData`: ``null`` \| `string` ; `ignoredVotes`: ``null`` \| `number` ; `issuedUTC`: ``null`` \| `Date` ; `negativeVotes`: ``null`` \| `number` ; `planUid`: `string` ; `positiveVotes`: ``null`` \| `number` ; `requiredPositives`: ``null`` \| `number` ; `requiredVotes`: ``null`` \| `number` ; `state`: `number` ; `uid`: `string` ; `updatedUTC`: `Date` ; `votedUTC`: ``null`` \| `Date`  }, `unknown`, `never`\> & {}\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.ignored` | `number` |
| `params.negative` | `number` |
| `params.positive` | `number` |
| `params.uid` | `string` |

#### Returns

`Promise`\<`GetResult`\<\{ `accountId`: ``null`` \| `string` ; `alias`: ``null`` \| `string` ; `applicantUid`: `string` ; `communityUid`: `string` ; `createdUTC`: `Date` ; `dueUTC`: ``null`` \| `Date` ; `evidenceData`: ``null`` \| `string` ; `ignoredVotes`: ``null`` \| `number` ; `issuedUTC`: ``null`` \| `Date` ; `negativeVotes`: ``null`` \| `number` ; `planUid`: `string` ; `positiveVotes`: ``null`` \| `number` ; `requiredPositives`: ``null`` \| `number` ; `requiredVotes`: ``null`` \| `number` ; `state`: `number` ; `uid`: `string` ; `updatedUTC`: `Date` ; `votedUTC`: ``null`` \| `Date`  }, `unknown`, `never`\> & {}\>

#### Defined in

[src/dbs/claim-helpers.ts:52](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/claim-helpers.ts#L52)
