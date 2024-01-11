[Socialcap API](../README.md) / [Exports](../modules.md) / tasks-controller

# Module: tasks-controller

## Table of contents

### Functions

- [getMyTasks](tasks_controller.md#getmytasks)
- [getNullifier](tasks_controller.md#getnullifier)
- [getTask](tasks_controller.md#gettask)
- [submitTask](tasks_controller.md#submittask)
- [submitTasksBatch](tasks_controller.md#submittasksbatch)

## Functions

### getMyTasks

▸ **getMyTasks**(`params`): `Promise`\<`ResultOrError`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[tasks-controller.ts:32](https://github.com/Identicon-Dao/socialcap-services/blob/21d5347d/src/controllers/tasks-controller.ts#L32)

___

### getNullifier

▸ **getNullifier**(`params`): `Promise`\<`ResultOrError`\>

Helpers

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[tasks-controller.ts:196](https://github.com/Identicon-Dao/socialcap-services/blob/21d5347d/src/controllers/tasks-controller.ts#L196)

___

### getTask

▸ **getTask**(`params`): `Promise`\<`ResultOrError`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[tasks-controller.ts:14](https://github.com/Identicon-Dao/socialcap-services/blob/21d5347d/src/controllers/tasks-controller.ts#L14)

___

### submitTask

▸ **submitTask**(`params`): `Promise`\<`ResultOrError`\>

Submits one particular Task

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.claimUid` | `string` |
| `params.extras` | `Object` |
| `params.extras.addToQueue` | `boolean` |
| `params.senderAccountId` | `string` |
| `params.uid` | `string` |
| `params.user` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[tasks-controller.ts:83](https://github.com/Identicon-Dao/socialcap-services/blob/21d5347d/src/controllers/tasks-controller.ts#L83)

___

### submitTasksBatch

▸ **submitTasksBatch**(`params`): `Promise`\<`ResultOrError`\>

Submits a batch of votes for many claims and tasks

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.extras?` | `Object` |
| `params.extras.addToQueue` | `boolean` |
| `params.senderAccountId` | `string` |
| `params.signedData` | `any` |
| `params.user` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[tasks-controller.ts:127](https://github.com/Identicon-Dao/socialcap-services/blob/21d5347d/src/controllers/tasks-controller.ts#L127)
