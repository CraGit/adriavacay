"use server";

import nodemailer from "nodemailer";
import { redirect } from "next/navigation";

import { contactSchema } from "@/data/schemas";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE === "true",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export async function submit(formData) {
  const validatedFields = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const message = `
    Name: ${validatedFields.data.name}\r\n
    Email: ${validatedFields.data.email}\r\n
    Subject: ${validatedFields.data.subject}\r\n
    Message: ${validatedFields.data.message}
  `;

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_TO,
    replyTo: validatedFields.data.email,
    subject: "AdriaVacay - upit s web stranice",
    text: message,
    html: message.replace(/\r\n/g, "<br>"),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send email");
  }

  redirect("/message-sent");
}
