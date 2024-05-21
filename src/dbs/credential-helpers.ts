import { logger, prisma } from "../global.js";
import Sql from "./sql-helpers.js";

export {
  getCredentialsInCommunity,
  findCredentialTransactions
}

async function getCredentialsInCommunity(
  communityUid: string,
): Promise<any[]> {
  const members = await Sql`
    SELECT *
    FROM 
      credentials_view 
    WHERE 
      community_uid = ${ communityUid }
    ORDER BY 
      applicant asc;  
  `;
  let patched = (members || []).map((t: any) => {
    let tp = t;
    tp.issuedUTC = t.issuedUtc;
    tp.expiresUTC = t.expiration;
    tp.type = t.name;
    delete tp.issuedUtc;
    delete tp.expiration; 
    return tp;
  })
  return patched;
}


/**
 * Get all transactions from the transactions queue
 * @param claimUid - UID of the claim 
 * @returns An array of transactions
 */
async function findCredentialTransactions(
  claimUid: string
): Promise<any[]> {
  const transactions = await Sql`
    SELECT *
    FROM 
      transactions_view 
    WHERE 
      queue = ${ 'claim-'+claimUid }
    ORDER BY 
      sequence asc;  
  `;
  return (transactions || []).map(({ 
    receivedUtc,submitedUtc,doneUtc, ...rest 
  }) => ({ 
    ...rest,
    // fix column names because Sql transforms do not map them correctly
    receivedUTC: receivedUtc,
    submitedUTC: submitedUtc,
    doneUTC: doneUtc,
  }));
}
