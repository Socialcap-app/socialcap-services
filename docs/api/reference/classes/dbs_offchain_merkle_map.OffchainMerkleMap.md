[Socialcap API](../README.md) / [Modules](../modules.md) / [dbs/offchain-merkle-map](../modules/dbs_offchain_merkle_map.md) / OffchainMerkleMap

# Class: OffchainMerkleMap

[dbs/offchain-merkle-map](../modules/dbs_offchain_merkle_map.md).OffchainMerkleMap

OffchainMerkleMap
Describes a Merkle Map which will be stored in this server using a 
RDBMS and can be accesed using the API.

## Table of contents

### Constructors

- [constructor](dbs_offchain_merkle_map.OffchainMerkleMap.md#constructor)

### Properties

- [count](dbs_offchain_merkle_map.OffchainMerkleMap.md#count)
- [id](dbs_offchain_merkle_map.OffchainMerkleMap.md#id)
- [memmap](dbs_offchain_merkle_map.OffchainMerkleMap.md#memmap)
- [name](dbs_offchain_merkle_map.OffchainMerkleMap.md#name)
- [root](dbs_offchain_merkle_map.OffchainMerkleMap.md#root)

### Methods

- [get](dbs_offchain_merkle_map.OffchainMerkleMap.md#get)
- [getRoot](dbs_offchain_merkle_map.OffchainMerkleMap.md#getroot)
- [getWitness](dbs_offchain_merkle_map.OffchainMerkleMap.md#getwitness)
- [getWitnessByKey](dbs_offchain_merkle_map.OffchainMerkleMap.md#getwitnessbykey)
- [getWitnessByUid](dbs_offchain_merkle_map.OffchainMerkleMap.md#getwitnessbyuid)
- [set](dbs_offchain_merkle_map.OffchainMerkleMap.md#set)
- [setLeafByKey](dbs_offchain_merkle_map.OffchainMerkleMap.md#setleafbykey)
- [size](dbs_offchain_merkle_map.OffchainMerkleMap.md#size)

## Constructors

### constructor

• **new OffchainMerkleMap**(`id`, `name?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |
| `name?` | `string` |

#### Defined in

[src/dbs/offchain-merkle-map.ts:27](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/offchain-merkle-map.ts#L27)

## Properties

### count

• **count**: `number`

#### Defined in

[src/dbs/offchain-merkle-map.ts:25](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/offchain-merkle-map.ts#L25)

___

### id

• **id**: `number`

#### Defined in

[src/dbs/offchain-merkle-map.ts:21](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/offchain-merkle-map.ts#L21)

___

### memmap

• **memmap**: `MerkleMap`

#### Defined in

[src/dbs/offchain-merkle-map.ts:23](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/offchain-merkle-map.ts#L23)

___

### name

• **name**: `string`

#### Defined in

[src/dbs/offchain-merkle-map.ts:22](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/offchain-merkle-map.ts#L22)

___

### root

• **root**: `Field`

#### Defined in

[src/dbs/offchain-merkle-map.ts:24](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/offchain-merkle-map.ts#L24)

## Methods

### get

▸ **get**(`uid`): `Promise`\<`ResultOrError`\>

Get a given key+value pair from the map

#### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |

#### Returns

`Promise`\<`ResultOrError`\>

-

#### Defined in

[src/dbs/offchain-merkle-map.ts:41](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/offchain-merkle-map.ts#L41)

___

### getRoot

▸ **getRoot**(): `Field`

Get the root of the memoized Merkle map

#### Returns

`Field`

- the MerkleMap root

#### Defined in

[src/dbs/offchain-merkle-map.ts:184](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/offchain-merkle-map.ts#L184)

___

### getWitness

▸ **getWitness**(`uid`): ``null`` \| `MerkleMapWitness`

DO NOT USE, use getWitnessByUid or getWitnessByKey

#### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |

#### Returns

``null`` \| `MerkleMapWitness`

#### Defined in

[src/dbs/offchain-merkle-map.ts:194](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/offchain-merkle-map.ts#L194)

___

### getWitnessByKey

▸ **getWitnessByKey**(`key`): `MerkleMapWitness`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Field` |

#### Returns

`MerkleMapWitness`

#### Defined in

[src/dbs/offchain-merkle-map.ts:199](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/offchain-merkle-map.ts#L199)

___

### getWitnessByUid

▸ **getWitnessByUid**(`uid`): `MerkleMapWitness`

#### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |

#### Returns

`MerkleMapWitness`

#### Defined in

[src/dbs/offchain-merkle-map.ts:203](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/offchain-merkle-map.ts#L203)

___

### set

▸ **set**(`uid`, `hash`): `Promise`\<`ResultOrError`\>

Sets (inserts or updates) a given 'uid' key with its data

#### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |
| `hash` | `Field` |

#### Returns

`Promise`\<`ResultOrError`\>

MerkleMapUpdate in result or error

#### Defined in

[src/dbs/offchain-merkle-map.ts:67](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/offchain-merkle-map.ts#L67)

___

### setLeafByKey

▸ **setLeafByKey**(`key`, `hash`, `data?`): `Promise`\<[`OffchainMerkleMap`](dbs_offchain_merkle_map.OffchainMerkleMap.md)\>

Appends a Leaf at the end of the map

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Field` | Field used as key |
| `hash` | `Field` | the hash |
| `data?` | `any` | optional data object |

#### Returns

`Promise`\<[`OffchainMerkleMap`](dbs_offchain_merkle_map.OffchainMerkleMap.md)\>

#### Defined in

[src/dbs/offchain-merkle-map.ts:149](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/offchain-merkle-map.ts#L149)

___

### size

▸ **size**(): `number`

Get the the amount of leaf nodes.

#### Returns

`number`

#### Defined in

[src/dbs/offchain-merkle-map.ts:210](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/offchain-merkle-map.ts#L210)
