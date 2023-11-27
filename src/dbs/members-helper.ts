import { prisma } from "../global.js";

export class CommunityMembers {
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
