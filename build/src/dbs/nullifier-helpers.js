import { prisma } from "../global.js";
import { Field, PublicKey } from "o1js";
import { UID, NullifierProxy } from "@socialcap/contracts";
import { OffchainMerkleStorage } from "./offchain-merkle-storage.js";
import { NULLIFIER_MERKLE_MAP } from "./index.js";
import { raiseError } from "../responses.js";
export { addElectorsToNullifier, getNullifierProxy, getNullifierOrRaise, updateNullifier, getNullifierLeafs };
const ASSIGNED_VOTE = Field(1);
/**
 * Add electors to Nullifier
 * @returns the modified OffchainMerkleMap
 */
async function addElectorsToNullifier(map, claimUid, electors) {
    const cluid = UID.toField(claimUid);
    for (let j = 0; j < electors.length; j++) {
        console.log("\naddElectorsToNullifier");
        if (!electors[j].accountId)
            continue;
        let key = NullifierProxy.key(PublicKey.fromBase58(electors[j].accountId), cluid);
        map = await map.setLeafByKey(key, Field(1)); // assigned
        console.log("...root=", map.getRoot().toString(), "\n...key=", key.toString());
        let witness = map.getWitnessByKey(key);
        const [witnessRoot, witnessKey] = witness.computeRootAndKey(Field(1) // WAS ASSIGNED BUT NOT VOTED YET
        );
        console.log("...witnessRoot=", witnessRoot.toString(), "\n...witnessKey=", witnessKey.toString());
        console.log("assert ? ", witnessKey.toString() === key.toString());
        electors[j].keyed = key;
    }
    electors.forEach((t) => console.log("elector ", t.email, t.accountId, t.keyed.toString()));
    return map;
}
async function getNullifierProxy(electorPuk, claimUid) {
    const map = await getNullifierOrRaise();
    const key = NullifierProxy.key(electorPuk, claimUid);
    const skey = key.toString();
    let witness = map.getWitnessByKey(key);
    if (!witness)
        raiseError.PreconditionFailed(`Could not get witness for MerkleMap=${map.id} key=${skey}`);
    console.log("getNullifierProxy root=", map.getRoot().toString(), "\nkey=", skey);
    const [witnessRoot, witnessKey] = witness.computeRootAndKey(ASSIGNED_VOTE /* WAS ASSIGNED BUT NOT VOTED YET */);
    console.log("witnessRoot=", witnessRoot.toString(), "\nwitnessKey=", witnessKey.toString());
    return {
        root: map.getRoot(),
        witness: witness
    };
}
async function getNullifierLeafs() {
    const leafs = await prisma.merkleMapLeaf.findMany({
        select: { index: true, key: true, hash: true, },
        where: { mapId: NULLIFIER_MERKLE_MAP },
        orderBy: { index: 'asc' }
    });
    let arr = [];
    for (let j = 0; j < leafs.length; j++) {
        arr.push({
            key: leafs[j].key,
            hash: leafs[j].hash
        });
    }
    return {
        count: leafs.length,
        leafs: arr
    };
}
async function updateNullifier(key, hash) {
    let map = await getNullifierOrRaise();
    await map.setLeafByKey(key, hash);
    return map;
}
async function getNullifierOrRaise() {
    let mapid = NULLIFIER_MERKLE_MAP;
    let rs = await OffchainMerkleStorage.getMerkleMap(mapid);
    if (rs.error)
        raiseError.DatabaseEngine(`Could not found merkle map id=${mapid}`);
    let map = rs.data;
    return map;
}
//# sourceMappingURL=nullifier-helpers.js.map