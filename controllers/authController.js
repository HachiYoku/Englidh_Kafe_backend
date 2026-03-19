const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')


const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const displayName = name || username;

    if (!displayName || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create user
    await User.create({
      name: displayName,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires: Date.now() + 1000 * 60 * 60, // 1 hour
      isVerified: false,
    });
    
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const verifyLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

    try {
      await sendEmail(
        email,
        "Verify your email",
        `
          <h3>Welcome!</h3>
          <p>Click the link below to verify your email:</p>
          <a href="${verifyLink}">Verify Email</a>
        `,
      );
    } catch (emailError) {
      console.warn("Email failed but user registered:", emailError.message);
    }

    //  return success
    return res.status(201).json({
      message: "Registration successful. Please verify your email.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // Check if token exists
    if (!token) {
      return res.status(400).json({ message: "Verification token is missing" });
    }

    console.log("Token received:", token);

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });
    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    if (user.verificationTokenExpires < Date.now()) {
      return res.status(400).json({ message: "Verification token expired" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ message: "If that email exists, a verification link was sent" });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "Email is already verified" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const verifyLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

    await sendEmail(
      user.email,
      "Verify your email",
      `
        <h3>Verify your email</h3>
        <p>Click the link below to verify your email:</p>
        <a href="${verifyLink}">Verify Email</a>
      `,
    );

    return res
      .status(200)
      .json({ message: "Verification email sent. Please check your inbox." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Account doesn't exist" });
  }

  if (!user.isVerified) {
    return res.status(401).json({
      message: "Please verify your email before logging in",
    });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ accessToken: token });
};

const forgotPassword = (req, res) => {
  res.send('Forgot Password endpoint')
}

const resetPassword = (req, res) => {
  res.send('Reset Password endpoint')
}

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  forgotPassword,
  resetPassword
}
