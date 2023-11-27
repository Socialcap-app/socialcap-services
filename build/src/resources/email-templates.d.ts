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
export declare const OTPTemplate: (alias: string, email: string, OTP: string) => string;
