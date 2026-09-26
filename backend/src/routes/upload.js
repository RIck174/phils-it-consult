const express = require(`express`);
const router = express.Router();
const cloudinary = require(`../utils/cloudinary`);
const upload = require("../utils/multer");
const { authenticate, isAdmin } = require(`../middleware/auth`);

router.post(
  `/`,
  upload.single(`image`),
  authenticate,
  isAdmin,
  async (req, res) => {
    try {
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
      res.status(500).json({ message: "Upload failed", error: error.message });
    }
  },
);

module.exports = router;
