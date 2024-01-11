[Socialcap API](../README.md) / [Modules](../modules.md) / dbs/nullifier-helpers

# Module: dbs/nullifier-helpers

## Table of contents

### Functions

- [addElectorsToNullifier](dbs_nullifier_helpers.md#addelectorstonullifier)
- [getJSON](dbs_nullifier_helpers.md#getjson)
- [getNullifierLeafs](dbs_nullifier_helpers.md#getnullifierleafs)
- [getNullifierOrRaise](dbs_nullifier_helpers.md#getnullifierorraise)
- [getNullifierProxy](dbs_nullifier_helpers.md#getnullifierproxy)
- [saveJSON](dbs_nullifier_helpers.md#savejson)
- [updateNullifier](dbs_nullifier_helpers.md#updatenullifier)

## Functions

### addElectorsToNullifier

▸ **addElectorsToNullifier**(`map`, `claimUid`, `electors`): `Promise`\<[`OffchainMerkleMap`](../classes/dbs_offchain_merkle_map.OffchainMerkleMap.md)\>

Add electors to Nullifier

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | [`OffchainMerkleMap`](../classes/dbs_offchain_merkle_map.OffchainMerkleMap.md) |
| `claimUid` | `string` |
| `electors` | `any`[] |

#### Returns

`Promise`\<[`OffchainMerkleMap`](../classes/dbs_offchain_merkle_map.OffchainMerkleMap.md)\>

the modified OffchainMerkleMap

#### Defined in

[src/dbs/nullifier-helpers.ts:61](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/nullifier-helpers.ts#L61)

___

### getJSON

▸ **getJSON**\<`T`\>(`uid`, `nullifier`): `Promise`\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `NullifierJSON` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |
| `nullifier` | `T` |

#### Returns

`Promise`\<`T`\>

#### Defined in

[src/dbs/nullifier-helpers.ts:20](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/nullifier-helpers.ts#L20)

___

### getNullifierLeafs

▸ **getNullifierLeafs**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Defined in

[src/dbs/nullifier-helpers.ts:125](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/nullifier-helpers.ts#L125)

___

### getNullifierOrRaise

▸ **getNullifierOrRaise**(): `Promise`\<[`OffchainMerkleMap`](../classes/dbs_offchain_merkle_map.OffchainMerkleMap.md)\>

#### Returns

`Promise`\<[`OffchainMerkleMap`](../classes/dbs_offchain_merkle_map.OffchainMerkleMap.md)\>

#### Defined in

[src/dbs/nullifier-helpers.ts:159](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/nullifier-helpers.ts#L159)

___

### getNullifierProxy

▸ **getNullifierProxy**(`electorPuk`, `claimUid`): `Promise`\<`NullifierProxy`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `electorPuk` | `PublicKey` |
| `claimUid` | `Field` |

#### Returns

`Promise`\<`NullifierProxy`\>

#### Defined in

[src/dbs/nullifier-helpers.ts:97](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/nullifier-helpers.ts#L97)

___

### saveJSON

▸ **saveJSON**\<`T`\>(`uid`, `nullifier`): `Promise`\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `NullifierJSON` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |
| `nullifier` | `T` |

#### Returns

`Promise`\<`T`\>

#### Defined in

[src/dbs/nullifier-helpers.ts:15](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/nullifier-helpers.ts#L15)

___

### updateNullifier

▸ **updateNullifier**(`key`, `hash`): `Promise`\<[`OffchainMerkleMap`](../classes/dbs_offchain_merkle_map.OffchainMerkleMap.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Field` |
| `hash` | `Field` |

#### Returns

`Promise`\<[`OffchainMerkleMap`](../classes/dbs_offchain_merkle_map.OffchainMerkleMap.md)\>

#### Defined in

[src/dbs/nullifier-helpers.ts:148](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/nullifier-helpers.ts#L148)
