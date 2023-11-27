/**
 * OffchainMerkleMap
 * Describes a Merkle Map which will be stored in this server using a
 * RDBMS and can be accesed using the API.
 * @created - MAZito - 2023-06-06
 */
import { Field, MerkleMap, UInt32 } from "o1js";
import { prisma } from "../global.js";
import { hasError, hasResult } from "../responses.js";
import { UID } from "@socialcap/contracts";
export { OffchainMerkleMap };
/**
 * OffchainMerkleMap
 * Describes a Merkle Map which will be stored in this server using a
 * RDBMS and can be accesed using the API.
 */
class OffchainMerkleMap {
    constructor(id, name) {
        this.id = id;
        this.name = name || "mm" + id.toString();
        this.memmap = new MerkleMap();
        this.memmap.set(Field(0), Field(0)); // initalize with (key=0,value=0)
        this.root = this.memmap.getRoot();
        this.count = 0;
    }
    /**
     * Get a given key+value pair from the map
     * @param uid: string: the leaf key to get
     * @returns -
     */
    async get(uid) {
        if (!uid)
            return hasError.BadRequest(`Missing param 'uid'`);
        const storedLeaf = await prisma.merkleMapLeaf.findUnique({
            where: { uid: uid }
        });
        if (!storedLeaf)
            return hasError.NotFound(`Not Found leaf with uid=${uid}`);
        let instance = {
            key: Field(storedLeaf.key),
            hash: Field(storedLeaf.hash)
        };
        return hasResult(instance);
    }
    /**
     * Sets (inserts or updates) a given 'uid' key with its data
     * @param uid: string - the leaf key to update or insert
     * @param hash: Field - optional hash of the leaf data, we will use this one if received
     * @param data?: any - the leaf data pack to insert/upload
     * @returns MerkleMapUpdate in result or error
     */
    async set(uid, hash) {
        if (!uid)
            return hasError.BadRequest(`Missing param 'uid'`);
        const currentRoot = this.memmap.getRoot();
        // check if the key already exists, or Null
        const storedLeaf = await prisma.merkleMapLeaf.findUnique({
            where: { uid: uid }
        });
        // the received data has already been hashed
        const key = UID.toField(uid);
        const hashed = hash;
        const index = storedLeaf ? storedLeaf.index : this.count;
        const isNewLeaf = !storedLeaf;
        // update the current Merkle Map
        try {
            this.memmap.set(key, hashed);
            this.count = storedLeaf ? this.count : this.count + 1;
        }
        catch (err) {
            return hasError.InternalServer(`Could not set MerkleMapLeaf with uid='${uid}' err=` + err.toString());
        }
        // update or insert the leaf
        const updatedLeaf = await prisma.merkleMapLeaf.upsert({
            where: { uid: uid },
            update: {
                hash: hashed.toString()
            },
            create: {
                uid: uid, mapId: this.id, index: index,
                key: key.toString(),
                hash: hashed.toString()
            },
        });
        // check if leaf upsert operation succeeded, on failure we must revert 
        // the Map operation because the key,hash was already updated in the Map 
        if (!updatedLeaf) {
            // rollback the key,value 
            this.memmap.set(key, storedLeaf ? Field(storedLeaf.hash) : Field(0));
            return hasError.DatabaseEngine(`Could not set MerkleMapLeaf with uid='${uid}'`);
        }
        // prepare the Update instance we will return
        const merkleUpdate = {
            mapId: UInt32.from(this.id),
            txId: Field(0),
            beforeRoot: currentRoot,
            beforeLeaf: {
                key: Field(storedLeaf?.key || "0"),
                hash: Field(storedLeaf?.hash || "0"),
                // data: JSON.parse(storedLeaf?.data || "{}")
            },
            afterRoot: this.memmap.getRoot(),
            afterLeaf: {
                key: key,
                hash: hashed,
                // data: JSON.parse(stringified)
            }
        };
        return hasResult(merkleUpdate);
    }
    /**
     * Appends a Leaf at the end of the map
     * @param key Field used as key
     * @param hash the hash
     * @param data optional data object
     * @returns
     */
    async setLeafByKey(key, hash, data) {
        const count = await prisma.merkleMapLeaf.count({
            where: { mapId: this.id }
        });
        this.memmap.set(key, hash);
        // insert a leaf
        let uid = key.toString();
        const updatedLeaf = await prisma.merkleMapLeaf.upsert({
            where: { uid: uid },
            update: {
                hash: hash.toString()
            },
            create: {
                uid: uid,
                mapId: this.id,
                index: count + 1,
                key: key.toString(),
                hash: hash.toString()
            },
        });
        return this;
    }
    /**
     * Get the root of the memoized Merkle map
     * @returns - the MerkleMap root
     */
    getRoot() {
        return this.memmap.getRoot() || null;
    }
    /**
     * Get a Witness of the memoized Merkle map, using its uid
     * @param uid: string - the uid of the leaf to witness
     * @returns - the MerkleMapWitness or null
     */
    /** DO NOT USE, use getWitnessByUid or getWitnessByKey */
    getWitness(uid) {
        const key = UID.toField(uid);
        return this.memmap.getWitness(key) || null;
    }
    getWitnessByKey(key) {
        return this.memmap.getWitness(key);
    }
    getWitnessByUid(uid) {
        const key = UID.toField(uid);
        return this.memmap.getWitness(key);
    }
    /** Get the the amount of leaf nodes. */
    size() {
        return this.count;
    }
}
//# sourceMappingURL=offchain-merkle-map.js.map