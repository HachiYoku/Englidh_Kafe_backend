const express = require("express");
const multer = require("multer");
const validateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const {
  createPayment,
  getMyPayments,
  getAllPayments,
  approvePayment,
  rejectPayment,
} = require("../controllers/paymentController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/my", validateToken, getMyPayments);
router.get("/", validateToken, requireAdmin, getAllPayments);
router.post("/course/:courseId", validateToken, upload.single("paymentProof"), createPayment);
router.patch("/:paymentId/approve", validateToken, requireAdmin, approvePayment);
router.patch("/:paymentId/reject", validateToken, requireAdmin, rejectPayment);

module.exports = router;
