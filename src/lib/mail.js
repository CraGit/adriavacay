import nodemailer from "nodemailer";
import { render } from "@react-email/render";

function isEthereal() {
  return process.env.MAIL_HOST?.includes("ethereal.email");
}

function assertMailConfig() {
  const missing = ["MAIL_HOST", "MAIL_USER", "MAIL_PASSWORD"].filter(
    (key) => !process.env[key]
  );
  if (missing.length > 0) {
    throw new Error(
      `Mail is not configured. Set ${missing.join(", ")} in your environment.`
    );
  }
}

function resolveMailTransportOptions() {
  assertMailConfig();

  const port = Number(process.env.MAIL_PORT) || 587;
  let secure;
  if (process.env.MAIL_SECURE === "true") {
    secure = true;
  } else if (process.env.MAIL_SECURE === "false") {
    secure = false;
  } else {
    secure = port === 465;
  }

  // Port 587 uses STARTTLS (plain socket, then upgrade). Implicit TLS on 587
  // causes: SSL routines: wrong version number
  if (port === 587 && secure) {
    console.warn(
      "[mail] MAIL_PORT=587 uses STARTTLS — treating MAIL_SECURE as false"
    );
    secure = false;
  }

  const options = {
    host: process.env.MAIL_HOST,
    port,
    secure,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  };

  if (!secure && (port === 587 || port === 25)) {
    options.requireTLS = true;
  }

  return options;
}

function resolveFromAddress() {
  const configured = process.env.MAIL_FROM || process.env.MAIL_USER;
  // Ethereal only reliably delivers when the From matches the auth account.
  if (isEthereal() && process.env.MAIL_USER && !configured.includes(process.env.MAIL_USER)) {
    const label = configured.includes("<") ? configured.split("<")[0].trim() : "AdriaVacay";
    return `${label} <${process.env.MAIL_USER}>`;
  }
  return configured;
}

function plainTextFallback(text) {
  if (!text) return undefined;
  return text.replace(/\r\n/g, "\n").replace(/\n/g, "<br>\n");
}

export function createMailTransporter() {
  return nodemailer.createTransport(resolveMailTransportOptions());
}

/**
 * @param {{ to: string, subject: string, text?: string, html?: string, react?: import('react').ReactElement, replyTo?: string, cc?: string }} options
 */
export async function sendMail({ to, subject, text, html, react, replyTo, cc }) {
  if (!to) {
    throw new Error("Mail recipient (to) is required");
  }

  let htmlBody = html;
  if (react) {
    htmlBody = await render(react);
  }
  if (!htmlBody) {
    htmlBody = plainTextFallback(text);
  }

  const transporter = createMailTransporter();
  const mailOptions = {
    from: resolveFromAddress(),
    to,
    subject,
    text,
    html: htmlBody,
    replyTo,
    cc,
  };
  const info = await transporter.sendMail(mailOptions);

  if (isEthereal()) {
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) {
      console.info(`[mail] Ethereal preview: ${preview}`);
    }
  }

  return info;
}
