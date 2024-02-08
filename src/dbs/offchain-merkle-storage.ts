/**
 * OffchainMerkleStorage
 * Manages a cached offchain storage for Merkle Maps
 * where map header and leafs are stored in a RDB
 * @created - MAZito - 2023-06-06
 */
import { Field } from "o1js";
import { logger, prisma } from "../global.js";
import { ResultOrError, hasError, hasResult } from "../responses.js";
import { OffchainMerkleMap } from "./offchain-merkle-map.js";

export { OffchainMerkleStorage };

class OffchainMerkleStorage {

  // All MerkleMaps are memoized while server is running
  static cache: Map<number, OffchainMerkleMap | null> = new Map();

  // The startup status
  static started = false;
 
  /**
   * Gets and rebuilds an existent MerkleMap using the stored data leafs
   * @param id - the MerkleMap ID 
   * @returns - OffchainMerkleMap or IsError 
   */
  static async getMerkleMap(
    id: number
  ): Promise<ResultOrError> {
    if (!OffchainMerkleStorage.started)
      return hasError.DatabaseEngine(`OffchainMerkleStorage not started`);

    // first chech if we already have it in the cache
    let cached = OffchainMerkleStorage.cache.get(id); 
    if (cached) 
      return hasResult(cached);

    // not in cache, get from Db
    const map = await prisma.merkleMap.findUnique({
      where: { id: id }
    }); 
    if (!map) 
      return hasError.NotFound(`Not Found MerkleMap with id=${id}`);

    // rebuild this instance using the leafs, MAY be slow ? 
    const instance = new OffchainMerkleMap(id, map?.name);
    const leafs = await prisma.merkleMapLeaf.findMany({
      select: { index: true, key: true, hash: true, },
      where: { mapId: map?.id },
      orderBy: { index: 'asc' }
    })
    for (let j=0; j < leafs.length; j++) {
      const key = Field(leafs[j].key);
      const hashed = Field(leafs[j].hash);
      instance.memmap.set(key, hashed)
    }
    instance.count = leafs.length;

    // MUST add it to the cache 
    OffchainMerkleStorage.cache.set(id, instance); 

    return hasResult(instance);
  }

  /**
   * Creates a new MerkleMap and initializes it
   * @param name - the MerkleMap name
   * @returns - OffchainMerkleMap instance or error 
   */
  static async createNewMerkleMap(
    name: string
  ): Promise<ResultOrError> {
    if (!OffchainMerkleStorage.started)
      return hasError.DatabaseEngine(`OffchainMerkleStorage not started`);

    // add to database ...
    const map = await prisma.merkleMap.create({
      data: { id: 10, name: name, root: 0, size: 0, height: 256 },
    })
    if (! map) 
      return hasError.DatabaseEngine(`Could not create new Merkle Map with name='${name}'`)
    
    const instance = new OffchainMerkleMap(map.id, map.name);   
    
    // MUST add it to the cache 
    OffchainMerkleStorage.cache.set(map.id, instance);
    
    logger.info(`Created merkleMap '${name}' with id=${map.id}`);  
    return hasResult(instance);
  }

  /**
   * Resets an existent MerkleMap and initializes it.
   * @param name - the MerkleMap name
   * @returns - OffchainMerkleMap instance or error 
   */
  static async resetMerkleMap(
    id: number
  ): Promise<ResultOrError> {
    if (!OffchainMerkleStorage.started)
      return hasError.DatabaseEngine(`OffchainMerkleStorage not started`);

    // not in cache, get from Db
    const map = await prisma.merkleMap.findUnique({
      where: { id: id }
    }); 
    if (!map) 
      return hasError.NotFound(`Not Found MerkleMap with id=${id}`);

    // delete all leafs from it 
    const leafs = await prisma.merkleMapLeaf.findMany({ 
      where: { mapId: map.id } 
    });
    for (let j=0; j < (leafs || []).length; j++) {
      await prisma.merkleMapLeaf.delete({ where: { uid: leafs[j].uid } });
    }

    const instance = new OffchainMerkleMap(map.id, map.name);   
    
    // MUST add it to the cache 
    OffchainMerkleStorage.cache.set(map.id, instance);
    
    logger.info(`Reseted merkleMap with id=${map.id}`);  
    return hasResult(instance);
  }

  /**
   * Startup the Offchain storage by creating a cache for all Merkle maps. 
   * The Merkle maps will not be loaded here, but when someone asks for it.
   */
  static startup() {
    if (OffchainMerkleStorage.started) return ;

    logger.info("OffchainMerkleStorage starting ...");
    setTimeout(async () => {
      const maps = await prisma.merkleMap.findMany(
        { orderBy: { id: 'asc' }}
      );
      
      // reset the cache for all of them
      for (let j=0; j < maps.length; j++) {
        OffchainMerkleStorage.cache.set(maps[j].id, null);
      }
  
      OffchainMerkleStorage.started = true;
      logger.info("OffchainMerkleStorage started");
    }, 100);

    return OffchainMerkleStorage;
  }
}
