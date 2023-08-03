const mongoose = require("mongoose");
const validator = require("validator");

const markSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  marksValue: Number,
  maxMark: {
    type: Number,
    default: 50,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  subject: {
    type: String,
    required: [true, "Enter a subject for the mark"],
    trim: true,
  },
});

markSchema.pre(/^find/, function (next) {
  this.populate({
    path: "teacher",
    select: "name",
  });
  this.populate({
    path: "student",
    select: "name",
  });
  this.populate({
    path: "class",
    select: "name code",
  });
  next();
});

module.exports = mongoose.model("Mark", markSchema);
