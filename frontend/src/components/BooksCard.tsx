import { Link } from "react-router-dom";

export default function BookCard({ book, onDelete }: any) {
  return (
    <div>
      <h3>{book.title}</h3>
      <p>
        {book.author.firstName} {book.author.lastName}
      </p>

      <Link to={`/books/${book.id}`}>View</Link>
      <button onClick={() => onDelete(book.id)}>Delete</button>
    </div>
  );
}