import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createReview,
  deleteBook,
  getAverageRating,
  getBookById,
  getReviews,
} from "../api/api";
import type { Book, CreateReviewDTO, Review } from "../api/api";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);

  const [loading, setLoading] = useState(true);
  const [reviewSaving, setReviewSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reviewForm, setReviewForm] = useState<CreateReviewDTO>({
    userName: "",
    rating: 5,
    comment: "",
  });

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

        const [bookData, reviewsData, ratingData] = await Promise.all([
          getBookById(bookId, controller.signal),
          getReviews(bookId, controller.signal),
          getAverageRating(bookId, controller.signal),
        ]);

        setBook(bookData);
        setReviews(reviewsData);
        setAverageRating(ratingData.averageRating);
      } catch {
        if (!controller.signal.aborted) {
          setError("Failed to load book details");
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

  const handleDelete = async () => {
    const confirmed = confirm("Delete this book?");
    if (!confirmed) return;

    try {
      setError(null);
      await deleteBook(bookId);
      navigate("/books");
    } catch {
      setError("Failed to delete book");
    }
  };

  const handleReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setReviewSaving(true);
      setError(null);

      const createdReview = await createReview(bookId, reviewForm);

      setReviews((prev) => [createdReview, ...prev]);

      const ratingData = await getAverageRating(bookId);
      setAverageRating(ratingData.averageRating);

      setReviewForm({
        userName: "",
        rating: 5,
        comment: "",
      });
    } catch {
      setError("Failed to add review");
    } finally {
      setReviewSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-blue-600">Loading book details...</div>;
  }

  if (error && !book) {
    return (
      <div className="p-6 space-y-3">
        <p className="text-red-600">{error}</p>
        <Link to="/books" className="text-blue-600 underline">
          Back to books
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="p-6 space-y-3">
        <p>Book not found</p>
        <Link to="/books" className="text-blue-600 underline">
          Back to books
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link to="/books" className="text-blue-600 underline">
        ← Tagasi nimekirja
      </Link>

      {error && <div className="text-red-600">{error}</div>}

      <section className="border rounded-lg p-5 bg-white shadow-sm space-y-4">
        <div className="flex justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="text-gray-600">
              {book.author.firstName} {book.author.lastName}
            </p>
          </div>

          <div className="flex gap-2 h-fit">
            <button
              type="button"
              onClick={() => navigate(`/books/${book.id}/edit`)}
              className="bg-gray-800 text-white px-4 py-2 rounded"
            >
              Muuda
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Kustuta
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <p>
            <b>ISBN:</b> {book.isbn}
          </p>
          <p>
            <b>Aasta:</b> {book.publishedYear}
          </p>
          <p>
            <b>Lehekülgi:</b> {book.pageCount}
          </p>
          <p>
            <b>Keel:</b> {book.language}
          </p>
          <p>
            <b>Kirjastus:</b> {book.publisher.name}
          </p>
          <p>
            <b>Keskmine hinnang:</b> {averageRating.toFixed(1)} / 5
          </p>
        </div>

        <p>
          <b>Žanrid:</b>{" "}
          {book.genres.length > 0
            ? book.genres.map((g) => g.genre.name).join(", ")
            : "No genres"}
        </p>

        <p className="text-gray-700">{book.description}</p>
      </section>

      <section className="border rounded-lg p-5 bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-4">Lisa arvustus</h2>

        <form onSubmit={handleReviewSubmit} className="space-y-3">
          <input
            className="border p-2 rounded w-full"
            placeholder="Kasutajanimi"
            value={reviewForm.userName}
            onChange={(e) =>
              setReviewForm((prev) => ({
                ...prev,
                userName: e.target.value,
              }))
            }
            required
          />

          <select
            className="border p-2 rounded w-full"
            value={reviewForm.rating}
            onChange={(e) =>
              setReviewForm((prev) => ({
                ...prev,
                rating: Number(e.target.value),
              }))
            }
          >
            <option value={1}>1 - Väga halb</option>
            <option value={2}>2 - Halb</option>
            <option value={3}>3 - Keskmine</option>
            <option value={4}>4 - Hea</option>
            <option value={5}>5 - Suurepärane</option>
          </select>

          <textarea
            className="border p-2 rounded w-full min-h-24"
            placeholder="Kommentaar"
            value={reviewForm.comment}
            onChange={(e) =>
              setReviewForm((prev) => ({
                ...prev,
                comment: e.target.value,
              }))
            }
            required
          />

          <button
            disabled={reviewSaving}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {reviewSaving ? "Saving..." : "Lisa arvustus"}
          </button>
        </form>
      </section>

      <section className="border rounded-lg p-5 bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-4">Arvustused</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500">Arvustusi pole veel.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded p-3">
                <div className="flex justify-between">
                  <b>{review.userName}</b>
                  <span>{review.rating} / 5</span>
                </div>

                <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}