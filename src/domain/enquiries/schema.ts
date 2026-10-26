import { z } from "zod";

export const enquirySchema = z.object({
  listingId: z.string().min(1),
  name: z.string().trim().min(2).max(80),
  email: z.email(),
  phone: z.string().trim().min(6).max(20),
  message: z.string().trim().max(1000).optional(),
});

export type EnquiryPayload = z.infer<typeof enquirySchema>;
