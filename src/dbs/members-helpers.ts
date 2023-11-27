import { Person, Members } from "@prisma/client";
import { logger, prisma } from "../global.js";
import { raiseError } from "../responses.js"

export {
  getValidators, 
  getAuditors,
  getAllMembers
}

const 
  PLAIN = "1",
  VALIDATORS = "2",
  AUDITORS = "3";

async function getMembersWithRoles(
  communityUid: string,
  roles: string[]
): Promise<{
  uid: string,
  accountId: string,
  email: string,
  fullName: string
}[]> {
  // get all members who have the role VALIDATOR
  let members = await prisma.members.findMany({
    where: { AND: [
      { communityUid: { equals: communityUid } },
      { role: { in: roles }}    
    ]}  
  })

  // create a list for gettin Person infor because we cant JOIN ufff
  const personUids =  members.map((t) => t.personUid);

  // we need some personal info: uid, accountId, email so we can latter
  // fill the Nullifier and send emails to the assigned ones
  let persons = await prisma.person.findMany({
    where: { uid: { in: personUids } },
  })

  let filtered: any[] = persons.map((p) => {
    return {
      uid: p.uid,
      email: p.email,
      accountId: p.accountId,
      fullName: p.fullName
    }
  })

  return filtered;
}

async function getValidators(communityUid: string): Promise<any[]> {
  return await getMembersWithRoles(communityUid, [VALIDATORS]) 
}

async function getAuditors(communityUid: string): Promise<any[]> {
  return await getMembersWithRoles(communityUid, [AUDITORS]) ;
}

async function getAllMembers(communityUid: string): Promise<any[]> {
  return await getMembersWithRoles(communityUid, [PLAIN, VALIDATORS, AUDITORS]) ;
}
