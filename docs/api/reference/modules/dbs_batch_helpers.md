[Socialcap API](../README.md) / [Modules](../modules.md) / dbs/batch-helpers

# Module: dbs/batch-helpers

## Table of contents

### Interfaces

- [SignedData](../interfaces/dbs_batch_helpers.SignedData.md)
- [SignedVote](../interfaces/dbs_batch_helpers.SignedVote.md)
- [VotesBatchMetadata](../interfaces/dbs_batch_helpers.VotesBatchMetadata.md)

### Functions

- [createVotesBatch](dbs_batch_helpers.md#createvotesbatch)
- [getBatchesByPlan](dbs_batch_helpers.md#getbatchesbyplan)

## Functions

### createVotesBatch

▸ **createVotesBatch**(`params`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.senderAccountId` | `string` |
| `params.signedData` | [`SignedData`](../interfaces/dbs_batch_helpers.SignedData.md) |

#### Returns

`Promise`\<`any`\>

#### Defined in

[src/dbs/batch-helpers.ts:28](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/batch-helpers.ts#L28)

___

### getBatchesByPlan

▸ **getBatchesByPlan**(`planUid`, `params`): `Promise`\<`any`[]\>

Returns the list of batches belonging to a given plan and filtered by state

#### Parameters

| Name | Type |
| :------ | :------ |
| `planUid` | `string` |
| `params` | `Object` |
| `params.states` | `number`[] |

#### Returns

`Promise`\<`any`[]\>

array of batches

#### Defined in

[src/dbs/batch-helpers.ts:73](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/batch-helpers.ts#L73)
