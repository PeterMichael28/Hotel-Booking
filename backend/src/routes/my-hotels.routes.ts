// Import required modules and dependencies
import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { body } from "express-validator";
import verifyToken from "../middlewares/auth.middleware";
import Hotel from "../models/hotels.models";
import { HotelType } from '../../../shared/types';

// Create an Express router instance
const router = express.Router();

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for file uploads
  },
});

// Define POST route for creating a new hotel
router.post(
  "/",
  verifyToken, // Middleware to verify user authentication
  [
    // Input validation using express-validator
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],
  upload.array("imageFiles", 6), // Allow up to 6 image file uploads
  async (req: Request, res: Response) => {
    try {
      // Extract image files from the request
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      // Upload images to Cloudinary
      const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
      });

      // Wait for all image uploads to complete
      const imageUrls = await Promise.all(uploadPromises);

      // Add image URLs and additional information to the new hotel object
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      // Create and save the new hotel in the database
      const hotel = new Hotel(newHotel);
      await hotel.save();

      // Send a successful response with the created hotel data
      res.status(201).send(hotel);
    } catch (e) {
      // Log any errors and send a generic error response
      console.log(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);


// a get request to get all hotels added by a user
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

// Export the router for use in the main application
export default router;