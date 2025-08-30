import nodemailer from 'nodemailer';
import { env } from './env';

let transporter: nodemailer.Transporter | null = null;

if (env.ZOHO_EMAIL && env.ZOHO_APP_PASSWORD) {
  transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: env.ZOHO_EMAIL,
      pass: env.ZOHO_APP_PASSWORD,
    },
    connectionTimeout: 10_000, // 10 seconds
    greetingTimeout: 5000, // 5 seconds
    socketTimeout: 30_000, // 30 seconds
  });
}

export const verifyEmailConnection = async () => {
  if (!transporter) {
    console.log(
      '❌ Email service not configured - ZOHO_EMAIL and ZOHO_APP_PASSWORD required'
    );
    return false;
  }

  try {
    await transporter.verify();
    console.log('✅ Email service connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Email service connection failed:', error);
    return false;
  }
};

export const sendOTP = async (to: string, otp: string) => {
  if (!transporter) {
    throw new Error(
      'Email service not configured - ZOHO_EMAIL and ZOHO_APP_PASSWORD required'
    );
  }

  if (!env.ZOHO_EMAIL) {
    throw new Error('ZOHO_EMAIL environment variable is required');
  }

  try {
    const mailOptions = {
      from: `"Oryx" <${env.ZOHO_EMAIL}>`,
      to,
      subject: 'Your Two-Factor Authentication Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0; font-size: 24px;">Oryx</h1>
            <p style="color: #666; margin: 10px 0 0 0;">Your Security Code</p>
          </div>

          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; text-align: center; margin: 20px 0;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">Verification Code</h2>
            <div style="font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${otp}
            </div>
            <p style="color: #666; margin: 20px 0 0 0; font-size: 14px;">
              This code will expire in 3 minutes for your security.
            </p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              If you didn't request this code, please ignore this email.
            </p>
            <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
              © 2024 Oryx. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: `
        Your Oryx verification code is: ${otp}

        This code will expire in 3 minutes.

        If you didn't request this code, please ignore this email.

        © 2024 Oryx. All rights reserved.
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error);
    throw new Error('Failed to send verification email');
  }
};

export const sendWelcomeEmail = async (to: string, name: string) => {
  if (!transporter) {
    throw new Error(
      'Email service not configured - ZOHO_EMAIL and ZOHO_APP_PASSWORD required'
    );
  }

  if (!env.ZOHO_EMAIL) {
    throw new Error('ZOHO_EMAIL environment variable is required');
  }

  try {
    const mailOptions = {
      from: `"Oryx" <${env.ZOHO_EMAIL}>`,
      to,
      subject: 'Welcome to Oryx!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0; font-size: 24px;">Welcome to Oryx!</h1>
          </div>

          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; text-align: center; margin: 20px 0;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Hello ${name}!</h2>
            <p style="color: #666; margin: 0; line-height: 1.6;">
              Thank you for joining Oryx. Your account has been successfully created.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}"
                style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
              Start Shopping
            </a>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 Oryx. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};
