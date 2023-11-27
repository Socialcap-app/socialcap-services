import { Field } from "snarkyjs";
import { CoreAPIClient } from "../core/api-client.js";
import { ValueOrError } from "../core/responses.js";
import { OffchainMerkleMap } from "./offchain-merkle-map.js"

export { OffchainMerkleStorage };

class OffchainMerkleStorage {

  apiClient: CoreAPIClient;
  
  constructor() {
    this.apiClient = new CoreAPIClient();
  } 
    
  async connect(
    host: string, port: number, apiKey?: string
  ) {
    await this.apiClient.connect(host, port, apiKey);
    return this;
  }

  async createMerkleMap(
    name: string
  ): Promise<ValueOrError<OffchainMerkleMap>> {
    const [rs, error] =await this.apiClient.mutate("create_merkle_map", { 
      name: name 
    })
    if (error) return [null, error];

    const map = new OffchainMerkleMap(
      this.apiClient,
      rs.name, 
      rs.id, 
      Field(rs.root), 
      rs.count
    );
    return [map, null];
  }

  async getMerkleMap(
    name: string
  ): Promise<ValueOrError<OffchainMerkleMap>> {
    const [rs, error] =await this.apiClient.query("get_merkle_map", { 
      name: name 
    })
    if (error) return [null, error];

    const map = new OffchainMerkleMap(
      this.apiClient,
      rs.name, 
      rs.id, 
      Field(rs.root), 
      rs.count
    );
    return [map, null];
  }
}