// Import required modules and dependencies
import express, { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { body } from 'express-validator';
import verifyToken from '../middlewares/auth.middleware';
import Hotel from '../models/hotels.models';
import { HotelType } from '../shared/types';

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
 '/',
 verifyToken, // Middleware to verify user authentication
 [
  // Input validation using express-validator
  body('name').notEmpty().withMessage('Name is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('description')
   .notEmpty()
   .withMessage('Description is required'),
  body('type').notEmpty().withMessage('Hotel type is required'),
  body('pricePerNight')
   .notEmpty()
   .isNumeric()
   .withMessage('Price per night is required and must be a number'),
  body('facilities')
   .notEmpty()
   .isArray()
   .withMessage('Facilities are required'),
 ],
 upload.array('imageFiles', 6), // Allow up to 6 image file uploads
 async (req: Request, res: Response) => {
  try {
   // Extract image files from the request
   const imageFiles = req.files as Express.Multer.File[];
   const newHotel: HotelType = req.body;

   // Wait for all image uploads to complete
   const imageUrls = await uploadImages(imageFiles);

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
   res.status(500).json({ message: 'Something went wrong' });
  }
 },
);

// a get request to get all hotels added by a user
router.get('/', verifyToken, async (req: Request, res: Response) => {
 try {
  const hotels = await Hotel.find({ userId: req.userId });
  res.json(hotels);
 } catch (error) {
  res.status(500).json({ message: 'Error fetching hotels' });
 }
});



// getting a specific hotel data with its id
router.get(
 '/:id',
 verifyToken,
 async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
   const hotel = await Hotel.findOne({
    _id: id,
    userId: req.userId,
   });
   res.json(hotel);
  } catch (error) {
   res.status(500).json({ message: 'Error fetching hotels' });
  }
 },
);

// PUT endpoint to update a hotel by its ID
router.put(
 '/:hotelId',
 verifyToken, // Middleware to verify the user's token (authentication)
 upload.array('imageFiles'), // Middleware to handle file uploads (multiple image files)
 async (req: Request, res: Response) => {
  try {
   // Extract the hotel data from the request body and assign the current date to `lastUpdated`
   const updatedHotel: HotelType = req.body;
   updatedHotel.lastUpdated = new Date();

   // Find and update the hotel with the specified hotel ID, but only if it belongs to the authenticated user
   const hotel = await Hotel.findOneAndUpdate(
    {
     _id: req.params.hotelId, // Hotel ID from the request params
     userId: req.userId, // Ensure the user owns the hotel (from token)
    },
    updatedHotel, // Updated hotel data
    { new: true }, // Return the updated document after modification
   );

   // If the hotel is not found, return a 404 error
   if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found' });
   }

   // Get the uploaded image files from the request
   const files = req.files as Express.Multer.File[];

   // Upload the new images and retrieve their URLs
   const updatedImageUrls = await uploadImages(files);

   // Update the hotel's image URLs with both the new ones and the existing ones
   hotel.imageUrls = [
    ...updatedImageUrls, // New image URLs from the uploaded files
    ...(updatedHotel.imageUrls || []), // Existing image URLs (if any)
   ];

   // Save the updated hotel record to the database
   await hotel.save();

   // Respond with the updated hotel object and a 201 (Created) status
   res.status(201).json(hotel);
  } catch (error) {
   // Handle any errors and return a 500 (Internal Server Error) status with a message
   res.status(500).json({ message: 'Something went wrong' });
  }
 },
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
 const uploadPromises = imageFiles.map(async (image) => {
  const b64 = Buffer.from(image.buffer).toString('base64');
  let dataURI = 'data:' + image.mimetype + ';base64,' + b64;
  const res = await cloudinary.v2.uploader.upload(dataURI);
  return res.url;
 });

 const imageUrls = await Promise.all(uploadPromises);
 return imageUrls;
}

// Export the router for use in the main application
export default router;
