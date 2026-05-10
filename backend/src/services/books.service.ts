import prisma from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";

interface QueryParams {
  title?: string;
  language?: string;
  year?: number;
  genreId?: number;
  sortBy?: "title" | "publishedYear";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

type CreateBookInput = {
  title: string;
  isbn: string;
  publishedYear: number;
  pageCount: number;
  language: string;
  description: string;
  publisherId: number;
  authorId: number;
  genreIds?: number[];
  coverImage?: string | null;
};

type CreateReviewInput = {
  userName: string;
  rating: number;
  comment: string;
};

export async function getAllBooks(query: QueryParams) {
  const {
    title,
    language,
    year,
    genreId,
    sortBy = "title",
    order = "asc",
    page = 1,
    limit = 10,
  } = query;

  const where: Prisma.BookWhereInput = {};

  if (title) {
    where.title = {
      contains: String(title),
      mode: "insensitive",
    };
  }

  if (language) {
    where.language = String(language);
  }

  if (year) {
    where.publishedYear = Number(year);
  }

  if (genreId) {
    where.genres = {
      some: {
        genreId: Number(genreId),
      },
    };
  }

  const totalItems = await prisma.book.count({ where });

  const books = await prisma.book.findMany({
    where,
    include: {
      author: true,
      publisher: true,
      genres: {
        include: {
          genre: true,
        },
      },
    },
    orderBy: {
      [sortBy]: order,
    },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });

  return {
    data: books,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(totalItems / Number(limit)),
      totalItems,
      itemsPerPage: Number(limit),
      hasNextPage: Number(page) * Number(limit) < totalItems,
      hasPreviousPage: Number(page) > 1,
    },
  };
}

export async function getBookById(bookId: number) {
  return prisma.book.findUnique({
    where: {
      id: bookId,
    },
    include: {
      author: true,
      publisher: true,
      genres: {
        include: {
          genre: true,
        },
      },
      reviews: true,
    },
  });
}

export async function createBook(data: CreateBookInput) {
  const createData: Prisma.BookCreateInput = {
    title: data.title,
    isbn: data.isbn,
    publishedYear: data.publishedYear,
    pageCount: data.pageCount,
    language: data.language,
    description: data.description,
    coverImage: data.coverImage ?? null,
    author: {
      connect: {
        id: data.authorId,
      },
    },
    publisher: {
      connect: {
        id: data.publisherId,
      },
    },
  };

  if (data.genreIds && data.genreIds.length > 0) {
    createData.genres = {
      create: data.genreIds.map((id) => ({
        genre: {
          connect: {
            id,
          },
        },
      })),
    };
  }

  return prisma.book.create({
    data: createData,
    include: {
      author: true,
      publisher: true,
      genres: {
        include: {
          genre: true,
        },
      },
    },
  });
}

export async function updateBook(
  bookId: number,
  data: Prisma.BookUpdateInput & {
    genreIds?: number[];
  }
) {
  const { genreIds, ...bookData } = data;

  return prisma.book.update({
    where: {
      id: bookId,
    },
    data: {
      ...bookData,
      genres: genreIds
        ? {
            deleteMany: {},
            create: genreIds.map((id) => ({
              genre: {
                connect: {
                  id,
                },
              },
            })),
          }
        : undefined,
    },
    include: {
      author: true,
      publisher: true,
      genres: {
        include: {
          genre: true,
        },
      },
    },
  });
}

export async function deleteBook(bookId: number) {
  return prisma.book.delete({
    where: {
      id: bookId,
    },
  });
}

export async function createReview(bookId: number, data: CreateReviewInput) {
  return prisma.review.create({
    data: {
      userName: data.userName,
      rating: data.rating,
      comment: data.comment,
      bookId,
    },
  });
}

export async function getReviewsByBook(bookId: number) {
  return prisma.review.findMany({
    where: {
      bookId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAverageRating(bookId: number) {
  const result = await prisma.review.aggregate({
    where: {
      bookId,
    },
    _avg: {
      rating: true,
    },
  });

  return result._avg.rating ?? 0;
}

export async function getAllAuthors() {
  return prisma.author.findMany({
    orderBy: {
      lastName: "asc",
    },
    include: {
      books: {
        include: {
          author: true,
          publisher: true,
          genres: {
            include: {
              genre: true,
            },
          },
        },
      },
    },
  });
}

export async function deleteReview(reviewId: number) {
  return prisma.review.delete({
    where: {
      id: reviewId,
    },
  });
}

export async function getAllGenres() {
  return prisma.genre.findMany({
    orderBy: {
      name: "asc",
    },
  });
}