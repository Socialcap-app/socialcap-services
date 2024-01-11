[Socialcap API](../README.md) / [Modules](../modules.md) / [dbs/offchain-merkle-storage](../modules/dbs_offchain_merkle_storage.md) / OffchainMerkleStorage

# Class: OffchainMerkleStorage

[dbs/offchain-merkle-storage](../modules/dbs_offchain_merkle_storage.md).OffchainMerkleStorage

## Table of contents

### Constructors

- [constructor](dbs_offchain_merkle_storage.OffchainMerkleStorage.md#constructor)

### Properties

- [cache](dbs_offchain_merkle_storage.OffchainMerkleStorage.md#cache)
- [started](dbs_offchain_merkle_storage.OffchainMerkleStorage.md#started)

### Methods

- [createNewMerkleMap](dbs_offchain_merkle_storage.OffchainMerkleStorage.md#createnewmerklemap)
- [getMerkleMap](dbs_offchain_merkle_storage.OffchainMerkleStorage.md#getmerklemap)
- [resetMerkleMap](dbs_offchain_merkle_storage.OffchainMerkleStorage.md#resetmerklemap)
- [startup](dbs_offchain_merkle_storage.OffchainMerkleStorage.md#startup)

## Constructors

### constructor

• **new OffchainMerkleStorage**()

## Properties

### cache

▪ `Static` **cache**: `Map`\<`number`, ``null`` \| [`OffchainMerkleMap`](dbs_offchain_merkle_map.OffchainMerkleMap.md)\>

#### Defined in

[src/dbs/offchain-merkle-storage.ts:17](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/offchain-merkle-storage.ts#L17)

___

### started

▪ `Static` **started**: `boolean` = `false`

#### Defined in

[src/dbs/offchain-merkle-storage.ts:20](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/offchain-merkle-storage.ts#L20)

## Methods

### createNewMerkleMap

▸ `Static` **createNewMerkleMap**(`name`): `Promise`\<`ResultOrError`\>

Creates a new MerkleMap and initializes it

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | the MerkleMap name |

#### Returns

`Promise`\<`ResultOrError`\>

- OffchainMerkleMap instance or error

#### Defined in

[src/dbs/offchain-merkle-storage.ts:70](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/offchain-merkle-storage.ts#L70)

___

### getMerkleMap

▸ `Static` **getMerkleMap**(`id`): `Promise`\<`ResultOrError`\>

Gets and rebuilds an existent MerkleMap using the stored data leafs

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `number` | the MerkleMap ID |

#### Returns

`Promise`\<`ResultOrError`\>

- OffchainMerkleMap or IsError

#### Defined in

[src/dbs/offchain-merkle-storage.ts:27](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/offchain-merkle-storage.ts#L27)

___

### resetMerkleMap

▸ `Static` **resetMerkleMap**(`id`): `Promise`\<`ResultOrError`\>

Resets an existent MerkleMap and initializes it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`Promise`\<`ResultOrError`\>

- OffchainMerkleMap instance or error

#### Defined in

[src/dbs/offchain-merkle-storage.ts:97](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/offchain-merkle-storage.ts#L97)

___

### startup

▸ `Static` **startup**(): `undefined` \| typeof [`OffchainMerkleStorage`](dbs_offchain_merkle_storage.OffchainMerkleStorage.md)

Startup the Offchain storage by creating a cache for all Merkle maps. 
The Merkle maps will not be loaded here, but when someone asks for it.

#### Returns

`undefined` \| typeof [`OffchainMerkleStorage`](dbs_offchain_merkle_storage.OffchainMerkleStorage.md)

#### Defined in

[src/dbs/offchain-merkle-storage.ts:131](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/offchain-merkle-storage.ts#L131)
