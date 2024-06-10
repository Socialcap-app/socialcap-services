import { UID, WAITING, UNPAID, VOTING } from "@socialcap/contracts-lib";
import { fastify, prisma, logger } from "../global.js";
import { hasError, hasResult, raiseError } from "../responses.js";
import { findNotifications } from "../dbs/notification-helpers.js";

/**
 * Gets all notifications for this user, filtered using the 
 * given parameters and with a max limit of items 
 * @param fromSequence? - the sequencefrom where we want to retrieve notifications
 * @param limit? - the max numer of returned notifications
 * @param user - the user account Uid
 * @returns 
 */
export async function getMyNotifications(params: {
  fromSequence?: string, 
  limit?: number,
  user: any
}) {
  const { fromSequence, limit } = params;
  let data = await findNotifications({
    fromSequence: BigInt(fromSequence || 0),
    limit: limit || 100,
    userUid: params.user.uid
  })
  return hasResult(data); 
}
