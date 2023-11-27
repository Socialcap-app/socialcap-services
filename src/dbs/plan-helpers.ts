import { prisma } from "../global.js";

export async function findMasterPlanByName(communityUid: string, name: string) {
  let plans = await prisma.plan.findMany({
    where: { AND: [
      { name: name },
      { communityUid: communityUid }
    ]}
  });

  if (! plans || !plans.length)
    return null;
  
  return plans[0]; // just return the first one we found
}
