"use server";

import nodemailer from "nodemailer";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/prismicio";
import { bookingSchema } from "@/data/schemas";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE === "true",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export async function submitBooking(uid, dateRange, guests, formData) {
  const validatedFields = bookingSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
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

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_TO,
    replyTo: validatedFields.data.email,
    subject: "AdriaVacay - upit za rezervacija vile",
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
