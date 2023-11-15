/**
 * Implements the voting process
 * - Create zkApp instance for this Claim
 * - Select validators using master plan
 * - Update NUllifier using electors
 * - Assign tasks to validators and send mails ...
 * - ... wait for votes ...
 */
import { Field, PublicKey, PrivateKey, Mina, MerkleMap } from "o1js";
import { UID, VotingInstance, ClaimsVotingFactory, NullifierProxy } from "@socialcap/contracts";
import { VOTING, CLAIMED } from "@socialcap/contracts";
import { logger } from "../global.js";
import { getValidators, getAuditors } from "../dbs/members-helpers.js";
import { getEntity, updateEntity } from "../dbs/any-entity-helpers.js"
import { addElectorsToNullifier, getNullifierOrRaise } from "../dbs/nullifier-helpers.js";
import { MinaService, setMinaNetwork } from "./mina-service.js";
import { VotingStrategy } from "./voting-strategy.js";
import { assignTaskToElectors } from "./voting-assignments.js";

export { startClaimVotingProcess }


async function startClaimVotingProcess(
  claim: any
) {
  try {
    if (claim.state !== CLAIMED)
      return;

    console.log("\n\n\n-------");
    console.log("Claim=", claim.uid, claim.state, claim.planUid, claim.communityUid);

    let plan = await getEntity("plan", claim.planUid);
    let planStrategy = JSON.parse(plan.strategy);

    console.log("Strategy=", planStrategy);
    
    // MUST be sure before deploying ...
    setMinaNetwork();

    /*
    let deployed: VotingInstance = await ClaimsVotingFactory.deploy(
      UID.toField(params.uid), 
      Field(strategy.minVotes),
      Field(strategy.minPositives),
      PublicKey.fromBase58(process.env.DEPLOYER_ID as string),
      PrivateKey.fromBase58(process.env.DEPLOYER_KEY as string),
    );
    */ 

    // get validators and auditors set  
    let validators = await getValidators(claim.communityUid);
    let auditors = await getAuditors(claim.communityUid);

    console.log("Auditors=", auditors);
    
    // now select the electors using the strategy binded to this plan
    let electors = (new VotingStrategy(planStrategy)).selectElectors(
      validators,
      auditors
    );

    console.log("Electors=", electors);

    // now prepare the Nullifier to avoid invalid/double voting 
    console.log("Add electors to nullifier=",claim);
    const nullifier = await getNullifierOrRaise();
    let nullifierUpdate = await addElectorsToNullifier(
      nullifier, 
      claim.uid, 
      electors
    );

    // after the Nullifier was updated we can now 
    // assign the task to the selected electors
    console.log("startVoting claim=",claim);
    await assignTaskToElectors(claim, electors); 

    let params = {
      uid: claim.uid,
      accountId: '', // $TODO$ deployed.address.toBase58();
      state: VOTING
    } 
    let result = await updateEntity("claim", params.uid, params);
    claim = result.proved;

    return {
      claim,
      nullifierUpdate
    }
  }
  catch (err: any) {
    logger.error("Could not startClaimVotingProcess err="+err.toString());
  }
}
