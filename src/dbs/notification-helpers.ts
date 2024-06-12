import { logger, prisma } from "../global.js";
import { UID } from "@socialcap/contracts-lib";
import Sql from "./sql-helpers.js";

export {
  findNotifications,
  insertNotification
}


async function insertNotification(params: {
  scope: string,
  subject?: string, 
  type: string,
  memo: string,
  state: number,
  createdUTC: Date,
  metadata: string
}) {
  try {
    const rs = await prisma.notification.create({
      data: {
        uid: UID.uuid4(),
        // sequence will be auto incremented
        scope: params.scope,
        type: params.type,
        subject: params.subject,
        memo: params.memo,
        state: params.state || 0,
        createdUTC: (new Date()).toISOString(),
        metadata: params.metadata
      }
    })
    return rs; 
  }
  catch(error) {
    throw Error('Could not insert Notification ERROR:'
      +JSON.stringify(error, null, 2))
  }
}


async function findNotifications(params: {
  fromSequence: bigint,
  limit: number,
  userUid: string
}) {
  const { limit, userUid, fromSequence } = params;

  const items = await Sql`
    SELECT t.* FROM (
      SELECT nf.* FROM notifications nf WHERE nf.scope = 'all'
      UNION 
      SELECT nf.* FROM notifications nf WHERE nf.scope = 'personal' AND subject = ${ userUid }
      UNION 
      SELECT nf.* FROM notifications nf WHERE nf.scope = 'group' AND subject in (
        SELECT community_uid FROM members WHERE person_uid = ${ userUid }
      )
    ) AS t    
    WHERE t.sequence >= ${ Number(fromSequence) }
    ORDER BY t.sequence desc    
    LIMIT 100;
  `;  

  // must fix col names because Sql does not map them correctly
  return (items || []).map(({ createdUtc, ...rest }) => ({ 
    ...rest,
    createdUTC: createdUtc, 
  }));
}
