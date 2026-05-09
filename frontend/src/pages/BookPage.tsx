import { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../api/api";
import BookCard from "../components/BookCard";

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchBooks() {
    try {
      setLoading(true);
      const res = await getBooks();
      setBooks(res.data.data);
    } catch (e) {
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    fetchBooks();

    return () => controller.abort();
  }, []);

  async function handleDelete(id: number) {
    await deleteBook(id);
    fetchBooks();
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Books</h1>

      {books.map((b) => (
        <BookCard key={b.id} book={b} onDelete={handleDelete} />
      ))}
    </div>
  );
}