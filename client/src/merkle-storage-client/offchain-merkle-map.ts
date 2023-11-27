import { Field, MerkleMapWitness } from "snarkyjs";
import { ValueOrError } from "../core/responses.js";
import { CoreAPIClient } from "../core/api-client.js";
import { LeafInstance, MerkleMapUpdate } from "./imported-defs.js";

export { OffchainMerkleMap };

class OffchainMerkleMap {
  apiClient: CoreAPIClient;
  id: number;
  name: string;
  root: Field;
  count: number;

  constructor(
    apiClient: CoreAPIClient, 
    name: string, 
    id: number, 
    root: Field, 
    count: number
  ) {
    this.apiClient = apiClient;
    this.name = name;
    this.id = id;
    this.root = root;
    this.count = count;
  }

  async get(uid: string): Promise<ValueOrError<LeafInstance>> {
    const [rs, error] = await this.apiClient.query("get_merkle_map_leaf", { 
      mapId: this.id, 
      uid: uid 
    });
    if (error) return [null, error];
    
    console.log(rs);
    const leaf: LeafInstance = {
      key: Field(rs.key),
      hash: Field(rs.hash),
      data: rs.data
    };
    return [leaf, null];
  }

  async set(uid: string, data: any, hash?: Field): Promise<ValueOrError<MerkleMapUpdate>> {
    const [rs, error] = await this.apiClient.mutate("set_merkle_map_leaf", { 
      mapId: this.id, 
      uid: uid,
      data: data,
      hash: hash 
    });
    if (error) return [null, error];

    console.log(rs);
    const updated: MerkleMapUpdate = {
      txId: Field(0),
      mapId: this.id,
      beforeRoot: Field(rs.beforeRoot),
      afterRoot:  Field(rs.afterRoot),
      beforeLeaf: {
        key: Field(rs.beforeLeaf.key),
        hash: Field(rs.beforeLeaf.hash),
        data: rs.beforeLeaf.data
      },
      afterLeaf: {
        key: Field(rs.afterLeaf.key),
        hash: Field(rs.afterLeaf.hash),
        data: rs.afterLeaf.data
      }
    }
    return [updated, null];
  }

  async getWitness(uid: string): Promise<ValueOrError<MerkleMapWitness>> {
    const [rs, error] = await this.apiClient.query("get_merkle_map_witness", { 
      mapId: this.id,
      uid: uid 
    })
    if (error) return [null, error];

    const witness = new MerkleMapWitness(
      rs.isLefts, 
      rs.siblings
    );
    return [witness, null];
  }

  async getRoot(): Promise<ValueOrError<Field>> {
    // we need to fetch it again, just in case it changed !
    const [rs, error] = await this.apiClient.query("get_merkle_map", { 
      id: this.id 
    })
    if (error) return [null, error];
 
    this.root = Field(rs.root);
    this.count = rs.count;
    return [this.root, null];
  }

  size(): number {
    return this.count;
  }
}
