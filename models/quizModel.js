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
      questionMark: {
        type: Number,
        default: 10,
      },
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
  maxMarkValue: Number,
  canReSubmit: {
    type: Boolean,
    default: false,
  },
  submissions: [
    {
      selectedAnswers: [
        {
          question: mongoose.Schema.Types.ObjectId,
          answer: String,
          isCorrect: Boolean,
        },
      ],
      markValue: Number,
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

// quizSchema.virtual("submissions", {
//   ref: "Submission",
//   localField: "_id",
//   foreignField: "quiz",
// });

module.exports = mongoose.model("Quiz", quizSchema);
