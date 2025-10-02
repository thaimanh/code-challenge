import express, { Request, Response, NextFunction } from "express";
import router from "./routes"; // Using alias
import { ERROR_MESSAGE } from "./shared/constants";
import * as yup from "yup";
import morgan from "morgan";
import cors from "cors";

const app = express()
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(
    process.env.NODE_ENV === "development" ? morgan("dev") : morgan("combined")
  )
  .use(cors());

// Routes
app.use(router);

// Centralized error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof yup.ValidationError) {
    res.status(400).json({
      message: "Validation error",
      errors: err.errors,
    });
    return;
  }
  res.status(500).json({
    message: err?.message || ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
    details: err,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
