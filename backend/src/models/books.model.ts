export interface Book {
  id: number;
  title: string;
  isbn: string;
  publishedYear: number;
  pageCount: number;
  language: string;
  description: string;
  coverImage?: string | null;
  authorId: number;
  publisherId: number;
  genres: number[];
  createdAt: Date;
  updatedAt: Date;
}