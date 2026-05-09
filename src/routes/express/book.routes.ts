import { Router } from "express";
import * as bookController from "../../controllers/book.controller";

const router = Router();

router.get("/books", bookController.getBooksHandler);
router.get("/books/:bookId", bookController.getBookByIdHandler);
router.post("/books", bookController.createBookHandler);
router.put("/books/:bookId", bookController.updateBookHandler);
router.delete("/books/:bookId", bookController.deleteBookHandler);

router.post("/books/:bookId/reviews", bookController.createReviewHandler);
router.get("/books/:bookId/reviews", bookController.getReviewsByBookHandler);
router.get("/books/:bookId/average-rating", bookController.getAverageRatingHandler);

export default router;