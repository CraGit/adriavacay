"use server";

import { format } from "date-fns";
import { z } from "zod";
import mail from "@sendgrid/mail";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/prismicio";

const bookingSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  guests: z.number().int().positive(),
  dateFrom: z.string().min(1).date(),
  dateTo: z.string().min(1).date(),
});

mail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function submitBooking(uid, dateRange, guests, formData) {
  const validatedFields = bookingSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    dateFrom: format(dateRange.from, "yyyy-MM-dd"),
    dateTo: format(dateRange.to, "yyyy-MM-dd"),
    guests,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const client = createClient();
  const page = await client
    .getByUID("accommodation_single", uid)
    .catch(() => notFound());

  const message = `
    Name: ${validatedFields.data.name}\r\n
    Email: ${validatedFields.data.email}\r\n
    Guests: ${validatedFields.data.guests}\r\n
    Date from: ${validatedFields.data.dateFrom}\r\n
    Date to: ${validatedFields.data.dateTo}\r\n
    Villa: ${page.data.heading}
  `;

  const data = {
    to: "adriavacay@gmail.com",
    from: "adriavacaycom@gmail.com",
    replyTo: {
      email: validatedFields.data.email,
      name: validatedFields.data.name,
    },
    subject: "AdriaVacay - upit za rezervacija vile",
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
