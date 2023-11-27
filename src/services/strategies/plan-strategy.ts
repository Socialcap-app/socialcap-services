/**
 * Strategy types
 */ 

export type StrategyVariant = 
  "RandomAnonyomusValidators" | 
  "AllMembersAnonymousVoting" | 
  "NominatedValidators";

export type SelectionSet =
  "ValidatorsSet" |
  "WholeCommunity" ;

export type ClaimPlanStrategy = {
  title: string,
  variant: StrategyVariant,
  selection: SelectionSet,
  minValidators: number,
  minVotes: number,
  minPositiveVotes: number,
  minAuditors: number,
  auditFrequency: number 
}
