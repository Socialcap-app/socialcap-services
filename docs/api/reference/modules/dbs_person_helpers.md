[Socialcap API](../README.md) / [Modules](../modules.md) / dbs/person-helpers

# Module: dbs/person-helpers

## Table of contents

### Functions

- [getPersonOrRaise](dbs_person_helpers.md#getpersonorraise)
- [updatePersonOrRaise](dbs_person_helpers.md#updatepersonorraise)

## Functions

### getPersonOrRaise

▸ **getPersonOrRaise**(`uid`): `Promise`\<`Person`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |

#### Returns

`Promise`\<`Person`\>

#### Defined in

[src/dbs/person-helpers.ts:7](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/person-helpers.ts#L7)

___

### updatePersonOrRaise

▸ **updatePersonOrRaise**(`uid`, `unsafeParams`): `Promise`\<`Person`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |
| `unsafeParams` | `any` |

#### Returns

`Promise`\<`Person`\>

#### Defined in

[src/dbs/person-helpers.ts:18](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/person-helpers.ts#L18)
