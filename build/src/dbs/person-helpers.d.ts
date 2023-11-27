import { Person } from "@prisma/client";
export declare function getPersonOrRaise(uid: string): Promise<Person>;
export declare function updatePersonOrRaise(uid: string, unsafeParams: any): Promise<Person>;
