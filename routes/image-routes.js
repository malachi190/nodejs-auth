const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const { uploadImage, fetchImages } = require("../controllers/storage-controller");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/uploads-middleware");

// Upload image
router.post(
  "/image",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  uploadImage
);

router.get('/get-images', authMiddleware, fetchImages)

module.exports = router
