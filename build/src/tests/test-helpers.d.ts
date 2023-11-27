import { PrivateKey, PublicKey } from "o1js";
export declare function getArgvs(): [string, boolean, string];
export declare function startTest(testName: string): void;
export declare function getAccountsForTesting(netw: string, proofsEnabled: boolean): Promise<{
    deployerAccount: PublicKey;
    deployerKey: PrivateKey;
    senderAccount: PublicKey;
    senderKey: PrivateKey;
}>;
export declare function checkTransaction(pendingTx: any): void;
