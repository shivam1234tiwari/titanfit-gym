const multer = require('multer');
const path = require('path');

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination directory
  },
  filename: (req, file, cb) => {
    // Generate unique filename using fieldname, timestamp, and extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File filter (Allow images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  }
  cb(new Error('Only JPEG, JPG, PNG, and WEBP image files are allowed!'), false);
};

// Multer Upload Instance
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB Limit
  fileFilter
});

module.exports = upload;