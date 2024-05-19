import { logger, prisma } from "../global.js";
import Sql from "./sql-helpers.js";

export {
  getCredentialsInCommunity
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
