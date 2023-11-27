
# OffchainMerkleStorage

### How to use 

Here is an example of how to use the OffchainMerkleStorage server.

~~~typescript
  import {
    Field, 
    MerkleMapWitness
  } from "snarkyjs";

  import { 
    OffchainMerkleStorage,
    OffchainMerkleMap,
    LeafInstance,
    MerkleMapUpdate,
    dataToHash,
    uuidToField
  } from 'offchain-storage'; // we use the NPM installed lib

  // the received uuid we want to insert or update
  const receivedUid = "419b4d3e-a616-44b3-9f5d-bdb940afb05f";

  // and the received data of the key we want to update  
  const receivedData = {
    uid:"419b...b05f",
    accountId: "B62q...qYAm",
    fullName: "Arriba del Pino",
    // ... and other properties
  };

  // connect to offchain storage
  const offchain = await OffchainMerkleStorage.connect({
    to: "http://localhost:3010",
    db: "myDb", // the Db can contain a max of 8 Maps (0..7) for now !
    apiKey: "B230...A456" // the API Key Token created by the Server
  });

  // get the MerkleMap we want to update
  const SOME_MAP_ID = 2; // we can have max of 8 maps per offchain Db
  const map = await offchain.getMerkleMap(SOME_MAP_ID);
  
  // convert the received uid to a Field key
  const key = uuidToField(receivedUid);

  // and update (or insert) the data with the given key
  // we will receive in return a MerkleMapUpdate transaction
  // with previous and current roots and leaf values
  let updatedTx = await map.set(key, receivedData);

  // get the Witness of the changed key
  const witness = await map.getWitness(key);
  
  // now we can call a Contract @method with this ...
  // we do not care about concurrency here as this will be managed 
  // by the contract itself using a reducer or something ...
  const txn1 = await Mina.transaction(this.sender.publicKey, () => {
    contract.updateSomeMap(
      map,
      witness,
      updatedTx
    )
  });

  // build prove
  const txnProved = await txn1.prove();

  // sign it ... 
  const txnSigned = await txn1.sign([this.sender.privateKey]).send();

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
    // get the root of the new tree to use as the initial tree root
    const initialRoot = (new OffchainMerkleMap(SOMEMAP_ID)).getRoot();
    // INITIALIZE the state now 
    this.someMapRoot.set(Field(initialRoot));      
    // ... maybe some other @state Fields initialization here ...
  }

  // ... maybe some other methods here ...

  @method updateSomeMap(
    map: OffchainMerkleMap,
    witness: MerkleMapWitness,
    updateTx: MerkleMapUpdate
  ) {
    // just check we are updating the right Map
    map.id.assertEquals(SOMEMAP_ID);
    Circuit.log("Circuit.log update mapId=", mapId);

    // asert current state values
    const currentRoot = this.someMapRoot.get();
    this.someMapRoot.assertEquals(currentRoot);
    Circuit.log("Circuit.log currentRoot=", currentRoot);

    // check the updateTx ID matches the Offchain registered Tx 
    const updated = map.assertUpdateTransaction(
      updateTx
    );
    updated.assertEquals(true);
    Circuit.log("Circuit.log Offchain updated=", updated);

    // check the initial state matches what we expect
    const [ previousRoot, previousKey ] = witness.computeRootAndKey(
      updateTx.beforeLeaf.hash
    );

    // check root is correct
    previousRoot.assertEquals(currentRoot);
    Circuit.log("Circuit.log previousRoot=", previousRoot);
    
    // check the key is the correct key 
    previousKey.assertEquals(key);
    Circuit.log("Circuit.log previousKey=", previousKey);

    // compute the new root for the existent key and the newValue
    const [ newRoot, _ ] = witness.computeRootAndKey(
      updateTx.afterLeaf.hash
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
