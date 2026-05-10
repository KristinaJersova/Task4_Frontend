import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { deleteBook, getBooks } from "../api/api";
import type { Book, BooksQueryParams } from "../api/api";

import BookCard from "../components/BooksCard";

type FilterValue = string | number | undefined;

export default function BooksPage() {
  const navigate = useNavigate();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<BooksQueryParams>({
    title: "",
    language: "",
    year: undefined,
    sortBy: "title",
    order: "asc",
    page: 1,
    limit: 5,
  });

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getBooks(filters, controller.signal);

        setBooks(data.data);
        setTotalPages(data.pagination.totalPages || 1);
      } catch {
        if (!controller.signal.aborted) {
          setError("Failed to load books");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchBooks();

    return () => controller.abort();
  }, [filters]);

  const updateFilter = (key: keyof BooksQueryParams, value: FilterValue) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleSortChange = (value: string) => {
    const [sortBy, order] = value.split("-");

    if (
      (sortBy === "title" || sortBy === "publishedYear") &&
      (order === "asc" || order === "desc")
    ) {
      setFilters((prev) => ({
        ...prev,
        sortBy,
        order,
        page: 1,
      }));
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm("Delete this book?");
    if (!confirmed) return;

    try {
      setError(null);
      await deleteBook(id);

      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch {
      setError("Failed to delete book");
    }
  };

  const currentPage = filters.page ?? 1;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-5 rounded-xl shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Books</h1>
            <p className="text-gray-500 mt-1">
              Search, sort and manage library books
            </p>
          </div>

          <button
            onClick={() => navigate("/books/new")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm"
          >
            Lisa raamat
          </button>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="grid md:grid-cols-4 gap-3">
            <input
              className="border border-gray-300 p-2 rounded-lg"
              placeholder="Title"
              value={filters.title ?? ""}
              onChange={(e) => updateFilter("title", e.target.value)}
            />

            <input
              className="border border-gray-300 p-2 rounded-lg"
              placeholder="Language"
              value={filters.language ?? ""}
              onChange={(e) => updateFilter("language", e.target.value)}
            />

            <input
              type="number"
              className="border border-gray-300 p-2 rounded-lg"
              placeholder="Year"
              value={filters.year ?? ""}
              onChange={(e) =>
                updateFilter(
                  "year",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            />

            <select
              className="border border-gray-300 p-2 rounded-lg"
              value={`${filters.sortBy}-${filters.order}`}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="title-asc">Title ↑</option>
              <option value="title-desc">Title ↓</option>
              <option value="publishedYear-asc">Year ↑</option>
              <option value="publishedYear-desc">Year ↓</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="bg-white p-5 rounded-xl shadow-sm text-blue-600">
            Loading books...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            {error}
          </div>
        )}

        {!loading && !error && books.length === 0 && (
          <div className="bg-white p-5 rounded-xl shadow-sm text-gray-500">
            No books found.
          </div>
        )}

        {!loading && !error && books.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} onDelete={handleDelete} />
            ))}
          </div>
        )}

        <div className="flex justify-center items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
          <button
            disabled={currentPage <= 1}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: Math.max((prev.page ?? 1) - 1, 1),
              }))
            }
            className="border border-gray-300 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Prev
          </button>

          <span className="text-gray-700">
            Page {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage >= totalPages}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: Math.min((prev.page ?? 1) + 1, totalPages),
              }))
            }
            className="border border-gray-300 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}