[Socialcap API](../README.md) / [Modules](../modules.md) / dbs/any-entity-helpers

# Module: dbs/any-entity-helpers

## Table of contents

### Functions

- [getEntity](dbs_any_entity_helpers.md#getentity)
- [updateEntity](dbs_any_entity_helpers.md#updateentity)

## Functions

### getEntity

▸ **getEntity**(`entityType`, `uid`, `options?`): `Promise`\<`any`\>

Retrieve an entity give its uid, but verify that the merkle map leaf and
the retrieved data are consistent and have not changed

#### Parameters

| Name | Type |
| :------ | :------ |
| `entityType` | `string` |
| `uid` | `string` |
| `options?` | `any` |

#### Returns

`Promise`\<`any`\>

the requested entity data

**`Throws`**

an error if something fails (invalid uid, invalid data, etc)

#### Defined in

[src/dbs/any-entity-helpers.ts:136](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/any-entity-helpers.ts#L136)

___

### updateEntity

▸ **updateEntity**(`entityType`, `uid`, `unsafeParams`): `Promise`\<\{ `proved`: `any` ; `transaction`: `any`  }\>

Updates or inserts any entity in the Merkle Map, the Indexer and Onchain.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `entityType` | `string` | the type name, that is "person", "community", etc |
| `uid` | `string` | the UID of the entity to update |
| `unsafeParams` | `any` | the set or received params |

#### Returns

`Promise`\<\{ `proved`: `any` ; `transaction`: `any`  }\>

the proved object and the finished transaction

**`Throws`**

error if something fails

#### Defined in

[src/dbs/any-entity-helpers.ts:83](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/any-entity-helpers.ts#L83)
