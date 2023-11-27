export declare class CommunityMembers {
    index: any;
    list: any[];
    constructor();
    /**
     * Get all members of a community with Peron and Roles data
     * @param communityUid
     * @returns
     */
    build(communityUid: string): Promise<this>;
    findByUid(uid: string): any;
    getAll(): any[];
    getValidators(): any[];
}
