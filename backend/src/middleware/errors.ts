import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2025":
        return res.status(404).json({ error: "Resource not found" });

      case "P2002":
        return res.status(409).json({
          error: "Unique constraint failed",
          meta: err.meta,
        });
    }
  }

  return res.status(500).json({
    error: "Internal Server Error",
  });
}