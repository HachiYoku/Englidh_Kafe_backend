const express = require("express");
const multer = require("multer");
const validateToken = require("../middleware/authMiddleware");
const { attachUserIfPresent } = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const courseUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "paymentQr", maxCount: 1 },
]);

router.get("/", attachUserIfPresent, getCourses);
router.get("/:id", attachUserIfPresent, getCourseById);
router.post("/", validateToken, requireAdmin, courseUpload, createCourse);
router.put("/:id", validateToken, requireAdmin, courseUpload, updateCourse);
router.delete("/:id", validateToken, requireAdmin, deleteCourse);

module.exports = router;
