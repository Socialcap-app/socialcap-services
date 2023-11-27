export { updateEntity, getEntity };
/**
 * Updates or inserts any entity in the Merkle Map, the Indexer and Onchain.
 *
 * @param entityType the type name, that is "person", "community", etc
 * @param uid the UID of the entity to update
 * @param unsafeParams the set or received params
 * @returns the proved object and the finished transaction
 * @throws error if something fails
 */
declare function updateEntity(entityType: string, uid: string, unsafeParams: any): Promise<{
    proved: any;
    transaction: any;
}>;
/**
 * Retrieve an entity give its uid, but verify that the merkle map leaf and
 * the retrieved data are consistent and have not changed
 * @param entityType
 * @param uid
 * @param options
 * @returns the requested entity data
 * @throws an error if something fails (invalid uid, invalid data, etc)
 */
declare function getEntity(entityType: string, uid: string, options?: any): Promise<any>;
