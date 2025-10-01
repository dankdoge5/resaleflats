import { z } from 'zod';

// Authentication validation schemas
export const loginSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password must be less than 128 characters" }),
});

export const signupSchema = z.object({
  fullName: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" }),
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone: z.string()
    .trim()
    .regex(/^[0-9+\-\s()]*$/, { message: "Invalid phone number format" })
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(20, { message: "Phone number must be less than 20 characters" })
    .optional()
    .or(z.literal('')),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password must be less than 128 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Property validation schemas
export const propertySchema = z.object({
  title: z.string()
    .trim()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(200, { message: "Title must be less than 200 characters" }),
  description: z.string()
    .trim()
    .max(2000, { message: "Description must be less than 2000 characters" })
    .optional()
    .or(z.literal('')),
  location: z.string()
    .trim()
    .min(3, { message: "Location must be at least 3 characters" })
    .max(200, { message: "Location must be less than 200 characters" }),
  price: z.number()
    .positive({ message: "Price must be a positive number" })
    .max(999999, { message: "Price seems unrealistic, please check" }),
  bedrooms: z.number()
    .int()
    .min(1, { message: "At least 1 bedroom required" })
    .max(20, { message: "Maximum 20 bedrooms allowed" }),
  bathrooms: z.number()
    .int()
    .min(1, { message: "At least 1 bathroom required" })
    .max(20, { message: "Maximum 20 bathrooms allowed" }),
  area_sqft: z.number()
    .int()
    .positive({ message: "Area must be a positive number" })
    .max(100000, { message: "Area seems unrealistic, please check" })
    .optional(),
  property_type: z.enum(['apartment', 'independent_house', 'villa', 'penthouse', 'studio']),
  furnished_status: z.enum(['unfurnished', 'semi_furnished', 'fully_furnished']),
});

// Contact request validation schema
export const contactRequestSchema = z.object({
  message: z.string()
    .trim()
    .max(1000, { message: "Message must be less than 1000 characters" })
    .optional()
    .or(z.literal('')),
});

// Export types
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type ContactRequestInput = z.infer<typeof contactRequestSchema>;
