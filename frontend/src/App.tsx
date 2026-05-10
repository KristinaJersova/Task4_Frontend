import { Navigate, Route, Routes } from "react-router-dom";

import BooksPage from "../src/pages/BookPage";
import BookDetailPage from "../src/pages/BookDetailPage";
import BookCreatePage from "../src/pages/BookCreatePage";
import BookEditPage from "../src/pages/BookEditPage";
import AuthorsPage from "../src/pages/AuthorsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/books" />} />

      <Route path="/books" element={<BooksPage />} />

      <Route
        path="/books/new"
        element={<BookCreatePage />}
      />

      <Route
        path="/books/:id"
        element={<BookDetailPage />}
      />

      <Route
        path="/books/:id/edit"
        element={<BookEditPage />}
      />

      <Route
        path="/authors"
        element={<AuthorsPage />}
      />
    </Routes>
  );
}