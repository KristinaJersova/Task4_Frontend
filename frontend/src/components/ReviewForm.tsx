import { useState } from "react";

export default function ReviewForm({ onSubmit }: any) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ rating, comment });
      }}
    >
      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      />
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button>Add review</button>
    </form>
  );
}