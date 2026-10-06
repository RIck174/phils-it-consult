const express = require(`express`);
const router = express.Router();
const cloudinary = require(`../utils/cloudinary`);
const upload = require("../utils/multer");
const { authenticate, isAdmin } = require(`../middleware/auth`);

const multer = require("multer");

const uploadVideo = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["video/mp4", "video/webm", "video/quicktime"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only MP4, WEBM and MOV videos are allowed"), false);
    }
  },
});

router.post(
  `/`,
  upload.single(`image`),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: `phils-it` }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(req.file.buffer);
      });

      res.json({ url: result.secure_url });
    } catch (error) {
      res.status(500).json({ message: "Upload failed" });
    }
  },
);

router.post(
  `/video`,
  authenticate,
  isAdmin,
  uploadVideo.single(`video`),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: `phils-it`, resource_type: `video` },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          )
          .end(req.file.buffer);
      });

      res.json({ url: result.secure_url });
    } catch (error) {
      res.status(500).json({ message: "Video upload failed" });
    }
  },
);

module.exports = router;
