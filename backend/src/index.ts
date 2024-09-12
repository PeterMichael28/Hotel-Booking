import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import userRoutes from './routes/users.routes';
import authRoutes from './routes/auth.routes';
import myHotelRoutes from "./routes/my-hotels.routes";
import bookingRoutes from "./routes/my-bookings.routes";
import hotelRoutes from "./routes/hotels.routes";
import { connectDatabase } from './db/db';
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";



// initializing cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



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

// logged in user hotel routes
app.use("/api/my-hotels", myHotelRoutes);



// hotels routes
app.use("/api/hotels", hotelRoutes);

// users bookings
app.use("/api/my-bookings", bookingRoutes);


// redirect every other request to the frontend
app.get( "*", ( req: Request, res: Response ) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"))
})

app.listen(7000, () => {
 console.log('Server running on port 7000');
});
