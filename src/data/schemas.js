import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email(),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }),
});

export const bookingSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email(),
  guests: z.coerce
    .number({ message: "Number of guests is required" })
    .int()
    .positive({ message: "Number of guests is required" }),
  dateFrom: z.date({ message: "From date is required" }),
  dateTo: z.date({ message: "To date is required" }),
});
