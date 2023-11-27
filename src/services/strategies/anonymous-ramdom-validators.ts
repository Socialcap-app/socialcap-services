import { logger } from "../../global.js";
import { randomInt } from "crypto";
import { ClaimPlanStrategy } from "./plan-strategy.js";


export function selectRandomAnonyomusValidators(
  strategy: ClaimPlanStrategy,
  validators: any[],
  auditors: any[]
) {
  logger.info("Runnning RandomAnonyomusValidators voting strategy ...")

  let selectedValidators = selectAtRandom(
    validators, 
    strategy.minValidators
  );

  // do we have to audit now ? just throw a number :-)
  const frequency = strategy.auditFrequency;
  let mustAudit = (frequency > 0) && (randomInt(frequency+1) === frequency) 

  if (!mustAudit)
    return selectedValidators;

  // we nned to audit, so select them
  let selectedAuditors = selectAtRandom(
    auditors, 
    strategy.minAuditors
  );

  return selectedValidators.concat(selectedAuditors);
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

  let count = 0;
  while (count < min) {
    const k = randomInt(n); // select one from the array
    const uid = members[k].uid;
    if (! selected[uid]) {
      selected[uid] = members[k];
      count++;
    }
  }

  // return as an array
  return Object.keys(selected).map((uid) => selected[uid]);
}
