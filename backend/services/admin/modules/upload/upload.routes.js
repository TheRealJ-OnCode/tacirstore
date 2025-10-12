const multer = require('multer');
const cloudinary = require('../../../../config/cloudinary');
const r = require('express').Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

r.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File yoxdur' });
    }

    // Cloudinary'ə yüklə
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'tacirstore' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Yükləmə xətası' });
  }
});

module.exports = r;