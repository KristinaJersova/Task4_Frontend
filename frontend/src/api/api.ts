import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default api;

export interface Book {
  id: number;
  title: string;
  publishedYear: number;
  language: string;
  author: { firstName: string; lastName: string };
}

export interface BookResponse {
  data: Book[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
}

export const getBooks = (params?: any) =>
  api.get<BookResponse>("/books", { params });

export const getBook = (id: number) =>
  api.get(`/books/${id}`);

export const deleteBook = (id: number) =>
  api.delete(`/books/${id}`);

export const getReviews = (id: number) =>
  api.get(`/books/${id}/reviews`);

export const createReview = (id: number, data: any) =>
  api.post(`/books/${id}/reviews`, data);

export const getAverageRating = (id: number) =>
  api.get(`/books/${id}/average-rating`);