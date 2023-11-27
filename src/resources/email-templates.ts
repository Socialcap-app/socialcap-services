/**
 * Email templates 
 * 
 * Use:
 * ~~~
 *    import { OTPTemplate } from "../resources/email-otp-template.js"
 *    ...
 *    let content = templates.OTP("Leandro M.", "leomanza@gg.com", "1234567");
 *    ...  
 * ~~~
 */

const OTPStyle = `
  display: inline-block;
  font-size: 1.125em;
  padding: 0.125em 0.5em;
  border: 1px solid #ccc;
  border-radius: 0.25em;
  color: #fea217;
`;

export const OTPTemplate = (alias: string, email: string, OTP: string) =>  `
<p>Welcome <b>${alias}:</b></p>

<p>This is your login verification code: 
  <b style="${OTPStyle}">${OTP}</b>
</p>

<p>The verification code will be valid for 30 minutes. Please do not share 
this code with anyone.</p>

<p>Don’t recognize this activity? Please  contact customer support immediately.<p>

<p>This is an automated message, please do not reply.<p>

<hr/>
© 2023 <a href="https://socialcap.app">Socialcap.app</a>, All Rights Reserved.
`;
