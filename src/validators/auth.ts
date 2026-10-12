import { z } from "zod";

export const cnicRegex = /^\d{5}-\d{7}-\d{1}$/; // Format: 35201-1234567-1
export const phoneRegex = /^(?:\+92|0092|0)?3\d{9}$/; // Pakistani mobile numbers

export const registerSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number"),
  phoneNumber: z.string().regex(phoneRegex, "Must be a valid Pakistani mobile number (e.g. 03001234567)").optional().or(z.literal("")),
  cnic: z.string().regex(cnicRegex, "Must follow CNIC format: 12345-1234567-1").optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phoneNumber: z.string().regex(phoneRegex, "Invalid mobile number").optional().or(z.literal("")),
  cnic: z.string().regex(cnicRegex, "Invalid CNIC format").optional().or(z.literal("")),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});
