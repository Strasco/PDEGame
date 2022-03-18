const mongoose = require("mongoose");
const slugify = require("slugify");
const User = require("./User");

const GradeSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
    required: true,
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Grade", GradeSchema);
