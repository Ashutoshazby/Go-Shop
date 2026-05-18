import cloudinary from '../config/cloudinary.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const uploadImages = asyncHandler(async (req, res) => {
  const uploads = await Promise.all(
    req.files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'go-shop' }, (error, result) => {
            if (error) reject(error);
            else resolve({ url: result.secure_url, publicId: result.public_id });
          });
          stream.end(file.buffer);
        })
    )
  );
  res.status(201).json(uploads);
});
