import { Mina, PrivateKey, PublicKey } from "o1js";
let tstart = 0;
export function getArgvs() {
    let args = process.argv.slice(2);
    const netw = args[0] || "Local";
    const proofsEnabled = (args[1] === "proofsEnabled");
    console.log(`\nUsing network=${netw}, proofsEnabled=${proofsEnabled}`);
    const contractName = (args.length > 2) ? args[2] : "";
    return [netw, proofsEnabled, contractName];
}
export function startTest(testName) {
    console.log("\nBegin testing '" + testName + "' at=", (new Date()).toISOString());
    tstart = (new Date()).getTime();
}
export async function getAccountsForTesting(netw, proofsEnabled) {
    let deployer, sender;
    if (netw === "Local") {
        console.log("\nRun on Mina.LocalBlockchain");
        const Local = Mina.LocalBlockchain({ proofsEnabled });
        Mina.setActiveInstance(Local);
        deployer = Local.testAccounts[0];
        sender = Local.testAccounts[1];
    }
    if (netw === "Berkeley") {
        console.log("\nRun on Mina.Berkeley");
        const BERKELEY_URL = 'https://proxy.berkeley.minaexplorer.com/graphql', ARCHIVE_URL = 'https://archive.berkeley.minaexplorer.com/', SENDER_KEY = process.env.SENDER_KEY, SENDER_ID = process.env.SENDER_ID, DEPLOYER_KEY = process.env.DEPLOYER_KEY, DEPLOYER_ID = process.env.DEPLOYER_ID;
        const Berkeley = Mina.Network({
            mina: BERKELEY_URL,
            archive: ARCHIVE_URL
        });
        Mina.setActiveInstance(Berkeley);
        deployer = {
            publicKey: PublicKey.fromBase58(DEPLOYER_ID),
            privateKey: PrivateKey.fromBase58(DEPLOYER_KEY)
        };
        sender = {
            publicKey: PublicKey.fromBase58(SENDER_ID),
            privateKey: PrivateKey.fromBase58(SENDER_KEY)
        };
    }
    console.log("deployer Addr=", deployer.publicKey.toBase58());
    console.log("sender Addr=", sender.publicKey.toBase58());
    return {
        deployerAccount: deployer.publicKey,
        deployerKey: deployer.privateKey,
        senderAccount: sender.publicKey,
        senderKey: sender.privateKey
    };
}
export function checkTransaction(pendingTx) {
    // check if Tx was success or failed
    if (!pendingTx.isSuccess) {
        console.log('Error sending transaction (see above)');
        // process.exit(0); // we will NOT exit here, but retry latter !!!
    }
    console.log(`Transaction: https://berkeley.minaexplorer.com/transaction/${pendingTx.hash()}`
        + `\nWaiting for transaction to be included...`);
}
//# sourceMappingURL=test-helpers.js.map