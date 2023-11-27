import { OffchainMerkleStorage } from "./offchain-merkle-storage.js";
import { OffchainMerkleMap } from "./offchain-merkle-map.js";

const PERSONS_MERKLE_MAP = 1; 
const COMMUNITIES_MERKLE_MAP = 2; 
const MEMBERS_MERKLE_MAP = 3; 
const PLANS_MERKLE_MAP = 4;
const CLAIMS_MERKLE_MAP = 5;
const TASKS_MERKLE_MAP = 6;
const CREDENTIALS_MERKLE_MAP = 7;
const NULLIFIER_MERKLE_MAP = 8;

export {
  COMMUNITIES_MERKLE_MAP,
  PERSONS_MERKLE_MAP,
  MEMBERS_MERKLE_MAP,
  PLANS_MERKLE_MAP,
  CLAIMS_MERKLE_MAP,
  CREDENTIALS_MERKLE_MAP,
  TASKS_MERKLE_MAP,
  NULLIFIER_MERKLE_MAP,
  OffchainMerkleStorage,
  OffchainMerkleMap
}
