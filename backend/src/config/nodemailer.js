import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendOTPEmail = async ({ to, subject, otp, purpose }) => {
  const purposeText =
    purpose === "verify"
      ? "verify your email address"
      : "reset your password";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border-radius: 16px; border: 1px solid #e5e7eb; background: #ffffff;">
      <h2 style="font-size: 22px; font-weight: 900; color: #111827; margin-bottom: 4px;">Talkora</h2>
      <p style="color: #6b7280; font-size: 14px; margin-bottom: 32px;">Language learning, reimagined.</p>
      <p style="font-size: 15px; color: #374151;">Use the OTP below to ${purposeText}:</p>
      <div style="text-align: center; margin: 24px 0;">
        <span style="display: inline-block; font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #4f46e5; background: #f5f3ff; padding: 16px 32px; border-radius: 12px; border: 1px solid #e0e7ff;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 13px; color: #9ca3af; text-align: center;">This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Talkora" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
};