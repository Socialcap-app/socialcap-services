import { UID, WAITING, UNPAID, VOTING } from "@socialcap/contracts-lib";
import { fastify, prisma, logger } from "../global.js";
import { hasError, hasResult, raiseError } from "../responses.js";
import { findNotifications } from "../dbs/notification-helpers.js";

/**
 * Gets all notifications for this user, 
 * filtered using the given parameters 
 * and with a max limit of items 
 * @param scopes? - array of scopes: [all, group, personal]
 * @param types? - array of types: [message,request,transaction]
 * @param from? - the date from where we want to retrieve notifications
 * @param limit? - the max numer of returned notifications
 * @param user - the user account Uid
 * @returns 
 */
export async function getMyNotifications(params: {
  scopes?: string[],
  types?: string[],
  from?: string, 
  limit?: number,
  user: any
}) {
  const { scopes, types, from, limit } = params;
  let data = await findNotifications({
    scopes: scopes?.length ? scopes : ['all','group','personal'],
    types: types?.length ? types : ['request','message','transaction'],
    from: from || '2020-01-01 00:00:00',
    limit: limit || 100,
    userUid: params.user.id
  })
  return hasResult(data); 
}

/**
 * 
*/
export async function postNotification(params: {
  scope: string,
  subjectUid?: string, 
  type: string,
  text: string,
  state: number,
  createdUTC: Date,
  metadata: string,
  user: any
}) {
  const userUid = params.user.uid;
  const rs = await prisma.notification.create({
    data: {
      uid: UID.uuid4(),
      // sequence will be auto incremented
      scope: params.scope,
      type: params.type,
      subjectUid: params.scope === 'personal' ? userUid : params.subjectUid,
      text: params.text,
      state: params.state,
      createdUTC: (new Date()).toISOString(),
      metadata: params.metadata
    }
  })
  return hasResult(rs); 
}
