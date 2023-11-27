import { Field } from "o1js";
import { UID, ASSIGNED, UTCDateTime } from "@socialcap/contracts";
import { prisma } from "../global.js";
import { updateEntity } from "../dbs/any-entity-helpers.js";
export { assignTaskToElectors };
async function assignTaskToElectors(claim, electors) {
    // first remove all previous tasks assigned to this claim
    let previous = await prisma.task.findMany({ where: { claimUid: claim.uid } });
    (previous || []).forEach(async (t) => {
        await prisma.task.delete({ where: { uid: t.uid } });
    });
    (electors || []).forEach(async (elector) => {
        const now = UTCDateTime.now(); // millisecs since 1970
        const due = BigInt(10 * 24 * 60 * 60 * 1000) + now.toBigInt(); // 10 days
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
        };
        let params = task;
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
    });
}
//# sourceMappingURL=voting-assignments.js.map