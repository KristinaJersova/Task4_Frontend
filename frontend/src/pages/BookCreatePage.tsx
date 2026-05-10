import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createBook } from "../api/api";
import type { CreateBookDTO } from "../api/api";

export default function BookCreatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateBookDTO>({
    title: "",
    isbn: "",
    publishedYear: new Date().getFullYear(),
    pageCount: 100,
    language: "",
    description: "",
    publisherId: 1,
    authorId: 1,
    genreIds: [],
    coverImage: "",
  });

  const [genreIdsInput, setGenreIdsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof CreateBookDTO>(
    key: K,
    value: CreateBookDTO[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const parseGenreIds = (value: string): number[] => {
    return value
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((id) => Number.isInteger(id) && id > 0);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError(null);

      const createdBook = await createBook({
        ...form,
        genreIds: parseGenreIds(genreIdsInput),
        coverImage: form.coverImage || undefined,
      });

      navigate(`/books/${createdBook.id}`);
    } catch {
      setError("Failed to create book");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <Link to="/books" className="text-blue-600 underline">
        ← Tagasi nimekirja
      </Link>

      <h1 className="text-3xl font-bold">Lisa raamat</h1>

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
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {saving ? "Saving..." : "Lisa raamat"}
        </button>
      </form>
    </div>
  );
}