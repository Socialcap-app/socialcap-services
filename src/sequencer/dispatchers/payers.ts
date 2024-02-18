/**
 * The list of available sender and deployer accounts, used by the Dispatchers
 * to send tarnsactions. They are stores using an unique name, and obtained 
 * from the '.env' file.
 */
import 'dotenv/config';
import { PrivateKey, PublicKey, fetchAccount } from 'o1js';
import { SequencerLogger as log } from "../core/index.js"
import { hasException, ACCOUNT_NOT_FOUND, NO_FEE_PAYER_AVAILABLE } from "../core/error-codes.js";

export { AnyPayer, findPayer, loadPayers };

interface AnyPayer {
  address: string;
  publicKey: PublicKey;
  privateKey: PrivateKey;
}

const Payers: any = {}; // Payers dictio

/**
 * Builds the Payers dictio from .env.
 */
function loadPayers() {
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
    log.info(`Payer j=${j} address=${pk}`)
  }
}

async function findPayer(
  address: string
): Promise<[AnyPayer | null, any]> {
  // find it in the payers list from .env  
  const payer = Payers[address] as AnyPayer || null;
  if (!payer) return [null, {
    data: {}, hash: "",
    error: hasException(NO_FEE_PAYER_AVAILABLE, { accountId: address })
  }]

  // check the account exists in MINA
  let hasAccount = await fetchAccount({ publicKey: payer.publicKey });
  if (!hasAccount) return [null, {
    data: {}, hash: "",
    error: hasException(ACCOUNT_NOT_FOUND, { accountId: address })
  }]

  return [payer, null];
}
