"use server";

import { redirect } from "next/navigation";

import { contactSchema } from "@/data/schemas";
import { sendMail } from "@/lib/mail";

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

  try {
    await sendMail({
      to: process.env.MAIL_TO,
      replyTo: validatedFields.data.email,
      subject: "AdriaVacay - upit s web stranice",
      text: message,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send email");
  }

  redirect("/message-sent");
}
