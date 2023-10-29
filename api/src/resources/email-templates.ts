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


export const VoteRequestTemplate = (alias: string, taskUid: string) =>  `
<p>Hi <b>${alias}:</b></p>

<p>You have been assigned the task: <b>#${taskUid}</b> !</p>
<p>
  Please go your Socialcap app and open the tab "My tasks".
  There you can open the claiam and th evidence, so you can evaluate it and emit your vote.
</p>

<p>Thanks in advance fo your work !</>

<p>The SocialCap team.</p>

<hr/>
<p>Don’t recognize this activity? Please  contact customer support immediately.<p>
<p>This is an automated message, please do not reply.<p>
<p>© 2023 <a href="https://socialcap.app">Socialcap.app</a>, All Rights Reserved.</p>
`;
    // send notifications
    const mailBody = `
      Hi there validator,

      You have been assigned task #${task.uid} !
      Please go to the Socialcap app and open the tab "My tasks".
      There you can evaluate this claim and emit your vote,
      Thanks in advance !

      The SocialCap team.
    `;
