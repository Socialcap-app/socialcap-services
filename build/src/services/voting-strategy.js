import { selectRandomAnonyomusValidators } from "./strategies/anonymous-ramdom-validators.js";
import { selectAllMembersValidators } from "./strategies/all-members-validators.js";
import { selectNominatedValidators } from "./strategies/nominated-validators.js";
import { selectAllJudgesSecretVoting } from "./strategies/all-judges-secret-voting.js";
export { VotingStrategy };
const RUNNERS = {
    "RandomAnonyomusValidators": selectRandomAnonyomusValidators,
    "AllMembersAnonymousVoting": selectAllMembersValidators,
    "NominatedValidators": selectNominatedValidators,
    "AllJudgesSecretVoting": selectAllJudgesSecretVoting
};
class VotingStrategy {
    constructor(planStrategy) {
        this.strategy = planStrategy;
        this.runner = RUNNERS[planStrategy.variant];
    }
    selectElectors(validators, auditors) {
        return this.runner(validators, auditors, this.strategy);
    }
}
//# sourceMappingURL=voting-strategy.js.map