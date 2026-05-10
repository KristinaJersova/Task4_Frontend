import "dotenv/config";
import express from "express";
import bookRoutes from "./routes/express/book.routes";
import { errorHandler } from "./middleware/errors";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running ...");
});

app.use("/api/v1", bookRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});