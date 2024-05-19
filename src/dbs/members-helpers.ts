import { Person, Members } from "@prisma/client";
import { logger, prisma } from "../global.js";
import Sql from "./sql-helpers.js";

export {
  getValidators, 
  getAuditors,
  getAllMembers,
  CommunityMembers,
  getMembersInCommunity
}

const 
  PLAIN = "1",
  VALIDATORS = "2",
  AUDITORS = "3";


class CommunityMembers {
  index = {} as any; // Dictio indexed by Person  Uid
  list: any[] = []; // List of members order by Person name

  constructor() {
    this.index = {};
    this.list = [];
  }

  /**
   * Get all members of a community with Peron and Roles data
   * @param communityUid 
   * @returns 
   */
  async build(communityUid: string) {
    // find bare members
    const members = await prisma.members.findMany({
      where: { communityUid: { equals: communityUid }},
      orderBy: { role: 'asc' }
    })
    const cuids  = members.map((t) => t.personUid);
  
    // make roles index
    const roles: any = {};
    (members || []).forEach((t) => {
      roles[t.personUid] = t.role;
    })
  
    let persons = await prisma.person.findMany({
      where: { uid: { in: cuids } },
      orderBy: { fullName: 'asc' }
    }) as any;
  
    // add the role !
    persons = (persons || []).map((p: any) => {
      p['role'] = roles[p.uid]; 
      return p;
    })

    this.list = persons;
    (persons || []).forEach((p: any) => { this.index[p.uid] = p })

    return this;
  }

  findByUid(uid: string) {
    return this.index[uid];
  }

  getAll(): any[] {
    return this.list;
  }

  getValidators(): any[] {
    const validators = this.list.filter((t) => {
      return t.role === 2 || t.role == 3;
    }) 
    return validators;
  }
}


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


async function getMembersInCommunity(
  communityUid: string, 
  options?: {
    roles?: string[]
    states?: string[]
  }
): Promise<any[]> {
  const members = await Sql`
    SELECT *
    FROM 
      members_view 
    WHERE 
      community_uid = ${ communityUid }
    ORDER BY 
      full_name asc;  
  `;
  let patched = (members || []).map((t: any) => {
    let tp = t;
    tp.approvedUTC = t.approvedUtc;
    tp.createdUTC = t.createdUtc;
    delete tp.approvedUtc;
    delete tp.createdUtc; 
    return tp;
  })
  return patched;
}
