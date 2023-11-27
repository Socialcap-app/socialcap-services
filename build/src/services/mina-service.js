import { logger } from "../global.js";
import { Mina, PublicKey, PrivateKey, CircuitString, Field, UInt32 } from "o1js";
import { CommunitiesContract, ElectorsContract } from "@socialcap/contracts";
import { waitForTransaction } from "./mina-transactions.js";
export { MinaService, setMinaNetwork };
const TX_FEE = 200000000;
let deployer = {
    publicKey: PublicKey.fromBase58(process.env.DEPLOYER_ID),
    privateKey: PrivateKey.fromBase58(process.env.DEPLOYER_KEY)
};
let sender = {
    publicKey: PublicKey.fromBase58(process.env.SENDER_ID),
    privateKey: PrivateKey.fromBase58(process.env.SENDER_KEY)
};
function setMinaNetwork() {
    const BERKELEY_URL = 'https://proxy.berkeley.minaexplorer.com/graphql', ARCHIVE_URL = 'https://archive.berkeley.minaexplorer.com/';
    const Berkeley = Mina.Network({
        mina: BERKELEY_URL,
        archive: ARCHIVE_URL
    });
    Mina.setActiveInstance(Berkeley);
}
class MinaService {
    static async updatePersonsRoot(provable, map, witness, updatedMerkle) {
        try {
            return;
            const publicKey = PublicKey.fromBase58(process.env.COMMUNITIES_CONTRACT_ID);
            logger.info(`Running CommunitiesContract '${publicKey.toBase58()}' ...`);
            await CommunitiesContract.compile();
            let zkContract = new CommunitiesContract(publicKey);
            let tx = await Mina.transaction({ sender: deployer.publicKey, fee: TX_FEE }, () => {
                zkContract.updatePerson(provable, map, witness, updatedMerkle);
            });
            await tx.prove();
            await tx.sign([deployer.privateKey]);
            let pendingTx = await tx.send();
            waitForTransaction(pendingTx.hash(), {}, (params) => { console.log("Txn OK"); }, (params, error) => { console.log("Txn Failed", error); });
        }
        catch (err) {
            console.log(err);
            throw err.toString();
        }
    }
    static async updateCommunitiesRoot(provable, map, witness, updatedMerkle) {
        //
    }
    static async updateMembersRoot(provable, map, witness, updatedMerkle) {
        //
    }
    static async updatePlansRoot(provable, map, witness, updatedMerkle) {
        //
    }
    static async updateClaimsRoot(provable, map, witness, updatedMerkle) {
        //
    }
    static async updateCredentialsRoot(provable, map, witness, updatedMerkle) {
        //
    }
    static async updateTasksRoot(provable, map, witness, updatedMerkle) {
        //
    }
    static async emptyHandler(provable, map, witness, updatedMerkle) {
        //
    }
    static async updateNullifierRoot(map, updatedMerkle, params, onSuccess, onError) {
        let mapProxy = {
            id: UInt32.from(map.id),
            name: CircuitString.fromString("nullifier"),
            root: map.getRoot(),
            count: Field(map.size())
        };
        let key = updatedMerkle.afterLeaf.key.toString();
        let witness = map.getWitness(key);
        try {
            const publicKey = PublicKey.fromBase58(process.env.ELECTORS_CONTRACT_ID);
            logger.info(`Running ElectorsContract '${publicKey.toBase58()}' ...`);
            await ElectorsContract.compile();
            let zkContract = new ElectorsContract(publicKey);
            let txn = await Mina.transaction({ sender: deployer.publicKey, fee: TX_FEE }, () => {
                zkContract.updateNullifier(mapProxy, witness, updatedMerkle);
            });
            await txn.prove();
            await txn.sign([deployer.privateKey]);
            let pendingTx = await txn.send();
            waitForTransaction(pendingTx.hash(), params, onSuccess, onError);
        }
        catch (err) {
            onError(params, err);
        }
    }
}
//# sourceMappingURL=mina-service.js.map