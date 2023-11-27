import { Field } from "snarkyjs";

// This is imported from outside of this src root because it has been defined
// in "api/merkle-storage-server" as common types used in /api and /clients
import { 
  LeafInstance, 
  MerkleMapUpdate 
} from "../../../api/merkle-storage-server/src/storage/index.js";

type MerkleMapProxy = {
  id: number,
  name: string;
  root: Field,
  count: number
};

export {
  LeafInstance,
  MerkleMapUpdate,
  MerkleMapProxy
}
