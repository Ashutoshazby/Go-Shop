import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.MAIL_HOST) return;

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || 'Go Shop <no-reply@goshop.dev>',
    to,
    subject,
    html
  });
};
