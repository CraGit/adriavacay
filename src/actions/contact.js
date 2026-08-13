"use server";

import { createElement } from "react";
import { redirect } from "next/navigation";

import { contactSchema } from "@/data/schemas";
import { ContactNotificationEmail } from "@/emails/enquiry";
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

  const data = validatedFields.data;
  const message = `
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}
Message: ${data.message}
`.trim();

  try {
    await sendMail({
      to: process.env.MAIL_TO,
      replyTo: data.email,
      subject: "AdriaVacay - upit s web stranice",
      text: message,
      react: createElement(ContactNotificationEmail, {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      }),
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send email");
  }

  redirect("/message-sent");
}
