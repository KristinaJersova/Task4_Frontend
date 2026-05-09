import { BrowserRouter, Routes, Route } from "react-router-dom";
import BooksPage from "./pages/BooksPage";
import BookDetailPage from "./pages/BookDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:bookId" element={<BookDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;