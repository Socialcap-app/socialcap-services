import { PublicKey } from "o1js";
export { waitForAccount, loopUntilAccountExists };
declare function waitForAccount(address: string): Promise<any>;
declare function loopUntilAccountExists({ account, eachTimeNotExist, isZkAppAccount, maxRetries }: {
    account: PublicKey;
    eachTimeNotExist: () => void;
    isZkAppAccount: boolean;
    maxRetries: number;
}): Promise<true | null>;
