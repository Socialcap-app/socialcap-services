/**
 * The list of available sender and deployer accounts, used by the Dispatchers
 * to send tarnsactions. They are stores using an unique name, and obtained 
 * from the '.env' file.
 */
import 'dotenv/config';
import { PrivateKey, PublicKey } from 'o1js';

const SENDER_KEY = process.env.SENDER_KEY as string;
const SENDER_ID = process.env.SENDER_ID as string;
const DEPLOYER_KEY = process.env.DEPLOYER_KEY as string;
const DEPLOYER_ID = process.env.DEPLOYER_ID as string;

export { Payers, AnyPayer };

interface AnyPayer {
  address: string;
  publicKey: PublicKey;
  privateKey: PrivateKey;
}

const Payers: any = {
  'DEPLOYER': {
    address: DEPLOYER_ID,
    publicKey: PublicKey.fromBase58(DEPLOYER_ID),
    privateKey: PrivateKey.fromBase58(DEPLOYER_KEY)
  },

  'SENDER1': {
    address: SENDER_ID,
    publicKey: PublicKey.fromBase58(SENDER_ID),
    privateKey: PrivateKey.fromBase58(SENDER_KEY)
  }
}