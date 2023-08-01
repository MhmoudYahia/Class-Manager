const mongoose = require("mongoose");
const validator = require("validator");

const quizSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  subject: {
    type: String,
    required: true,
  },
  questions: [
    {
      questionMark: Number,
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  publishAt: {
    type: Date,
    default: Date.now(),
  },
  duration: {
    type: Number,
    default: 2,
  },
  submissions: [
    {
      markValue: Number,
      maxMarkValue: Number,
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
      submittedAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});
quizSchema.pre(/^find/, function (next) {
  this.populate({
    path: "teacher",
    select: "name",
  });
  this.populate({
    path: "submissions.student",
    select: "name",
  });
  next();
});
module.exports = mongoose.model("Quiz", quizSchema);
