import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import connectDB from "./src/db";
import sanitizeInputMiddleware from "./src/middlewares/sanitizeInput";
import userRouter from "./src/Routes/usersRoutes";
import authRouter from "./src/Routes/authRouter";
import globalErrorHandler from "./src/controllers/errorController";
import { AppError } from "./src/utils/AppError";

const app = express();
connectDB();
// Middleware
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(sanitizeInputMiddleware);
app.use(cors({ credentials: true, origin: true }));

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// ----- Error Handler Middleware -----
app.use(globalErrorHandler);

export default app;
