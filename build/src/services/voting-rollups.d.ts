import { PrivateKey, PublicKey } from 'o1js';
export { rollupClaims };
/**
 *
 * @param running all running claims
 * @param payerAccount
 * @param payerSecret
 * @returns the finished claims indexes
 */
declare function rollupClaims(running: any[], payerAccount: PublicKey, payerSecret: PrivateKey): Promise<any[]>;
