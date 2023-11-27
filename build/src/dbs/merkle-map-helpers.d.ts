import { Field, MerkleMapWitness } from "o1js";
import { MerkleMapProxy, MerkleMapUpdate } from "@socialcap/contracts";
export declare function updateMerkleMapOrRaise(mapid: number, uid: string, value: Field): Promise<{
    map: MerkleMapProxy;
    witness: MerkleMapWitness;
    updated: MerkleMapUpdate;
}>;
