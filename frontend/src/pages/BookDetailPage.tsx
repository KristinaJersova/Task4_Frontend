import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBook,
  deleteBook,
  getReviews,
  createReview,
  getAverageRating,
} from "../api/api";

export default function BookDetailPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState<number>(0);

  useEffect(() => {
    if (!bookId) return;

    getBook(Number(bookId)).then((res) => setBook(res.data));
    getReviews(Number(bookId)).then((res) => setReviews(res.data));
    getAverageRating(Number(bookId)).then((res) =>
      setRating(res.data.averageRating)
    );
  }, [bookId]);

  async function handleDelete() {
    await deleteBook(Number(bookId));
    navigate("/books");
  }

  async function handleReview(data: any) {
    await createReview(Number(bookId), data);
  }

  if (!book) return <p>Loading...</p>;

  return (
    <div>
      <h1>{book.title}</h1>
      <p>Rating: {rating}</p>

      <button onClick={handleDelete}>Delete</button>

      <h2>Reviews</h2>
      {reviews.map((r) => (
        <div key={r.id}>{r.comment}</div>
      ))}
    </div>
  );
}