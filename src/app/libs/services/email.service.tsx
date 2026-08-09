import { Users } from '@prisma/client';
import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const resend = new Resend(apiKey);

const emailFrom = process.env.RESEND_EMAIL_FROM || '';

const nextPublicAppUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export async function sendPasswordResetEmailService(
  user: Users,
  emailToSend: string,
  resetUrl: string,
  isAdminEmail: boolean = false,
) {
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not defined');
  }
  const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
           <div style="text-align: center; padding: 20px 0;">
          <img src="${nextPublicAppUrl + '/flowsups.png'}" 
            alt="Logo flowsups" style="max-width: 150px; height: auto;">
           </div>
           <h2 style="color: #0056b3; text-align: center;">${!isAdminEmail ? `Hello ${user.name}!` : ''}</h2>
            <p style="text-align: center;">${
              isAdminEmail
                ? `You are receiving this email because a password reset was requested for the user account of: <span style="font-weight: bold;">${
                    user.name + ' ' + user.last_name
                  }'s (${user.email})</span>`
                : `We have received a request to reset the password for your account.`
            }</p>
            <p style="text-align: center;">Click the button below to reset ${
              isAdminEmail ? `${user.name}'s` : `your`
            } password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                style="background-color: #00a78b; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;"
              >
                Reset Password
              </a>
            </div>
            <p style="text-align: center;">Thank you,<br> The FlowSups team</p>
            <div style="text-align: center; margin-top: 40px; font-size: 0.8em; color: #777;">
              <p>&copy; ${new Date().getFullYear()} FlowSups. All rights reserved.</p>
            </div>
     </div>`;

  const { data, error } = await resend.emails.send({
    from: emailFrom,
    to: [emailToSend],
    subject: 'Reset Password',
    html: html,
  });

  if (error) {
    throw new Error('Failed to send reset password email');
  }
}
