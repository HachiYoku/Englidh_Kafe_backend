const express = require("express");
const multer = require("multer");
const validateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const {
  getPaymentSettings,
  updatePaymentSettings,
} = require("../controllers/paymentSettingsController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getPaymentSettings);
router.put("/", validateToken, requireAdmin, upload.single("paymentQr"), updatePaymentSettings);

module.exports = router;
