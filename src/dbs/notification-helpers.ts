import { logger, prisma } from "../global.js";
import Sql from "./sql-helpers.js";

export {
  findNotifications
}

interface INotification {
  uid: string
  sequence?: bigint
  scope: string
  subjectUid: string 
  type: string
  text: string
  state: number
  createdUTC: Date
  metadata: string
}

async function findNotifications(params: {
  scopes: string[],
  types: string[],
  from: string,
  limit: number,
  userUid: string
}) {
  const { scopes, types, limit, from, userUid } = params;
  
  const items = await Sql`
    SELECT t.* FROM (
      SELECT nf.*
        FROM notifications nf 
        WHERE nf.scope = 'all'
        ORDER BY sequence desc
        LIMIT ${ limit }
      UNION SELECT nf.*
        FROM notifications nf 
        WHERE nf.scope = 'personal' AND subject_uid = ${ userUid }
        ORDER BY sequence desc
        LIMIT ${ limit }
      UNION SELECT nf.*
        FROM notifications nf 
        WHERE nf.scope = 'group' AND subject_uid in (
            SELECT community_uid FROM members
            AND person_uid = ${ userUid }
        )
        ORDER BY sequence desc
        LIMIT ${ limit }
    ) AS t
    WHERE 
      t.scope in ${ Sql(scopes) }
      AND t.type in ${ Sql(types) }
      AND t.created_utc >= ${ from }
    ORDER BY 
      t.sequence desc
    LIMIT ${ limit };
  `;

  // must fix col names because Sql does not map them correctly
  return (items || []).map(({ createdUtc, ...rest }) => ({ 
    ...rest,
    createdUTC: createdUtc, 
  }));
}
