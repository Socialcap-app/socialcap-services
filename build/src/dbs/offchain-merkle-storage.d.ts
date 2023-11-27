import { ResultOrError } from "../responses.js";
import { OffchainMerkleMap } from "./offchain-merkle-map.js";
export { OffchainMerkleStorage };
declare class OffchainMerkleStorage {
    static cache: Map<number, OffchainMerkleMap | null>;
    static started: boolean;
    /**
     * Gets and rebuilds an existent MerkleMap using the stored data leafs
     * @param id - the MerkleMap ID
     * @returns - OffchainMerkleMap or IsError
     */
    static getMerkleMap(id: number): Promise<ResultOrError>;
    /**
     * Creates a new MerkleMap and initializes it
     * @param name - the MerkleMap name
     * @returns - OffchainMerkleMap instance or error
     */
    static createNewMerkleMap(name: string): Promise<ResultOrError>;
    /**
     * Resets an existent MerkleMap and initializes it.
     * @param name - the MerkleMap name
     * @returns - OffchainMerkleMap instance or error
     */
    static resetMerkleMap(id: number): Promise<ResultOrError>;
    /**
     * Startup the Offchain storage by creating a cache for all Merkle maps.
     * The Merkle maps will not be loaded here, but when someone asks for it.
     */
    static startup(): typeof OffchainMerkleStorage | undefined;
}
