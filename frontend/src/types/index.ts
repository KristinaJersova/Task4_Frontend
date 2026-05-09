export interface Author {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface BookGenre {
  genre: Genre;
}

export interface Publisher {
  id: number;
  name: string;
}

export interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Book {
  id: number;
  title: string;
  isbn: string;
  publishedYear: number;
  pageCount: number;
  language: string;
  description: string;
  coverImage?: string;

  author: Author;
  publisher: Publisher;

  genres: BookGenre[];
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BooksResponse {
  data: Book[];
  pagination: PaginationData;
}