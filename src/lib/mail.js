import nodemailer from "nodemailer";

export function createMailTransporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE === "true",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });
}

export async function sendMail({ to, subject, text, replyTo, cc }) {
  const transporter = createMailTransporter();
  const mailOptions = {
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to,
    subject,
    text,
    html: text.replace(/\r\n/g, "<br>"),
    replyTo,
    cc,
  };
  await transporter.sendMail(mailOptions);
}
