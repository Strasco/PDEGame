const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
});

module.exports = mongoose.model("Course", CourseSchema);
