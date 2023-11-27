import { ClaimPlanStrategy } from "./strategies/plan-strategy.js";
export { VotingStrategy };
declare class VotingStrategy {
    runner: any;
    strategy: ClaimPlanStrategy;
    constructor(planStrategy: any);
    selectElectors(validators: any[], auditors: any[]): any[];
}
