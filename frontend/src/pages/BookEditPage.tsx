import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBookById, updateBook } from "../api/api";
import type { CreateBookDTO } from "../api/api";

export default function BookEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateBookDTO | null>(null);
  const [genreIdsInput, setGenreIdsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookId = Number(id);

  useEffect(() => {
    if (!id || Number.isNaN(bookId)) {
      setError("Invalid book id");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadBook = async () => {
      try {
        setLoading(true);
        setError(null);

        const book = await getBookById(bookId, controller.signal);

        setForm({
          title: book.title,
          isbn: book.isbn,
          publishedYear: book.publishedYear,
          pageCount: book.pageCount,
          language: book.language,
          description: book.description,
          publisherId: book.publisher.id,
          authorId: book.author.id,
          genreIds: book.genres.map((item) => item.genre.id),
          coverImage: book.coverImage ?? "",
        });

        setGenreIdsInput(book.genres.map((item) => item.genre.id).join(","));
      } catch {
        if (!controller.signal.aborted) {
          setError("Failed to load book");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadBook();

    return () => controller.abort();
  }, [id, bookId]);

  const updateField = <K extends keyof CreateBookDTO>(
    key: K,
    value: CreateBookDTO[K]
  ) => {
    setForm((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const parseGenreIds = (value: string): number[] => {
    return value
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((genreId) => Number.isInteger(genreId) && genreId > 0);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form) return;

    try {
      setSaving(true);
      setError(null);

      await updateBook(bookId, {
        ...form,
        genreIds: parseGenreIds(genreIdsInput),
        coverImage: form.coverImage || undefined,
      });

      navigate(`/books/${bookId}`);
    } catch {
      setError("Failed to update book");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-blue-600">Loading book...</div>;
  }

  if (!form) {
    return (
      <div className="p-6 space-y-3">
        <p className="text-red-600">{error ?? "Book not found"}</p>

        <Link to="/books" className="text-blue-600 underline">
          Back to books
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <Link to={`/books/${bookId}`} className="text-blue-600 underline">
        ← Tagasi detailvaatesse
      </Link>

      <h1 className="text-3xl font-bold">Muuda raamatut</h1>

      {error && <div className="text-red-600">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="border rounded-lg p-5 bg-white shadow-sm space-y-4"
      >
        <input
          className="border p-2 rounded w-full"
          placeholder="Pealkiri"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          required
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="ISBN"
          value={form.isbn}
          onChange={(e) => updateField("isbn", e.target.value)}
          required
        />

        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="border p-2 rounded w-full"
            type="number"
            placeholder="Aasta"
            value={form.publishedYear}
            onChange={(e) => updateField("publishedYear", Number(e.target.value))}
            required
          />

          <input
            className="border p-2 rounded w-full"
            type="number"
            placeholder="Lehekülgede arv"
            value={form.pageCount}
            onChange={(e) => updateField("pageCount", Number(e.target.value))}
            required
          />
        </div>

        <input
          className="border p-2 rounded w-full"
          placeholder="Keel"
          value={form.language}
          onChange={(e) => updateField("language", e.target.value)}
          required
        />

        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="border p-2 rounded w-full"
            type="number"
            placeholder="Author ID"
            value={form.authorId}
            onChange={(e) => updateField("authorId", Number(e.target.value))}
            required
          />

          <input
            className="border p-2 rounded w-full"
            type="number"
            placeholder="Publisher ID"
            value={form.publisherId}
            onChange={(e) => updateField("publisherId", Number(e.target.value))}
            required
          />
        </div>

        <input
          className="border p-2 rounded w-full"
          placeholder="Genre IDs, näiteks: 1,2,3"
          value={genreIdsInput}
          onChange={(e) => setGenreIdsInput(e.target.value)}
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="Cover image URL"
          value={form.coverImage ?? ""}
          onChange={(e) => updateField("coverImage", e.target.value)}
        />

        <textarea
          className="border p-2 rounded w-full min-h-28"
          placeholder="Kirjeldus"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          required
        />

        <button
          disabled={saving}
          className="bg-gray-800 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {saving ? "Saving..." : "Salvesta muudatused"}
        </button>
      </form>
    </div>
  );
}