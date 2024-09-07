import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import userRoutes from './routes/users.routes';
import authRoutes from './routes/auth.routes';
import { connectDatabase } from './db/db';
import cookieParser from "cookie-parser";
import path from "path";


// Initialize Express application
const app = express();
connectDatabase();

// Middleware setup
// Parse JSON bodies
app.use(express.json());

// to parse cookies
app.use(cookieParser());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(
 cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
 }),
);


// to load my frontend static build file first
app.use(express.static(path.join(__dirname, "../../frontend/dist")));


// login, logout and verify token endpoint
app.use('/api/auth', authRoutes);

// register user route
app.use('/api/users', userRoutes);

app.listen(7000, () => {
 console.log('Server running on port 7000');
});

// 9pyYhDRBWUK2Bisr

// eMgFesgejW2ZxzkS


// lzd44zeaucUep8qV

// mongodb+srv://enitanpeters28:lzd44zeaucUep8qV@cluster0.wkikm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0