import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

export const bookingSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  guests: z.number().int().positive(),
  dateFrom: z.string().min(1).date(),
  dateTo: z.string().min(1).date(),
});
