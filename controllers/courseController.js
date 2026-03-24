const Course = require("../models/courseModel");
const Lesson = require("../models/lessonModel");
const { uploadStream } = require("../services/uploadStream");

const createCourse = async (req, res) => {
  try {
    const { title, description, price, rating, thumbnail, isPublished } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({ message: "Title and price are required" });
    }

    let thumbnailUrl = thumbnail;
    let thumbnailPublicId;

    if (req.file?.buffer) {
      const result = await uploadStream(
        req.file.buffer,
        "english_kafe/course_thumbnails"
      );
      thumbnailUrl = result.secure_url;
      thumbnailPublicId = result.public_id;
    }

    const course = await Course.create({
      title,
      description,
      price,
      rating: rating || 0,
      thumbnail: thumbnailUrl,
      thumbnailPublicId,
      isPublished,
      createdBy: req.user.id,
    });

    return res.status(201).json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const query = req.user?.role === "admin" ? {} : { isPublished: true };
    const courses = await Course.find(query).populate("createdBy", "name email");

    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.isPublished && req.user?.role !== "admin") {
      return res.status(403).json({ message: "You cannot access this course" });
    }

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { title, description, price, rating, thumbnail, isPublished } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (price !== undefined) course.price = price;
    if (rating !== undefined) course.rating = rating;
    if (thumbnail !== undefined) course.thumbnail = thumbnail;
    if (isPublished !== undefined) course.isPublished = isPublished;

    if (req.file?.buffer) {
      const result = await uploadStream(
        req.file.buffer,
        "english_kafe/course_thumbnails"
      );
      course.thumbnail = result.secure_url;
      course.thumbnailPublicId = result.public_id;
    }

    await course.save();

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await Lesson.deleteMany({ course: course._id });
    await course.deleteOne();

    return res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
