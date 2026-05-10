import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  createReview,
  deleteBook,
  deleteReview,
  getAverageRating,
  getBookById,
  getReviews,
} from "../api/api";

import type {
  Book,
  CreateReviewDTO,
  Review,
} from "../api/api";

export default function BookDetailPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [book, setBook] =
    useState<Book | null>(null);

  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [averageRating, setAverageRating] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [reviewSaving, setReviewSaving] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const [reviewForm, setReviewForm] =
    useState<CreateReviewDTO>({
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

    const controller =
      new AbortController();

    const loadBook = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          bookData,
          reviewsData,
          ratingData,
        ] = await Promise.all([
          getBookById(
            bookId,
            controller.signal
          ),

          getReviews(
            bookId,
            controller.signal
          ),

          getAverageRating(
            bookId,
            controller.signal
          ),
        ]);

        setBook(bookData);

        setReviews(reviewsData);

        setAverageRating(
          ratingData.averageRating
        );
      } catch {
        if (!controller.signal.aborted) {
          setError(
            "Failed to load book details"
          );
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
    const confirmed = confirm(
      "Delete this book?"
    );

    if (!confirmed) return;

    try {
      setError(null);

      await deleteBook(bookId);

      navigate("/books");
    } catch {
      setError("Failed to delete book");
    }
  };

  const handleDeleteReview = async (
    reviewId: number
  ) => {
    const confirmed = confirm(
      "Delete this review?"
    );

    if (!confirmed) return;

    try {
      await deleteReview(reviewId);

      setReviews((prev) =>
        prev.filter(
          (review) =>
            review.id !== reviewId
        )
      );

      const ratingData =
        await getAverageRating(bookId);

      setAverageRating(
        ratingData.averageRating
      );
    } catch {
      setError("Failed to delete review");
    }
  };

  const handleReviewSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setReviewSaving(true);

      setError(null);

      const createdReview =
        await createReview(
          bookId,
          reviewForm
        );

      setReviews((prev) => [
        createdReview,
        ...prev,
      ]);

      const ratingData =
        await getAverageRating(bookId);

      setAverageRating(
        ratingData.averageRating
      );

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
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white p-5 rounded-xl shadow-sm text-blue-600">
          Loading book details...
        </div>
      </div>
    );
  }

  if (error && !book) {
    return (
      <div className="p-6 space-y-3">
        <p className="text-red-600">
          {error}
        </p>

        <Link
          to="/books"
          className="text-blue-600 underline"
        >
          Back to books
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="p-6 space-y-3">
        <p>Book not found</p>

        <Link
          to="/books"
          className="text-blue-600 underline"
        >
          Back to books
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          to="/books"
          className="text-blue-600 hover:underline"
        >
          ← Tagasi nimekirja
        </Link>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            {error}
          </div>
        )}

        <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {book.title}
              </h1>

              <p className="text-gray-500 mt-1">
                {book.author.firstName}{" "}
                {book.author.lastName}
              </p>
            </div>

            <div className="flex gap-2 h-fit">
              <button
                onClick={() =>
                  navigate(
                    `/books/${book.id}/edit`
                  )
                }
                className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg"
              >
                Muuda
              </button>

              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Kustuta
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
            <p>
              <b>ISBN:</b> {book.isbn}
            </p>

            <p>
              <b>Aasta:</b>{" "}
              {book.publishedYear}
            </p>

            <p>
              <b>Lehekülgi:</b>{" "}
              {book.pageCount}
            </p>

            <p>
              <b>Keel:</b> {book.language}
            </p>

            <p>
              <b>Kirjastus:</b>{" "}
              {book.publisher.name}
            </p>

            <p>
              <b>Keskmine hinnang:</b>{" "}
              ⭐{" "}
              {averageRating.toFixed(1)} / 5
            </p>
          </div>

          <div>
            <b>Žanrid:</b>{" "}
            {book.genres.length > 0
              ? book.genres
                  .map(
                    (g) => g.genre.name
                  )
                  .join(", ")
              : "No genres"}
          </div>

          <p className="text-gray-700 leading-relaxed">
            {book.description}
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4">
            Lisa arvustus
          </h2>

          <form
            onSubmit={handleReviewSubmit}
            className="space-y-3"
          >
            <input
              className="border border-gray-300 p-2 rounded-lg w-full"
              placeholder="Kasutajanimi"
              value={reviewForm.userName}
              onChange={(e) =>
                setReviewForm((prev) => ({
                  ...prev,
                  userName:
                    e.target.value,
                }))
              }
              required
            />

            <select
              className="border border-gray-300 p-2 rounded-lg w-full"
              value={reviewForm.rating}
              onChange={(e) =>
                setReviewForm((prev) => ({
                  ...prev,
                  rating: Number(
                    e.target.value
                  ),
                }))
              }
            >
              <option value={1}>
                1 - Väga halb
              </option>

              <option value={2}>
                2 - Halb
              </option>

              <option value={3}>
                3 - Keskmine
              </option>

              <option value={4}>
                4 - Hea
              </option>

              <option value={5}>
                5 - Suurepärane
              </option>
            </select>

            <textarea
              className="border border-gray-300 p-2 rounded-lg w-full min-h-24"
              placeholder="Kommentaar"
              value={reviewForm.comment}
              onChange={(e) =>
                setReviewForm((prev) => ({
                  ...prev,
                  comment:
                    e.target.value,
                }))
              }
              required
            />

            <button
              disabled={reviewSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {reviewSaving
                ? "Saving..."
                : "Lisa arvustus"}
            </button>
          </form>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4">
            Arvustused
          </h2>

          {reviews.length === 0 ? (
            <p className="text-gray-500">
              Arvustusi pole veel.
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <b className="text-gray-900">
                          {
                            review.userName
                          }
                        </b>

                        <span className="text-yellow-500">
                          {"⭐".repeat(
                            review.rating
                          )}
                        </span>
                      </div>

                      <p className="text-gray-700 mt-2">
                        {review.comment}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handleDeleteReview(
                          review.id
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Kustuta
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}