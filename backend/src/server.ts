import "dotenv/config";
import express from "express";
import bookRoutes from "./routes/express/book.routes";
import { errorHandler } from "./middleware/errors";
import cors from "cors";



const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("API is running ...");
});

app.use("/api/v1", bookRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});