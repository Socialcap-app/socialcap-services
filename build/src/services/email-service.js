import formData from 'form-data';
import Mailgun from "mailgun.js";
export async function sendEmail({ email, subject, text, html, }) {
    const mailgun = (new Mailgun(formData)).client({
        username: 'api',
        key: process.env.MAILGUN_API_KEY
    });
    mailgun.messages.create(process.env.MAILGUN_DOMAIN, {
        from: `${process.env.MAILGUN_USER_DESCRIPTION} <${process.env.MAILGUN_USER}>`,
        to: [email],
        subject: subject,
        text: text,
        html: html || text
    })
        .then((msg) => {
        // logs response data
        console.log("Emailed ", msg);
    })
        .catch((err) => {
        // logs any error
        console.error(err);
    });
    // return sgMail.send(msg);
}
//# sourceMappingURL=email-service.js.map