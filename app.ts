import express from 'express';
import helmet from 'helmet';
import morgan  from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import sanitizeHtml from 'sanitize-html';
import mongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';
import connectDB from './src/db';
import sanitizeInputMiddleware from './src/middlewares/sanitizeInput';

const app = express();
connectDB();
// Middleware
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(mongoSanitize())
app.use(sanitizeInputMiddleware);
app.use(cors({credentials: true, origin: true}));
app.use((req, res, next) => {
    console.log(req.url);
    next();
})
app.all('*', (req, res, next) => {
    console.log(req.url);
    res.status(200).json({
        status: 'success',
        message: `cannot find ${req.originalUrl} on this server`,
        statusbar: 404,
    });
    next();
})

export default app;