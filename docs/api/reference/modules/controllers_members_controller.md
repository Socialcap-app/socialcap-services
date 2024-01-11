[Socialcap API](../README.md) / [Modules](../modules.md) / controllers/members-controller

# Module: controllers/members-controller

## Table of contents

### Functions

- [joinCommunity](controllers_members_controller.md#joincommunity)
- [promoteMember](controllers_members_controller.md#promotemember)
- [updateMemberRole](controllers_members_controller.md#updatememberrole)

## Functions

### joinCommunity

▸ **joinCommunity**(`params`): `Promise`\<`ResultOrError`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[src/controllers/members-controller.ts:7](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/members-controller.ts#L7)

___

### promoteMember

▸ **promoteMember**(`params`): `Promise`\<`ResultOrError`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[src/controllers/members-controller.ts:62](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/members-controller.ts#L62)

___

### updateMemberRole

▸ **updateMemberRole**(`params`): `Promise`\<`ResultOrError`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.communityUid` | `string` |
| `params.personUid` | `string` |
| `params.role` | `number` |
| `params.user` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[src/controllers/members-controller.ts:34](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/members-controller.ts#L34)
