interface SendEmailParams {
    email: string;
    subject: string;
    text: string;
    html?: string;
}
export declare function sendEmail({ email, subject, text, html, }: SendEmailParams): Promise<void>;
export {};
