import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const checkFileType = (file: any, cb: any) => {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
};

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// POST /api/upload
router.post('/', protect, adminOnly, upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({ url: `/${req.file.path.replace(/\\/g, '/')}` });
  } else {
    res.status(400).json({ message: 'No image uploaded' });
  }
});

export default router;
