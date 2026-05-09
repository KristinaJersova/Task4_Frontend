import prisma from "../lib/prisma";

interface QueryParams {
  title?: string;
  language?: string;
  year?: number;
  sortBy?: "title" | "publishedYear";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export async function getAllBooks(query: QueryParams) {
  const {
    title,
    language,
    year,
    sortBy = "title",
    order = "asc",
    page = 1,
    limit = 10,
  } = query;

  const where: any = {};

  if (title) {
    where.title = { contains: title, mode: "insensitive" };
  }

  if (language) {
    where.language = language;
  }

  if (year) {
    where.publishedYear = Number(year);
  }

  const totalItems = await prisma.book.count({ where });

  const books = await prisma.book.findMany({
    where,
    include: {
      author: true,
      publisher: true,
      genres: {
        include: { genre: true },
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
    where: { id: bookId },
    include: {
      author: true,
      publisher: true,
      genres: { include: { genre: true } },
      reviews: true,
    },
  });
}

export async function createBook(data: {
  title: string;
  isbn: string;
  publishedYear: number;
  pageCount: number;
  language: string;
  description: string;
  publisherId: number;
  authorId?: number;
  genreIds?: number[];
  coverImage?: string;
}) {
  const createData: any = {
    title: data.title,
    isbn: data.isbn,
    publishedYear: data.publishedYear,
    pageCount: data.pageCount,
    language: data.language,
    description: data.description,
    coverImage: data.coverImage,

    publisher: {
      connect: { id: data.publisherId },
    },
  };

  if (data.authorId) {
    createData.author = {
      connect: { id: data.authorId },
    };
  }

  if (data.genreIds) {
    createData.genres = {
      create: data.genreIds.map((id) => ({
        genre: { connect: { id } },
      })),
    };
  }

  return prisma.book.create({
    data: createData,
    include: {
      author: true,
      publisher: true,
      genres: { include: { genre: true } },
    },
  });
}

export async function updateBook(bookId: number, data: any) {
  return prisma.book.update({
    where: { id: bookId },
    data: {
      ...data,
      genres: data.genreIds
        ? {
            deleteMany: {},
            create: data.genreIds.map((id: number) => ({
              genre: { connect: { id } },
            })),
          }
        : undefined,
    },
    include: {
      author: true,
      publisher: true,
      genres: { include: { genre: true } },
    },
  });
}

export async function deleteBook(bookId: number) {
  return prisma.book.delete({
    where: { id: bookId },
  });
}

export async function createReview(bookId: number, data: any) {
  return prisma.review.create({
    data: {
      ...data,
      bookId,
    },
  });
}

export async function getReviewsByBook(bookId: number) {
  return prisma.review.findMany({
    where: { bookId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAverageRating(bookId: number) {
  const result = await prisma.review.aggregate({
    where: { bookId },
    _avg: { rating: true },
  });

  return result._avg.rating ?? 0;
}