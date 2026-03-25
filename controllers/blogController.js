const Blog = require("../models/blogModel");
const { uploadStream } = require("../services/uploadStream");

const createBlog = async (req, res) => {
  try {
    const { title, content, image } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    let imageUrl = image;
    let imagePublicId;

    if (req.file?.buffer) {
      const result = await uploadStream(req.file.buffer, "english_kafe/blog_images");
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const blog = await Blog.create({
      title,
      content,
      image: imageUrl,
      imagePublicId,
      createdBy: req.user.id,
    });

    return res.status(201).json(blog);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("createdBy", "name email").sort({ createdAt: -1 });
    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy", "name email");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json(blog);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (title !== undefined) blog.title = title;
    if (content !== undefined) blog.content = content;
    if (image !== undefined) blog.image = image;

    if (req.file?.buffer) {
      const result = await uploadStream(req.file.buffer, "english_kafe/blog_images");
      blog.image = result.secure_url;
      blog.imagePublicId = result.public_id;
    }

    await blog.save();

    return res.status(200).json(blog);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
