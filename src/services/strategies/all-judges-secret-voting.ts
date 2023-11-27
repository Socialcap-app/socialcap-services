import { logger } from "../../global.js";
import { randomInt } from "crypto";
import { ClaimPlanStrategy } from "./plan-strategy.js";


export function selectAllJudgesSecretVoting(
  validators: any[],
  auditors: any[],
  strategy: ClaimPlanStrategy,
) {
  logger.info("Runnning All Judges Secret Voting voting strategy ...")

  // Only Auditors are included here, so we select all from the
  // Auditors list. The number of validators is really not used 
  // but anyway we do a random selection according to this number
  let selectedAuditors = selectAtRandom(
    auditors, 
    strategy.minValidators
  );

  return selectedAuditors;
}

function selectAtRandom(
  members: any[], 
  min: number
): any[] {
  const n = (members || []).length;
  let selected: any = {};

  // do we have enough ?
  if (n < min) {
    logger.error(`We can not proceed, not enough members ${n} < ${min}`);
    return [];
  }

  let count = 0, retries = 0;
  const MAX_RETRIES = min*20;
  while (count < min && retries < MAX_RETRIES) {
    const k = randomInt(n); // select one from the array
    const uid = members[k].uid;
    if (! selected[uid] && members[k].accountId) {
      selected[uid] = members[k];
      count++;
    }
    else {
      retries++;
    }
  }

  if (retries >= MAX_RETRIES) {
    logger.error(`We can not proceed, not enough validators with valid AccountID`);
    return [];
  }

  // return as an array
  return Object.keys(selected).map((uid) => selected[uid]);
}
