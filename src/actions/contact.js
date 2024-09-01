"use server";

import mail from "@sendgrid/mail";
import { redirect } from "next/navigation";

import { contactSchema } from "@/data/schemas";

mail.setApiKey(process.env.SENDGRID_API_KEY || "");

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

  const data = {
    to: process.env.MAIL_TO,
    from: process.env.MAIL_FROM,
    replyTo: {
      email: validatedFields.data.email,
      name: validatedFields.data.name,
    },
    subject: "AdriaVacay - upit s web stranice",
    text: message,
    html: message.replace(/\r\n/g, "<br>"),
  };

  try {
    await mail.send(data);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send email");
  }

  redirect("/message-sent");
}
