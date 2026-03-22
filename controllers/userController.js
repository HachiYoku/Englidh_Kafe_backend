const User = require("../models/userModel");
const { uploadStream } = require("../services/uploadStream");


const getProfile = async (req, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ message: "User is not authorized" });
  }

  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user);
};


const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name } = req.body;
    if (name) user.name = name;

    if (req.file && req.file.buffer) {
      const result = await uploadStream(req.file.buffer, "english_kafe/avatars");
      user.avatar = result.secure_url;
      user.avatarPublicId = result.public_id;
    }

    await user.save();
    const updated = await User.findById(req.user.id).select("-password");
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deletAccount = async (req, res) => { }

module.exports = {
  getProfile,
  updateProfile,
  deletAccount}


