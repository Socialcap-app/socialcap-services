import { UID } from "@socialcap/contracts";
import { fastify, prisma } from "../global.js";
import { hasError, hasResult, raiseError } from "../responses.js";
import { updateEntity, getEntity } from "../dbs/any-entity-helpers.js";

import { getMyCommunities, getAllCommunities } from "./communities-controller.js";
import { getMyClaimables, getMyClaims } from "./claims-controller.js";
import { getMyTasks } from "./tasks-controller.js";
import { getMyCredentials } from "./credentials-controller.js";

export async function getMyHome(params: any) {

  console.log("getMyHome",params);

  const claimables = await getMyClaimables(params);
  const credentials = await getMyCredentials(params);
  const claimed = await getMyClaims(params);
  const tasks = await getMyTasks(params);
  const allCommunities = await getAllCommunities(params);
  const joined = await getMyCommunities(params);
  const notJoined = await getAllCommunities({user: params.user, notJoined: true})

  let rs = {
    claimables: claimables.data,
    credentials: credentials.data, 
    claimed: claimed.data,
    joined: joined.data,
    joinables: notJoined.data,
    allCommunities: allCommunities.data,
    assigned: tasks.data,
  }

  return hasResult(rs); 
}

/*
      isAuthenticated: isAuthenticated,
      claimables: await getMyClaimables(),
      credentials: await getMyCredentials(), 
      claimed: await getMyClaims(),
      joined: await getMyCommunities(),
      joinables: await getAllCommunities({notJoined: true}),
      allCommunities: await getAllCommunities(),
      assigned: ((await getMyTasks()) || []).filter((t) => t.state=== ASSIGNED),
*/