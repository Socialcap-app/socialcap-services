import { Field, PublicKey } from "o1js";
import { NullifierProxy } from "@socialcap/contracts";
import { OffchainMerkleMap } from "./offchain-merkle-map.js";
export { addElectorsToNullifier, getNullifierProxy, getNullifierOrRaise, updateNullifier, getNullifierLeafs };
/**
 * Add electors to Nullifier
 * @returns the modified OffchainMerkleMap
 */
declare function addElectorsToNullifier(map: OffchainMerkleMap, claimUid: string, electors: any[]): Promise<OffchainMerkleMap>;
declare function getNullifierProxy(electorPuk: PublicKey, claimUid: Field): Promise<NullifierProxy>;
declare function getNullifierLeafs(): Promise<any>;
declare function updateNullifier(key: Field, hash: Field): Promise<OffchainMerkleMap>;
declare function getNullifierOrRaise(): Promise<OffchainMerkleMap>;
