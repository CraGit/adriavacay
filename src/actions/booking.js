"use server";

import { format } from "date-fns";
import mail from "@sendgrid/mail";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/prismicio";
import { bookingSchema } from "@/data/schemas";

mail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function submitBooking(uid, dateRange, guests, formData) {
  const validatedFields = bookingSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    //dateFrom: format(dateRange.from, "yyyy-MM-dd"),
    //dateTo: format(dateRange.to, "yyyy-MM-dd"),
    dateFrom: dateRange.from,
    dateTo: dateRange.to,
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
    to: process.env.MAIL_TO,
    from: process.env.MAIL_FROM,
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
