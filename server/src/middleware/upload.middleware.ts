import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage(); // Store in memory before uploading to S3

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // allow images and pdfs/csv
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/csv'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});
