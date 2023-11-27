import formData from 'form-data';
import Mailgun from "mailgun.js";
import { logger } from "../global.js";

interface SendEmailParams {
  email: string;
  subject: string;
  text: string;
  html?: string;
}


export async function sendEmail ({
  email,
  subject,
  text,
  html,
}: SendEmailParams) {

  const mailgun = (new Mailgun(formData)).client({
    username: 'api', 
    key: process.env.MAILGUN_API_KEY as string
  });
  
  mailgun.messages.create(
    process.env.MAILGUN_DOMAIN as string, 
    {
      from: `${process.env.MAILGUN_USER_DESCRIPTION} <${process.env.MAILGUN_USER}>`,
      to: [email],
      subject: subject,
      text: text,
      html: html || text
    }
  )
  .then((msg) => {
    // logs response data
    console.log("Emailed ", msg);
  }) 
  .catch((err) => {
    // logs any error
    console.error(err)
  });

  // return sgMail.send(msg);
}
