const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
  },
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
});

submissionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "student",
    select: "name",
  });
});

module.exports = mongoose.model("Submission", submissionSchema);
