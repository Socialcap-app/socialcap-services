
import { sendEmail } from "../services/email-service.js";
import { hasResult } from "../responses.js";
import { InviteToSocialcapTemplate } from "../resources/email-templates.js";
import { prisma } from "../global.js";


export async function invite(params: { recipients: string, user: any }) {
    const { recipients, user } = params;
    const recipientsArray = recipients.split(",");
    const senderUid = user.uid;
    const sender = await prisma.person.findUnique({
        where: { uid: senderUid },
    });
    
    for (const recipient of recipientsArray) {
        console.log("sending invites to", recipient, "from", senderUid, sender?.fullName);
        await sendEmail({
            email: recipient,
            subject: "Your have been invited to join Socialcap",
            text: "This is your invitation to join Socialcap",
            html: InviteToSocialcapTemplate(sender?.fullName!, recipient),
        });
    }

    return hasResult({
        recipients: recipients
    });
}
