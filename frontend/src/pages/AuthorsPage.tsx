import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuthors } from "../api/api";
import type { AuthorWithBooks } from "../api/api";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<AuthorWithBooks[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAuthors = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAuthors(controller.signal);
        setAuthors(data);
      } catch {
        if (!controller.signal.aborted) {
          setError("Failed to load authors");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchAuthors();

    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Authors</h1>
            <p className="text-gray-500 mt-1">
              Authors and their books
            </p>
          </div>

          <Link
            to="/books"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Back to books
          </Link>
        </div>

        {loading && (
          <div className="bg-white p-5 rounded-xl shadow-sm text-blue-600">
            Loading authors...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            {error}
          </div>
        )}

        {!loading && !error && authors.length === 0 && (
          <div className="bg-white p-5 rounded-xl shadow-sm text-gray-500">
            No authors found.
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {authors.map((author) => (
              <div
                key={author.id}
                className="bg-white p-5 rounded-xl shadow-sm"
              >
                <h2 className="text-2xl font-bold text-gray-900">
                  {author.firstName} {author.lastName}
                </h2>

                <p className="text-gray-500 mb-4">
                  {author.nationality}
                </p>

                {author.books.length === 0 ? (
                  <p className="text-gray-500">No books</p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-3">
                    {author.books.map((book) => (
                      <Link
                        key={book.id}
                        to={`/books/${book.id}`}
                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition"
                      >
                        <p className="font-semibold text-gray-900">
                          {book.title}
                        </p>

                        <p className="text-sm text-gray-500">
                          {book.publishedYear} · {book.language}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          {book.genres.map((g) => g.genre.name).join(", ")}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}