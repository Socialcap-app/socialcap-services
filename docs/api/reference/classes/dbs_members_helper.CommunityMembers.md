[Socialcap API](../README.md) / [Modules](../modules.md) / [dbs/members-helper](../modules/dbs_members_helper.md) / CommunityMembers

# Class: CommunityMembers

[dbs/members-helper](../modules/dbs_members_helper.md).CommunityMembers

## Table of contents

### Constructors

- [constructor](dbs_members_helper.CommunityMembers.md#constructor)

### Properties

- [index](dbs_members_helper.CommunityMembers.md#index)
- [list](dbs_members_helper.CommunityMembers.md#list)

### Methods

- [build](dbs_members_helper.CommunityMembers.md#build)
- [findByUid](dbs_members_helper.CommunityMembers.md#findbyuid)
- [getAll](dbs_members_helper.CommunityMembers.md#getall)
- [getValidators](dbs_members_helper.CommunityMembers.md#getvalidators)

## Constructors

### constructor

• **new CommunityMembers**()

#### Defined in

[src/dbs/members-helper.ts:7](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/members-helper.ts#L7)

## Properties

### index

• **index**: `any`

#### Defined in

[src/dbs/members-helper.ts:4](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/members-helper.ts#L4)

___

### list

• **list**: `any`[] = `[]`

#### Defined in

[src/dbs/members-helper.ts:5](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/members-helper.ts#L5)

## Methods

### build

▸ **build**(`communityUid`): `Promise`\<[`CommunityMembers`](dbs_members_helper.CommunityMembers.md)\>

Get all members of a community with Peron and Roles data

#### Parameters

| Name | Type |
| :------ | :------ |
| `communityUid` | `string` |

#### Returns

`Promise`\<[`CommunityMembers`](dbs_members_helper.CommunityMembers.md)\>

#### Defined in

[src/dbs/members-helper.ts:17](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/members-helper.ts#L17)

___

### findByUid

▸ **findByUid**(`uid`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |

#### Returns

`any`

#### Defined in

[src/dbs/members-helper.ts:48](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/members-helper.ts#L48)

___

### getAll

▸ **getAll**(): `any`[]

#### Returns

`any`[]

#### Defined in

[src/dbs/members-helper.ts:52](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/members-helper.ts#L52)

___

### getValidators

▸ **getValidators**(): `any`[]

#### Returns

`any`[]

#### Defined in

[src/dbs/members-helper.ts:56](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/members-helper.ts#L56)
