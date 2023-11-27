import { Field, UInt32, CircuitString } from "o1js";
import { raiseError } from "../errors.js";
import { OffchainMerkleStorage } from "./offchain-merkle-storage.js";
export async function updateMerkleMapOrRaise(mapid, uid, value) {
    const rs1 = await OffchainMerkleStorage.getMerkleMap(mapid);
    if (rs1.error)
        raiseError.NotFound(`Could not get MerkleMap ${mapid}`);
    let map = rs1.data;
    const rs2 = await map.set(uid, value);
    if (rs2.error)
        raiseError.This(rs2.error);
    const update = rs2.data;
    const witness = map.getWitness(uid);
    const proxy = {
        id: UInt32.from(mapid),
        name: CircuitString.fromString(""),
        root: map.getRoot(),
        count: Field(map.size()),
    };
    return {
        map: proxy,
        witness: witness,
        updated: update
    };
}
//# sourceMappingURL=merkle-map-helpers.js.map