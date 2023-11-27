import { logger } from "../../global.js";
import { randomInt } from "crypto";
import { ClaimPlanStrategy } from "./plan-strategy.js";


export function selectNominatedValidators(
  validators: any[],
  auditors: any[],
  strategy: ClaimPlanStrategy,
) {
  logger.info("Runnning NominatedValidators voting strategy ...")

  return [];
}

