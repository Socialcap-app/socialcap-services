import { randomInt } from 'crypto';
import {  
  OffchainMerkleMap,
  OffchainMerkleStorage,
  LeafInstance,
  MerkleMapUpdate
} from "../src/merkle-storage-client/index.js";

// jest.mock('axios'); // Mocking the axios module

describe('Test Merkle storage client', () => {
  
  let offchain: OffchainMerkleStorage;  
  let map: OffchainMerkleMap;
  const uid = "ffdf4a17-a35b-4703-be8e-8b16bdf54e91";
  const hash = undefined;
  const data = {
    "uid": "ffdf4a17-a35b-4703-be8e-8b16bdf54e91",
    "full_name": "ALgo Maruco Juan Zamudio",
    "alias": "perejilitos"
  }
  
  it('should connect to OffchainMerkleStorage', async () => {
    offchain = new OffchainMerkleStorage();
    offchain = await offchain.connect("localhost", 3081);
    expect(offchain).not.toEqual(null);
  });

  it('should create a random merkle_map', async () => {
    const randname = "Mapita_"+randomInt(5000);
    const [map1, err] = await offchain.createMerkleMap(randname);
    if (err) console.log(err);
    expect(err).toEqual(null);
  });

  it('should get a given merkle_map by name', async () => {
    const [map2, err] = await offchain.getMerkleMap('Maruco_2');
    if (err) console.log(err);
    map = map2 as OffchainMerkleMap;
    expect(err).toEqual(null);
  });
    
  it('should get a given leaf by uid', async () => {
    const [leaf, err] = await map.get(uid) ;
    if (err) console.log(err);
    expect(err).toEqual(null);
  });
    
  it('should update a given leaf by uid', async () => {
      // const hash = getHash(data);
    const [updated, err] = await map.set(uid, data, hash);
    if (err) console.log(err);
    expect(err).toEqual(null);
  });

  it('should get a given leaf witness by uid', async () => {
    const [witness, err] = await map.getWitness(uid);
    if (err) console.log(err);
    expect(err).toEqual(null);
  });

  it('should get a merkle map root', async () => {
    const [root, err] = await map.getRoot();
    if (err) console.log(err);
    expect(err).toEqual(null);
  });
});

