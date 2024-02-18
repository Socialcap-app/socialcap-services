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

export { AnyPayer, findPayer };

interface AnyPayer {
  address: string;
  publicKey: PublicKey;
  privateKey: PrivateKey;
}

// build the Payers dictio from the Environment settings
const Payers: any = {};

let basePort = Number(process.env.WORKERS_BASE_PORT);
let activeWorkers = Number(process.env.WORKERS_ACTIVE);
for (let j=0; j < activeWorkers; j++) {
  let keys = 'WORKER_'+(String(j+1).padStart(2, '0')); 
  let [pk,sk] = String(process.env[keys]).split(',').map(t => t.trim());

  Payers[pk] = {
    address: pk,
    publicKey: PublicKey.fromBase58(pk),
    privateKey: PrivateKey.fromBase58(sk)
  };
}

function findPayer(address: string): AnyPayer | null {
  return Payers[address] as AnyPayer || null;
  // let keys = Object.keys(Payers) || [];
  // for (let j=0; j < keys.length; j++) {
  //   let payer = Payers[keys[j]];
  //   if (payer.address === address)
  //     return payer;
  // }
  // return null;
}