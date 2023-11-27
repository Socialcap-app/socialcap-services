
# Offchain Merkle Storage


### How to use 

Here is an example of how to use the OffchainMerkleStorage server.

~~~typescript
import {  
  OffchainMerkleMap,
  OffchainMerkleStorage,
  LeafInstance,
  MerkleMapUpdate
} from "../src/merkle-storage-client/index.js";

  let offchain: OffchainMerkleStorage;  
 
  offchain = new OffchainMerkleStorage();
  offchain = await offchain.connect("localhost", 3081);

  const [rs, err1] = await offchain.getMerkleMap('Maruco_2');
  if (err1) console.log(err1);
  let map = rs as OffchainMerkleMap;

  const uid = "ffdf4a17-a35b-4703-be8e-8b16bdf54e91";
  const [leaf, err2] = await map.get(uid) ;
  if (err2) console.log(err2);

  const uid = "ffdf4a17-a35b-4703-be8e-8b16bdf54e91";
  const hash = undefined; // = getHash(data);
  const data = {
    "uid": "ffdf4a17-a35b-4703-be8e-8b16bdf54e91",
    "full_name": "ALgo Maruco Juan Zamudio",
    "alias": "perejilitos"
  }

  const [updated, err3] = await map.set(uid, data, hash);
  if (err3) console.log(err3);

  try {
    const [witness, err4] = await map.getWitness(uid);
    if (err4) console.log(err4);
  
    // now we can call a Contract @method with this ...
    // we do not care about concurrency here as this will be managed 
    // by the contract itself using a reducer or something ...
    const txn1 = await Mina.transaction(this.sender.publicKey, () => {
      contract.updateSomeMap(
        map,
        witness,
        updated
      )
    });
  
    // build prove
    const txnProved = await txn1.prove();

    // sign it ... 
    const txnSigned = await txn1.sign([this.sender.privateKey]).send();
  }  
  catch (err) {
    // ROLLBACK 
    const [rollback, err3] = await map.set(uid, 
      updated.beforeLeaf,data, 
      updated.beforeLeaf.hash
    );
  }
~~~


### The Smart contract 

And the `updateSomeMap` contract will be something like:

~~~typescript
import {
  Field, 
  MerkleMapWitness
} from "snarkyjs";

import { 
  OffchainMerkleMap
  MerkleMapUpdate,
} from 'offchain-storage'; // we use the NPM installed lib


export class SomeMapContract extends SmartContract {

  const SOMEMAP_ID = 2; // the ID of SomeMap

  @state(Field) someMapRoot = State<Field>();
  // ... maybe some other @state Fields here ...

  init() {
    super.init();
    // get the root of the new map to use as the initial tree root
    // we add a Null leaf at start to be consistent with the map 
    // as it was initialized in the storage server
    const emptyMap = new MerkleMap();
    emptyMap.set(Field(0), Field(0));
    const initialRoot = emptyMap.getRoot();

    // INITIALIZE the state now 
    this.someMapRoot.set(Field(initialRoot));      

    // ... maybe some other @state Fields initialization here ...
  }

  // ... maybe some other methods here ...

  @method updateSomeMap(
    map: OffchainMerkleMap,
    witness: MerkleMapWitness,
    updated: MerkleMapUpdate,
  ) {
    // assert current state values
    const currentRoot = this.someMapRoot.get();
    this.someMapRoot.assertEquals(currentRoot);
    Circuit.log("Circuit.log currentRoot=", currentRoot);

    // check the updated ID matches the Offchain registered Tx 
    /* FUTURE ...
    const storageWasUpdated = map.assertUpdateTransaction(
      updated
    );
    storageWasUpdated.assertEquals(true);
    Circuit.log("Circuit.log Offchain updated=", updated);
    */

    // check the initial state matches what we expect
    const [ previousRoot, previousKey ] = witness.computeRootAndKey(
      updated.beforeLeaf.hash
    );

    // check root is correct
    previousRoot.assertEquals(currentRoot);
    Circuit.log("Circuit.log previousRoot=", previousRoot);
    
    // check the key is the correct key 
    previousKey.assertEquals(key);
    Circuit.log("Circuit.log previousKey=", previousKey);

    // compute the new root for the existent key and the newValue
    const [ newRoot, _ ] = witness.computeRootAndKey(
      updated.afterLeaf.hash
    );

    // set the new root
    this.someMapRoot.set(newRoot);
    Circuit.log("Circuit.log newRoot=", newRoot);

    // changed the changed value
    const changedRoot = this.someMapRoot.get();
    this.someMapRoot.assertEquals(changedRoot);
    Circuit.log("Circuit.log done changedRoot=", changedRoot);
  }

  // ... maybe some other methods here ...
}
~~~
