import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1),

  isbn: z
    .string()
    .min(10, "ISBN must be at least 10 characters")
    .max(20, "ISBN too long"),

  publishedYear: z.number(),
  pageCount: z.number(),
  language: z.string(),
  description: z.string(),
  publisherId: z.number(),
  authorId: z.number(),
  genreIds: z.array(z.number()).optional(),
  coverImage: z.string().optional(),
});

export const reviewSchema = z.object({
  userName: z
    .string()
    .min(1, "Username is required"),

  rating: z
    .number()
    .min(1)
    .max(5),

  comment: z
    .string()
    .min(1, "Comment is required"),
});

export const updateBookSchema =
  createBookSchema.partial();