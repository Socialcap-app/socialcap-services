import { Field, PublicKey } from "o1js";
import { UID, ASSIGNED, VOTING, CLAIMED, UTCDateTime } from "@socialcap/contracts-lib";
import { ClaimElectorNullifier, ClaimElectorNullifierLeaf } from "@socialcap/claim-voting";
import { logger, prisma } from "../global.js";
import { updateEntity } from "../dbs/any-entity-helpers.js";
import { getValidators, getAuditors } from "../dbs/members-helpers.js";
import { getMasterPlan } from "../dbs/plan-helpers.js";
import { getClaimsByPlan } from "../dbs/claim-helpers.js";
import { VotingStrategy } from "./voting-strategy.js";
import { Sequencer } from "../sequencer/core/index.js";
import { saveJSON } from "../dbs/nullifier-helpers.js";
//import { sendEmail } from "./email-service.js";

export {
  assignTaskToElectors,
  assignAllElectors
}


async function assignTaskToElectors(
  claim: any, 
  electors: any[]
) {
  // first remove all previous tasks assigned to this claim
  let previous = await prisma.task.findMany({ where: { claimUid: claim.uid }});
  (previous || []).forEach(async (t) => {
    await prisma.task.delete({ where: { uid: t.uid } });
  });

  (electors || []).forEach(async (elector) => {
    const now = UTCDateTime.now(); // millisecs since 1970
    const due = BigInt(10*24*60*60*1000) + now.toBigInt(); // 10 days

    let task = {
      uid: UID.uuid4(),
      claimUid: claim.uid,
      assigneeUid: elector.uid,
      state: ASSIGNED,
      assignedUTC: UTCDateTime.fromField(now),
      completedUTC: null,
      dueUTC: UTCDateTime.fromField(Field(due)),
      rewarded: 0,
      reason: 0,
    }

    let params: any = task;
    params.new = true;
    let tp = await updateEntity("task", task.uid, task);

    console.log(`Assigned to=${elector.email} task=${task.uid} claim=${claim.uid}`);

    // send notifications
    const mailBody = `
      Hi there validator,

      You have been assigned task #${task.uid} !
      Please go to the Socialcap app and open the tab "My tasks".
      There you can evaluate this claim and emit your vote,
      Thanks in advance !

      The SocialCap team.
    `;

    // await sendEmail ({
    //   email: elector.email,
    //   subject: "SocialCap is requesting your vote",
    //   text: mailBody
    // });
  })
} 


/**
 * Assign all electors to all claims in a given Plan. 
 * - ALL claims in the CLAIMED stated will be assigned electors.
 * - If the claim has previous electors asigned they will be deleted
 *   and reassigned.
 * @param planUid the master plan containing the claims and the strategy
 * @updates claims, claim and plan nullifiers and tasks
 */
async function assignAllElectors(planUid: string) {
  
  let plan = await getMasterPlan(planUid);
  let planStrategy = JSON.parse(plan!.strategy as string);
  console.log("Strategy=", planStrategy);
  
  let claims = await getClaimsByPlan(planUid, { states: [CLAIMED]});
  
  let claimsNullifier = new ClaimElectorNullifier();
  let planElectorsNulli = null;

  for (let j=0; j < claims.length ; j++) {
    let claim: any = claims[j];
    console.log("Claim uid=", claim.uid);
  
    // get validators and auditors set  
    let validators = await getValidators(claim.communityUid);
    let auditors = await getAuditors(claim.communityUid);
    console.log("Validators=", validators);
    console.log("Auditors=", auditors);
    
    // now select the electors using the strategy binded to this plan
    let electors = (new VotingStrategy(planStrategy)).selectElectors(
      validators,
      auditors
    );
    console.log("Electors=", electors);

    // update Nullifier to avoid invalid/double voting 
    claimsNullifier.addLeafs((electors || []).map((t) => { 
      let puk = PublicKey.fromBase58(t.accountId);
      return {
        key: ClaimElectorNullifierLeaf.key(puk, UID.toField(claim.uid)),
        value: Field(ASSIGNED),
      }
    }));
    console.log(`ClaimElectorNullifier created uid=${planUid} electors=${electors.length}`);

    // update PlanElectorNullifier to validate electors in Plan
    /*
    nullifier.addLeafs((electors || []).map((t) => { 
      let puk = PublicKey.fromBase58(t.accountId);
      return {
        key: ClaimElectorNullifierLeaf.key(puk, UID.toField(claim.uid)),
        value: Field(ASSIGNED),
      }
    }));
    console.log("Added to nullifier electors=", electors.length);
    */

    // after the Nullifier was updated we can now 
    // assign the tasks to the selected electors
    await assignTaskToElectors(claim, electors); 

    // can create here zkApp account for this claim if it was not already done
    if (!claim.accountId) {
      Sequencer.postTransaction(`claim-${claim.uid}`, {
        type: 'CREATE_CLAIM_VOTING_ACCOUNT',
        data: {
          claimUid: claim.uid,
          strategy: planStrategy
        }
      })
    }

    let result = await updateEntity("claim", claim.uid, {
      uid: claim.uid,
      state: VOTING
    });
    claim = result.proved;
  }

  // we must store the updated Nullifier (where ?)
  await saveJSON<ClaimElectorNullifier>(`claim-elector-nullifier-${planUid}`, claimsNullifier);
}


async function reAssignElectors(planUid: string) {
}
