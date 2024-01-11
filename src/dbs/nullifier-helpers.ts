import { prisma } from "../global.js";
import { Field, MerkleMapWitness, PublicKey, UInt32 } from "o1js";
import { UID, NullifierProxy, MerkleMapUpdate } from "@socialcap/contracts";
import { OffchainMerkleStorage } from "./offchain-merkle-storage.js";
import { OffchainMerkleMap } from "./offchain-merkle-map.js";
import { NULLIFIER_MERKLE_MAP } from "./index.js"
import { raiseError } from "../responses.js";


interface NullifierJSON {
  toJSON: () => string,
  fromJSON: (json: string) => NullifierJSON, 
}

export async function saveJSON<T extends NullifierJSON>(uid: string, nullifier: T): Promise<T> {
  let json = nullifier.toJSON();
  return nullifier;
}

export async function getJSON<T extends NullifierJSON>(uid: string, nullifier: T): Promise<T> {
  let json = "{}";
  nullifier.fromJSON(json);
  return nullifier;
}















////////////////////////////////////////////////////////////////////////////////

////This code will be DEPRECATED ////

export {
  ////This code will be DEPRECATED ////
  addElectorsToNullifier,
  getNullifierProxy,
  getNullifierOrRaise,
  updateNullifier,
  getNullifierLeafs
  ////This code will be DEPRECATED ////
}

const ASSIGNED_VOTE = Field(1); 


/**
 * Add electors to Nullifier
 * @returns the modified OffchainMerkleMap
 */
async function addElectorsToNullifier(
  map: OffchainMerkleMap,
  claimUid: string, 
  electors: any[]
): Promise<OffchainMerkleMap> {
  const cluid = UID.toField(claimUid);

  for (let j=0; j < electors.length; j++) {
    console.log("\naddElectorsToNullifier")
    if (!electors[j].accountId)
      continue;

    let key = NullifierProxy.key(
      PublicKey.fromBase58(electors[j].accountId), 
      cluid
    );

    map = await map.setLeafByKey(key, Field(1)); // assigned
    console.log("...root=", map.getRoot().toString(), 
      "\n...key=", key.toString());

    let witness = map.getWitnessByKey(key) as MerkleMapWitness;
    const [witnessRoot, witnessKey] = witness.computeRootAndKey(
      Field(1) // WAS ASSIGNED BUT NOT VOTED YET
    );
    console.log("...witnessRoot=", witnessRoot.toString(), "\n...witnessKey=", witnessKey.toString());
    console.log("assert ? ", witnessKey.toString() === key.toString())

    electors[j].keyed = key;
  }

  electors.forEach((t) => console.log("elector ", t.email, t.accountId, t.keyed.toString()));
  return map;
}


async function getNullifierProxy(
  electorPuk: PublicKey,
  claimUid: Field
): Promise<NullifierProxy> {

  const map = await getNullifierOrRaise() as OffchainMerkleMap;

  const key = NullifierProxy.key(electorPuk, claimUid);
  const skey = key.toString();

  let witness = map.getWitnessByKey(key);
  if (!witness) raiseError.PreconditionFailed(
    `Could not get witness for MerkleMap=${map.id} key=${skey}`
  );

  console.log("getNullifierProxy root=", map.getRoot().toString(), "\nkey=", skey);
  const [witnessRoot, witnessKey] = witness.computeRootAndKey(
    ASSIGNED_VOTE /* WAS ASSIGNED BUT NOT VOTED YET */
  );
  console.log("witnessRoot=", witnessRoot.toString(), "\nwitnessKey=", witnessKey.toString());

  return {
    root: map.getRoot(),
    witness: witness as MerkleMapWitness
  };
}


async function getNullifierLeafs(): Promise<any> {

  const leafs = await prisma.merkleMapLeaf.findMany({
    select: { index: true, key: true, hash: true, },
    where: { mapId: NULLIFIER_MERKLE_MAP },
    orderBy: { index: 'asc' }
  })

  let arr: any = [];
  for (let j=0; j < leafs.length; j++) {
    arr.push({
      key: leafs[j].key,
      hash: leafs[j].hash
    })
  }

  return {
    count: leafs.length,
    leafs: arr
  }
}


async function updateNullifier(
  key: Field, 
  hash: Field
): 
Promise<OffchainMerkleMap> {
  let map = await getNullifierOrRaise();
  await map.setLeafByKey(key, hash);
  return map;    
}


async function getNullifierOrRaise(): Promise<OffchainMerkleMap> {
  let mapid = NULLIFIER_MERKLE_MAP;
  let rs = await OffchainMerkleStorage.getMerkleMap(mapid);
  if (rs.error) raiseError.DatabaseEngine(
    `Could not found merkle map id=${mapid}`
  )
  let map: OffchainMerkleMap = rs.data;
  return map;
}

////////////////////////////////////////////////////////////////////////////////
