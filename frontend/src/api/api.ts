import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default api;

export interface Author {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Publisher {
  id: number;
  name: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface BookGenre {
  id: number;
  genre: {
    id: number;
    name: string;
  };
}

export interface Book {
  id: number;
  title: string;
  isbn: string;
  publishedYear: number;
  language: string;
  pageCount: number;
  description: string;
  coverImage?: string | null;
  author: Author;
  publisher: Publisher;
  genres: BookGenre[];
}

export interface Review {
  id: number;
  bookId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AuthorWithBooks {
  id: number;
  firstName: string;
  lastName: string;
  nationality: string;
  books: Book[];
}

export interface BooksQueryParams {
  title?: string;
  language?: string;
  year?: number;
  genreId?: number;
  sortBy?: "title" | "publishedYear";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface BooksResponse {
  data: Book[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CreateBookDTO {
  title: string;
  isbn: string;
  publishedYear: number;
  pageCount: number;
  language: string;
  description: string;
  publisherId: number;
  authorId: number;
  genreIds?: number[];
  coverImage?: string;
}

export interface UpdateBookDTO {
  title?: string;
  isbn?: string;
  publishedYear?: number;
  pageCount?: number;
  language?: string;
  description?: string;
  publisherId?: number;
  authorId?: number;
  genreIds?: number[];
  coverImage?: string;
}

export interface CreateReviewDTO {
  userName: string;
  rating: number;
  comment: string;
}

export const getBooks = async (
  params: BooksQueryParams,
  signal?: AbortSignal
): Promise<BooksResponse> => {
  const cleanParams: BooksQueryParams = {
    ...params,
    title: params.title || undefined,
    language: params.language || undefined,
    genreId: params.genreId || undefined,
  };

  const res = await api.get<BooksResponse>("/books", {
    params: cleanParams,
    signal,
  });

  return res.data;
};

export const getGenres = async (signal?: AbortSignal): Promise<Genre[]> => {
  const res = await api.get<Genre[]>("/genres", {
    signal,
  });

  return res.data;
};

export const getBookById = async (
  id: number,
  signal?: AbortSignal
): Promise<Book> => {
  const res = await api.get<Book>(`/books/${id}`, {
    signal,
  });

  return res.data;
};

export const createBook = async (data: CreateBookDTO): Promise<Book> => {
  const res = await api.post<Book>("/books", data);
  return res.data;
};

export const updateBook = async (
  id: number,
  data: UpdateBookDTO
): Promise<Book> => {
  const res = await api.put<Book>(`/books/${id}`, data);
  return res.data;
};

export const deleteBook = async (id: number): Promise<void> => {
  await api.delete(`/books/${id}`);
};

export const getReviews = async (
  id: number,
  signal?: AbortSignal
): Promise<Review[]> => {
  const res = await api.get<Review[]>(`/books/${id}/reviews`, {
    signal,
  });

  return res.data;
};

export const createReview = async (
  id: number,
  data: CreateReviewDTO
): Promise<Review> => {
  const res = await api.post<Review>(`/books/${id}/reviews`, data);
  return res.data;
};

export const getAverageRating = async (
  id: number,
  signal?: AbortSignal
): Promise<{ averageRating: number }> => {
  const res = await api.get<{ averageRating: number }>(
    `/books/${id}/average-rating`,
    {
      signal,
    }
  );

  return res.data;
};

export const getAuthors = async (
  signal?: AbortSignal
): Promise<AuthorWithBooks[]> => {
  const res = await api.get<AuthorWithBooks[]>("/authors", {
    signal,
  });

  return res.data;
};

export const deleteReview = async (reviewId: number): Promise<void> => {
  await api.delete(`/reviews/${reviewId}`);
};