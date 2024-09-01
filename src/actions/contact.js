"use server";

import mail from "@sendgrid/mail";
import { redirect } from "next/navigation";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

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
    //to: "adriavacay@gmail.com",
    to: "skruzic@gmail.com",
    from: "adriavacaycom@gmail.com",
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
