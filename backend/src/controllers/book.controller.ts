import { Request, Response, NextFunction } from "express";
import * as bookService from "../services/books.service";
import {
  createBookSchema,
  updateBookSchema,
  reviewSchema,
} from "../validators/zod";

export async function getBooksHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await bookService.getAllBooks(req.query);

    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getBookByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const book = await bookService.getBookById(
      Number(req.params.bookId)
    );

    if (!book) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    res.json(book);
  } catch (err) {
    next(err);
  }
}

export async function createBookHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createBookSchema.parse(req.body);

    const book =
      await bookService.createBook(data);

    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
}

export async function updateBookHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data =
      updateBookSchema.parse(req.body);

    const book =
      await bookService.updateBook(
        Number(req.params.bookId),
        data
      );

    res.json(book);
  } catch (err) {
    next(err);
  }
}

export async function deleteBookHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await bookService.deleteBook(
      Number(req.params.bookId)
    );

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function createReviewHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = reviewSchema.parse(req.body);

    const review =
      await bookService.createReview(
        Number(req.params.bookId),
        data
      );

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
}

export async function getReviewsByBookHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reviews =
      await bookService.getReviewsByBook(
        Number(req.params.bookId)
      );

    res.json(reviews);
  } catch (err) {
    next(err);
  }
}

export async function getAverageRatingHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const rating =
      await bookService.getAverageRating(
        Number(req.params.bookId)
      );

    res.json({
      averageRating: rating,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAuthorsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authors =
      await bookService.getAllAuthors();

    res.json(authors);
  } catch (err) {
    next(err);
  }
}

export async function deleteReviewHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await bookService.deleteReview(
      Number(req.params.reviewId)
    );

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}


export async function getGenresHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const genres = await bookService.getAllGenres();

    res.json(genres);
  } catch (err) {
    next(err);
  }
}