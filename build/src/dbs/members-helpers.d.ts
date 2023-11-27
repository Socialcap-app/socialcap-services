export { getValidators, getAuditors, getAllMembers };
declare function getValidators(communityUid: string): Promise<any[]>;
declare function getAuditors(communityUid: string): Promise<any[]>;
declare function getAllMembers(communityUid: string): Promise<any[]>;
