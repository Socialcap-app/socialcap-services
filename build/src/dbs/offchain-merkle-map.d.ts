/**
 * OffchainMerkleMap
 * Describes a Merkle Map which will be stored in this server using a
 * RDBMS and can be accesed using the API.
 * @created - MAZito - 2023-06-06
 */
import { Field, MerkleMap, MerkleMapWitness } from "o1js";
import { ResultOrError } from "../responses.js";
export { OffchainMerkleMap };
/**
 * OffchainMerkleMap
 * Describes a Merkle Map which will be stored in this server using a
 * RDBMS and can be accesed using the API.
 */
declare class OffchainMerkleMap {
    id: number;
    name: string;
    memmap: MerkleMap;
    root: Field;
    count: number;
    constructor(id: number, name?: string);
    /**
     * Get a given key+value pair from the map
     * @param uid: string: the leaf key to get
     * @returns -
     */
    get(uid: string): Promise<ResultOrError>;
    /**
     * Sets (inserts or updates) a given 'uid' key with its data
     * @param uid: string - the leaf key to update or insert
     * @param hash: Field - optional hash of the leaf data, we will use this one if received
     * @param data?: any - the leaf data pack to insert/upload
     * @returns MerkleMapUpdate in result or error
     */
    set(uid: string, hash: Field): Promise<ResultOrError>;
    /**
     * Appends a Leaf at the end of the map
     * @param key Field used as key
     * @param hash the hash
     * @param data optional data object
     * @returns
     */
    setLeafByKey(key: Field, hash: Field, data?: any): Promise<OffchainMerkleMap>;
    /**
     * Get the root of the memoized Merkle map
     * @returns - the MerkleMap root
     */
    getRoot(): Field;
    /**
     * Get a Witness of the memoized Merkle map, using its uid
     * @param uid: string - the uid of the leaf to witness
     * @returns - the MerkleMapWitness or null
     */
    /** DO NOT USE, use getWitnessByUid or getWitnessByKey */
    getWitness(uid: string): MerkleMapWitness | null;
    getWitnessByKey(key: Field): MerkleMapWitness;
    getWitnessByUid(uid: string): MerkleMapWitness;
    /** Get the the amount of leaf nodes. */
    size(): number;
}
