[Socialcap API](../README.md) / [Modules](../modules.md) / controllers/tasks-controller

# Module: controllers/tasks-controller

## Table of contents

### Functions

- [getMyTasks](controllers_tasks_controller.md#getmytasks)
- [getNullifier](controllers_tasks_controller.md#getnullifier)
- [getTask](controllers_tasks_controller.md#gettask)
- [submitTask](controllers_tasks_controller.md#submittask)
- [submitTasksBatch](controllers_tasks_controller.md#submittasksbatch)

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

[src/controllers/tasks-controller.ts:32](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/tasks-controller.ts#L32)

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

[src/controllers/tasks-controller.ts:196](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/tasks-controller.ts#L196)

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

[src/controllers/tasks-controller.ts:14](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/tasks-controller.ts#L14)

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

[src/controllers/tasks-controller.ts:83](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/tasks-controller.ts#L83)

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

[src/controllers/tasks-controller.ts:127](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/tasks-controller.ts#L127)
