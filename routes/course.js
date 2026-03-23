const express = require("express");
const multer = require("multer");
const validateToken = require("../middleware/authMiddleware");
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", validateToken, requireAdmin, upload.single("thumbnail"), createCourse);
router.put("/:id", validateToken, requireAdmin, upload.single("thumbnail"), updateCourse);
router.delete("/:id", validateToken, requireAdmin, deleteCourse);

module.exports = router;
