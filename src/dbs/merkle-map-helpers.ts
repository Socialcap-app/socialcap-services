import { Field, UInt32, CircuitString, MerkleMapWitness } from "o1js";
import { raiseError } from "../errors.js"
import { MerkleMapProxy, MerkleMapUpdate } from "@socialcap/collections" ;
import { OffchainMerkleMap } from "./offchain-merkle-map.js";
import { OffchainMerkleStorage } from "./offchain-merkle-storage.js";

export async function updateMerkleMapOrRaise(
  mapid: number, 
  uid: string, 
  value: Field
): Promise<{
  map: MerkleMapProxy, 
  witness: MerkleMapWitness,
  updated: MerkleMapUpdate
}> {
  const rs1 = await OffchainMerkleStorage.getMerkleMap(mapid);
  if (rs1.error) raiseError.NotFound(`Could not get MerkleMap ${mapid}`);
  let map = rs1.data as OffchainMerkleMap;

  const rs2 = await map.set(uid, value);
  if (rs2.error) raiseError.This(rs2.error);
  const update: MerkleMapUpdate = rs2.data as MerkleMapUpdate;

  const witness = map.getWitness(uid) as MerkleMapWitness;

  const proxy: MerkleMapProxy = {
    id: UInt32.from(mapid),
    name: CircuitString.fromString(""),
    root: map.getRoot(),
    count: Field(map.size()),
  }

  return {
    map: proxy,
    witness: witness,
    updated: update
  }
}