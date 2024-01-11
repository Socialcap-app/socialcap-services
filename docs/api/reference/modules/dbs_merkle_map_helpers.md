[Socialcap API](../README.md) / [Modules](../modules.md) / dbs/merkle-map-helpers

# Module: dbs/merkle-map-helpers

## Table of contents

### Functions

- [updateMerkleMapOrRaise](dbs_merkle_map_helpers.md#updatemerklemaporraise)

## Functions

### updateMerkleMapOrRaise

▸ **updateMerkleMapOrRaise**(`mapid`, `uid`, `value`): `Promise`\<\{ `map`: `MerkleMapProxy` ; `updated`: `MerkleMapUpdate` ; `witness`: `MerkleMapWitness`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `mapid` | `number` |
| `uid` | `string` |
| `value` | `Field` |

#### Returns

`Promise`\<\{ `map`: `MerkleMapProxy` ; `updated`: `MerkleMapUpdate` ; `witness`: `MerkleMapWitness`  }\>

#### Defined in

[src/dbs/merkle-map-helpers.ts:7](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/merkle-map-helpers.ts#L7)
