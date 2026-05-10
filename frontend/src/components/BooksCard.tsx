import { useNavigate } from "react-router-dom";
import type { Book } from "../api/api";

interface BookCardProps {
  book: Book;
  onDelete: (id: number) => void;
}

export default function BookCard({
  book,
  onDelete,
}: BookCardProps) {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="text-xl font-bold">
        {book.title}
      </h2>

      <p>
        {book.author.firstName}{" "}
        {book.author.lastName}
      </p>

      <p>{book.publishedYear}</p>

      <p>
        {book.genres
          .map((g) => g.genre.name)
          .join(", ")}
      </p>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() =>
            navigate(`/books/${book.id}`)
          }
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Vaata
        </button>

        <button
          onClick={() => onDelete(book.id)}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Kustuta
        </button>
      </div>
    </div>
  );
}