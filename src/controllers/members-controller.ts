import { UID } from "@socialcap/contracts-lib";
import { fastify, prisma } from "../global.js";
import { hasError, hasResult, raiseError } from "../responses.js";
import { updateEntity, getEntity } from "../dbs/any-entity-helpers.js";
import { getMembersInCommunity } from "../dbs/members-helpers.js";


export async function joinCommunity(params: any) {
  const { communityUid, personUid } = params;

  const members = await prisma.members.findFirst({
    where: {
      AND: [
        { personUid: { equals: personUid } },
        { communityUid: { equals: communityUid } }
      ]
    },
  })
  if (members)
    raiseError.BadRequest("Already a member of this community !")

  let memberUid = communityUid + personUid;
  let rsm = await updateEntity("members", memberUid, {
    communityUid: communityUid,
    personUid: personUid,
    role: "0", // PENDING, must start as Pending. Admin should accept.
    new: true
  })

  return hasResult({
    member: rsm.proved,
    transaction: rsm.transaction
  });
}


export async function updateMemberRole(params: {
  communityUid: string,
  personUid: string,
  role: number,
  user: any
}) {
  const { communityUid, personUid, role } = params;

  if (![0, 1, 2, 3].includes(role))
    raiseError.BadRequest("Can not update this invalid role !")

  // first get current instance 
  let memberUid = communityUid + personUid;

  // update partially 
  let rs = await updateEntity("members", memberUid, {
    communityUid: communityUid,
    personUid: personUid,
    role: role + ""
  })

  return hasResult({
    claim: rs.proved,
    transaction: rs.transaction
  });
}


export async function promoteMember(params: any) {
  const { communityUid, personUid, role } = params;

  if (!["2", "3"].includes(role))
    raiseError.BadRequest("Can not promote this invalid role !!!!!")

  const members = await prisma.members.findFirst({
    where: {
      AND: [
        { personUid: { equals: personUid } },
        { communityUid: { equals: communityUid } }
      ]
    },
  })
  if (!members)
    raiseError.BadRequest("Not a member !");

  let memberUid = communityUid + personUid;
  let rsm = await updateEntity("members", memberUid, {
    communityUid: communityUid,
    personUid: personUid,
    role: role, // 2 | 3 
    new: params.new
  })

  return hasResult({
    member: rsm.proved,
    transaction: rsm.transaction
  });
}

export async function addMemberToAdmins(params: any) {
  const { communityUid, user, personUid } = params;

  let data = await getEntity("community", communityUid);

  // check if user is the Admin
  if (!(data.adminUid === params.user.uid || data.xadmins.includes(params.user.uid)))
    raiseError.ForbiddenError("Not the Admin of this community !");

  // check if member already an admin
  if (data.xadmins.includes(personUid))
    raiseError.BadRequest("Already an admin !");

  let rsm = await updateEntity("community", communityUid, {
    xadmins: [...data.xadmins, personUid]
  })    

  return hasResult({
    community: rsm.proved,
    transaction: rsm.transaction
  });
}

export async function removeMemberFromAdmins(params: any) {
  const { communityUid, user, personUid } = params;

  let data = await getEntity("community", communityUid);

  // check if user is the Admin
  if (!(data.adminUid === params.user.uid || data.xadmins.includes(params.user.uid)))
    raiseError.ForbiddenError("Not the Admin of this community !");

  // check if member not an admin
  if (!data.xadmins.includes(personUid))
    raiseError.BadRequest("Not an adminof this community !");

  let rsm = await updateEntity("community", communityUid, {
    xadmins: data.xadmins.filter((t: string) => t !== personUid)
  })    

  return hasResult({
    community: rsm.proved,
    transaction: rsm.transaction
  });
}


/**
 * Get the list of all the members of a given community
 * @param params.communityUid - UID of the required community
 * @param params.options - additional options
 * @param params.options.roles - filter by this roles, including admin
 * @param params.options.states - filter by the user states 
 * @returns A list of Member
 */
export async function getMembers(params: {
  communityUid: string,
  options?: {
    roles?: string[],
    states?: string[]
  }
}) {
  let members = await getMembersInCommunity(
    params.communityUid,
    params.options
  );
  return hasResult(members);
}


