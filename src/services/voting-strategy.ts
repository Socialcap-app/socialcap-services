/**
 * Implements the strategie set up in a Plan
 */
import { logger } from "../global.js";
import { selectRandomAnonyomusValidators } from "./strategies/anonymous-ramdom-validators.js";
import { selectAllMembersValidators } from "./strategies/all-members-validators.js";
import { selectNominatedValidators } from "./strategies/nominated-validators.js";
import { selectAllJudgesSecretVoting } from "./strategies/all-judges-secret-voting.js";
import { ClaimPlanStrategy } from "./strategies/plan-strategy.js";

export { VotingStrategy }


const RUNNERS: any = {
  "RandomAnonyomusValidators": selectRandomAnonyomusValidators,
  "AllMembersAnonymousVoting": selectAllMembersValidators,
  "NominatedValidators": selectNominatedValidators,
  "AllJudgesSecretVoting": selectAllJudgesSecretVoting
}

class VotingStrategy {
  runner: any;
  strategy: ClaimPlanStrategy;

  constructor(planStrategy: any) {
    this.strategy = planStrategy;
    this.runner = RUNNERS[planStrategy.variant];
  }

  selectElectors(validators: any[], auditors: any[]): any[] {
    return this.runner(validators, auditors, this.strategy) ;     
  }
}
