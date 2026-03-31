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

router.get("/", attachUserIfPresent, getCourses);
router.get("/:id", attachUserIfPresent, getCourseById);
router.post("/", validateToken, requireAdmin, upload.single("thumbnail"), createCourse);
router.put("/:id", validateToken, requireAdmin, upload.single("thumbnail"), updateCourse);
router.delete("/:id", validateToken, requireAdmin, deleteCourse);

module.exports = router;
