/**
 * The list of available sender and deployer accounts, used by the Dispatchers
 * to send tarnsactions. They are stores using an unique name, and obtained
 * from the '.env' file.
 */
import 'dotenv/config';
import { PrivateKey, PublicKey } from 'o1js';
export { Payers, AnyPayer };
interface AnyPayer {
    address: string;
    publicKey: PublicKey;
    privateKey: PrivateKey;
}
declare const Payers: any;
