import { getDb } from "@/db";
import { groupInquiries } from "@/db/schema";
import { z } from "zod";

export const groupInquirySchema = z.object({
  organizationName: z.string().min(2, "Organization name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  matchId: z.string().optional(),
  requestedQuantity: z.number().int().min(10, "Minimum group size is 10 tickets").max(2000),
  categoryPreference: z.string().default("HOSPITALITY"),
  organizationType: z.enum(["CORPORATE", "SCHOOL", "CRICKET_CLUB", "COMMUNITY", "OTHER"]),
  notes: z.string().optional(),
});

export type GroupInquiryInput = z.infer<typeof groupInquirySchema>;

export async function submitGroupInquiry(input: GroupInquiryInput) {
  const db = getDb();
  const validated = groupInquirySchema.parse(input);
  const inquiryId = `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  await db.insert(groupInquiries).values({
    id: inquiryId,
    organizationName: validated.organizationName,
    contactName: validated.contactName,
    email: validated.email,
    phone: validated.phone,
    matchId: validated.matchId && validated.matchId.trim() ? validated.matchId : null,
    requestedQuantity: validated.requestedQuantity,
    categoryPreference: validated.categoryPreference,
    organizationType: validated.organizationType,
    notes: validated.notes || null,
    status: "NEW",
  });

  return {
    success: true,
    inquiryId,
    message: "Your group inquiry has been recorded. Our corporate box office desk will contact you within 24 hours.",
  };
}
