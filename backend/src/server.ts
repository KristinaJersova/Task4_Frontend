import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import bookRoutes from "./routes/express/book.routes";
import { errorHandler } from "./middleware/errors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", bookRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});