# Offchain Merkle Storage client

Classes and methods used to access a remote MerkleMap storage server.

**Changelog:**

- @MAZito - 2023-06-14 - created API doc

## Definitions

This are the type definitions used in the methods, available in `clients/merkle-storage-client/index.ts`.

#### ValueOrError<T>

Is a normalized return type for client methods

~~~typescript
type ValueOrError<T> = [T | null, IsError | null]; // [value, error]
~~~

They will always 
return an array:

- when call is successfull, it will return `[value,null]`

- if it fails, it will return `[null,error]`

As an example applicable to all other methods, let's get a MerkleMap from the storage:

~~~typescript
let [map, error] = await offchain.getMerkleMap("personas");
if (error !== null) 
  return ; // Something failed !

// everyting is Ok
let [leaf, error] = await map!.get(uid);
// ...  
~~~

#### LeafInstance

Describes a MerkleMap leaf, which contains both the `data` stored in the leaf and the `hash` of this data. The 'hash' value is usually calculated by the _map.set(key,data)_ method when we update the MerkleMap.

~~~typescript
type LeafInstance = {
  key: Field, // the key of this Leaf (may be redundant but useful)
  hash: Field, // the hashed(data) value as 
  data: any // the leaf real data content, as a JSON object 
}
~~~

#### MerkleMapUpdate

Describes the last "provable?" change applied to a given OffchainMerkleMap after using the _map.set(key,data)_ method on it. It can be used to update the state of commitment (a Merkle root) in a MINA account. Contains both the previous map state and the current updated state.

~~~typescript
type MerkleMapUpdate = {
  // transaction id of the transaction which produced the change
  txId: Field, 

  // the map index (may be redundant but useful)
  mapId: number, 

  // root and leaf value BEFORE we applied the update
  beforeRoot: Field, 
  beforeLeaf: LeafInstance,
  
  // root and leaf value AFTER we applied this update
  afterRoot: Field, 
  afterLeaf: LeafInstance 
}
~~~


## class OffchainMerkleStorage 

The Offchain server proxy, used to connect to a remote server instance.

### constructor()

It just constructs an empty OffchainMerkleStorage instance. 

### async connect(host,port,apiKey?): OffchainMerkleStorage

Connects to a remote storage server.

**Params:**
- host: string - the host, example: "localhost" or "api.socialcap.app".
- port: number - the port number (default is "3081").
- apiKey?: string - (optional) an authorized API key, not required for now.

**Returns:**
- A connected OfchainMerkleStorage instance, which can be used to create or get stored MerkleMaps.

###  async createMerkleMap(name): OffchainMerkleMap

Creates a new MerkleMap in the storage server, and returns an OffchainMerkleMap instance of the created map.

The `name` must be unique and must match the indexer table name where the actual data will be stored in the server.

**Params:**
- name: string - the name of the new MerkleMap.

**Returns:** 
- A new instance as array `[instance: OffcghainMerkleMap,null]`, if error then `[null,error]`

### async getMerkleMap(uid): OffchainMerkleMap

Get an existent MerkleMap from the storage server, and returns an OffchainMerkleMap instance of the stored map.

The `name` must the name of an already created map.

**Params:**

- name: string - the name of the new MerkleMap.

**Returns:** 

- An instance as array `[instance: OffchainMerkleMap,null]`, if error then `[null,error]`


## class OffchainMerkleMap

A proxy object to the real MerkleMap stored in the remote storage server.

**IMPORTANT**: All method calls require a remote call to the storage server, so take into account that there can be all types of network errors involved.

###  constructor(apiClient,name,id,root,count): OffchainMerkleMap

Build a new OffchainMerkleMap using the given params. 

This constructor is really meant to be used by the **OfchainMerkleStorage** class when creating (createMerkleMap) or retrieving (getMerkleMap) a stored MerkleMap.

The `name` must match the indexer table name where the actual data is stored in the server.

**Params:**
- `apiClient: CoreAPIClient`- the API core client created when connecting to the storage.
- `name: string` - the name of the stored MerkleMap, must be unique.
- `id: number` - the `id` of the stored MerkleMap.
- `root: Field` - the root of the stored MerkleMap
- `count: number` - the number of leafs of the stored MerkleMap.

**Returns:**

- A new OffchaniMerkleMap object connected to an OfcchainMerkleStorage.

###  async get(uid): LeafInstance

Get this MerkleMap's leaf (as a LeafInstance) referenced by the given `uid` .

**Params:**

- `uid: string` - the UUID key of the leaf.

**Returns:**

- The current leaf as array `[leaf: LeafInstance,null]`, if error then `[null,error]`.

### async set(uid,data,hash?): MerkleMapUpdate

Insert or update this MerkleMap leaf referenced by the given `uid` key.

If the `uid` key already exists it will update its leaf content, if not if will inserted a new leaf with the given key and data.

The received `data` object must be JSON serializable, otherwise the server call will fail.

If a `hash` is given it will store the given hash, otherwise the server will calculate a has with the given data.

It returns an **MerkleMapUpdate** struct containing the previous value of the leaf and map root, and the new value of the updated/inserted leaf and the new map root. It also contains a Transaction id created by the storage server which can prove that it was effectively updated/inserted.

**Params:**

- uid: string - the UUID key of the leaf.
- data: any - an object  containing the new leaf data.
- hash?: Field - (optional) calculated hash of the data. 

**Returns:**

- An update instance as array `[update: MerkleMapUpdate,null]`, if error then `[null,error]`

### async getWitness(uid): MerkleMapWitness

Get this MerkleMap's witness (as MerkleMapWitness) of the leaf referenced by the given `uid`-

**Params:**

- uid: string - the UUID key of the leaf.

**Returns:**

- The current witness as array `[witness: MerkleMapWiness,null]`, if error then `[null,error]`.

### async getRoot(): Field

Returns
- The current root as array `[root: Field,null]`, if error then `[null,error]`.

### size(): bigint

Get the current number on non zero leafs in this MerkleMap.

**Returns:**  

- Number of non zero leafs or `0`.
