import { logger, prisma } from "../global.js";
import Sql from "./sql-helpers.js";

export {
  getCredentialsInCommunity,
  findCredentialTransactions,
  getCredentialByUid,
  getUserCredentials
}

/**
 * Get all credentials issued by a community
 * @param communityUid - UID of the community 
 * @returns An array of credentials
 */
async function getCredentialsInCommunity(
  communityUid: string,
): Promise<any[]> {
  const members = await Sql`
    SELECT *
    FROM 
      credentials_view 
    WHERE 
      community_uid = ${communityUid}
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
 * Get all user credentials
 * @param userUid - UID of the user 
 * @returns An array of credentials
 */
async function getUserCredentials(
  userUid: string,
): Promise<any[]> {
  const credentials = await Sql`
    SELECT *
    FROM 
      credentials_view 
    WHERE 
      applicant_uid = ${userUid}
    ORDER BY 
      issued_utc desc;  
  `;
  let patched = (credentials || []).map((t: any) => {
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
 * Get credential by UID
 * @param uid - UID of the claim 
 * @returns A credential object
 */
async function getCredentialByUid(
  uid: string,
): Promise<any> {
  const result = await Sql`
    SELECT *
    FROM 
      credentials_view 
    WHERE 
      uid = ${uid}
    LIMIT 1;  
  `;
  if (result.length == 0) return {};
  let credential = result[0];
  credential.issuedUTC = credential.issuedUtc;
  credential.expiresUTC = credential.expiration;
  credential.type = credential.name;
  delete credential.issuedUtc;
  delete credential.expiration;

  return credential;
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
      queue = ${'claim-' + claimUid}
    ORDER BY 
      sequence asc;  
  `;
  console.log("findCredentialTransactions", transactions);
  return (transactions || []).map(({
    receivedUtc, submitedUtc, doneUtc, ...rest
  }) => ({
    ...rest,
    // fix column names because Sql transforms do not map them correctly
    receivedUTC: receivedUtc,
    submitedUTC: submitedUtc,
    doneUTC: doneUtc,
  }));
}
