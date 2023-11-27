import { logger } from "../../global.js";
import { randomInt } from "crypto";
import { ClaimPlanStrategy } from "./plan-strategy.js";


export function selectAllMembersValidators(
  strategy: ClaimPlanStrategy,
  validators: any[],
  auditors: any[]
) {
  return validators;
}

