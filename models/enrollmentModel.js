const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment"
  }

}, { timestamps: true });