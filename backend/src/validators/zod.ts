import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),

  isbn: z
    .string()
    .min(10, "ISBN must be at least 10 characters")
    .max(20, "ISBN too long"),

  publishedYear: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear()),

  pageCount: z
    .number()
    .int()
    .positive(),

  language: z.string().min(1, "Language is required"),

  description: z.string().min(1, "Description is required"),

  publisherId: z.number().int().positive(),

  authorId: z.number().int().positive(),

  genreIds: z.array(z.number().int().positive()).optional(),

  coverImage: z.string().url().optional().or(z.literal("")),
});

export const reviewSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, "Comment is required"),
});

export const updateBookSchema = createBookSchema.partial();