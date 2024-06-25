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

export const InviteToSocialcapTemplate = (sender: string, email: string) =>  `
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #dddddd;
            border-radius: 5px;
        }
        .header {
            text-align: center;
            background-color: #1758FE;
            color: white;
            padding: 10px 0;
            border-radius: 5px 5px 0 0;
        }
        .header h1 {
            margin: 0;
        }
        .content {
            padding: 20px;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
        }
        .button-container {
            text-align: center;
            margin: 20px 0;
        }
        .button-container a {
            background-color: #1758FE;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding: 10px 0;
            color: #777777;
            font-size: 12px;
            border-top: 1px solid #dddddd;
        }
    </style>
</head>
<body>
<div class="email-container">
<div class="header">
    <h1>You have been invited to join Socialcap!</h1>
</div>
<div class="content">
    <p>${sender} has invited you to join Socialcap!</p>
    <p>Click the button below to join now and start exploring:</p>
    <div class="button-container">
        <a href="https://my-socialcap-dev.vercel.app/signup/" target="_blank">Join Now</a>
    </div>
    <p>If you have any questions, feel free to reach out to us at hello@socialcap.app.</p>
    <p>Best regards,</p>
    <p>The Socialcap Team</p>
</div>
<div class="footer">
    <p>&copy; 2024 Socialcap. All rights reserved.</p>
</div>
</div>
</body>
`;


