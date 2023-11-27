import { MerkleMapWitness } from "o1js";
import { OffchainMerkleMap } from "../dbs/index.js";
import { ProvablePerson, ProvableCommunity, ProvableMember, ProvableTask, ProvableClaim, ProvableCredential, ProvablePlan, MerkleMapProxy, MerkleMapUpdate } from "@socialcap/contracts";
export { MinaService, setMinaNetwork };
declare function setMinaNetwork(): void;
declare class MinaService {
    static updatePersonsRoot(provable: ProvablePerson, map: MerkleMapProxy, witness: MerkleMapWitness, updatedMerkle: MerkleMapUpdate): Promise<void>;
    static updateCommunitiesRoot(provable: ProvableCommunity, map: MerkleMapProxy, witness: MerkleMapWitness, updatedMerkle: MerkleMapUpdate): Promise<void>;
    static updateMembersRoot(provable: ProvableMember, map: MerkleMapProxy, witness: MerkleMapWitness, updatedMerkle: MerkleMapUpdate): Promise<void>;
    static updatePlansRoot(provable: ProvablePlan, map: MerkleMapProxy, witness: MerkleMapWitness, updatedMerkle: MerkleMapUpdate): Promise<void>;
    static updateClaimsRoot(provable: ProvableClaim, map: MerkleMapProxy, witness: MerkleMapWitness, updatedMerkle: MerkleMapUpdate): Promise<void>;
    static updateCredentialsRoot(provable: ProvableCredential, map: MerkleMapProxy, witness: MerkleMapWitness, updatedMerkle: MerkleMapUpdate): Promise<void>;
    static updateTasksRoot(provable: ProvableTask, map: MerkleMapProxy, witness: MerkleMapWitness, updatedMerkle: MerkleMapUpdate): Promise<void>;
    static emptyHandler(provable: ProvableTask, map: MerkleMapProxy, witness: MerkleMapWitness, updatedMerkle: MerkleMapUpdate): Promise<void>;
    static updateNullifierRoot(map: OffchainMerkleMap, updatedMerkle: MerkleMapUpdate, params: any, onSuccess: (params: any) => void, onError: (params: any, error: any) => void): Promise<void>;
}
