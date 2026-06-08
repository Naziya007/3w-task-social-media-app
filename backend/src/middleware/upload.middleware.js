const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log("CLOUDINARY_CLOUD_NAME =", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY =", process.env.CLOUDINARY_API_KEY);
console.log(
  "CLOUDINARY_API_SECRET EXISTS =",
  !!process.env.CLOUDINARY_API_SECRET
);


// Cloudinary storage configuration for post images
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'social-app/posts'
  }
});

// Multer middleware with file size limit (5MB)
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

module.exports = { upload, cloudinary };
