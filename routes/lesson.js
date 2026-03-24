const express = require("express");
const validateToken = require("../middleware/authMiddleware");
const {
  createLesson,
  getLessonsByCourse,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessonController");

const router = express.Router();

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};

router.get("/course/:courseId", getLessonsByCourse);
router.post("/course/:courseId", validateToken, requireAdmin, createLesson);
router.put("/:lessonId", validateToken, requireAdmin, updateLesson);
router.delete("/:lessonId", validateToken, requireAdmin, deleteLesson);

module.exports = router;
