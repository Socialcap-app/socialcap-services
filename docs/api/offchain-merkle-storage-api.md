# Offchain API


## OffchainMerkleStorage

  ~~~
  connect(options: { 
    to: string, 
    db: string, 
    apiKey: string 
  }): this;
  ~~~

  createMerkleMap(name: string): Promise<OffchainMerkleMap>; 

  getMerkleMap(name: string): Promise<OffchainMerkleMap>; 


## OffchainMerkleMap

  id: UInt32;
  name: string; 

  get(key: Field): Promise<LeafInstance>;

  set(key: Field, data: any, hash?: string): Promise<MerkleMapUpdate>;

  getRoot(): Promise<Field>;

  getWitness(key: Field): Promise<MerkleMapWitness>;

  query(expression: QueryExpression): Promise<QueryResults>;


## Helpers

- uuidToField(uid: string)

- dataToHash()

