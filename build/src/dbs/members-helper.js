import { prisma } from "../global.js";
export class CommunityMembers {
    constructor() {
        this.index = {}; // Dictio indexed by Person  Uid
        this.list = []; // List of members order by Person name
        this.index = {};
        this.list = [];
    }
    /**
     * Get all members of a community with Peron and Roles data
     * @param communityUid
     * @returns
     */
    async build(communityUid) {
        // find bare members
        const members = await prisma.members.findMany({
            where: { communityUid: { equals: communityUid } },
            orderBy: { role: 'asc' }
        });
        const cuids = members.map((t) => t.personUid);
        // make roles index
        const roles = {};
        (members || []).forEach((t) => {
            roles[t.personUid] = t.role;
        });
        let persons = await prisma.person.findMany({
            where: { uid: { in: cuids } },
            orderBy: { fullName: 'asc' }
        });
        // add the role !
        persons = (persons || []).map((p) => {
            p['role'] = roles[p.uid];
            return p;
        });
        this.list = persons;
        (persons || []).forEach((p) => { this.index[p.uid] = p; });
        return this;
    }
    findByUid(uid) {
        return this.index[uid];
    }
    getAll() {
        return this.list;
    }
    getValidators() {
        const validators = this.list.filter((t) => {
            return t.role === 2 || t.role == 3;
        });
        return validators;
    }
}
//# sourceMappingURL=members-helper.js.map