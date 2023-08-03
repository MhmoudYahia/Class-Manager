const Quiz = require("../models/quizModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.addTeachertoBody = (req, res, next) => {
  req.body.teacher = req.user._id;
  next();
};

exports.preGetClassQuizes = (req, res, next) => {
  req.query.publishAt = { lt: new Date().getTime() };
  next();
};

exports.createQuiz = factory.createOne(Quiz);
exports.addQuestionsToQuiz = factory.updateOne(Quiz);
exports.deleteQuiz = factory.deleteOne(Quiz);
exports.getClassQuizes = factory.getAll(Quiz);
// exports.getQuiz = factory.getOne(Quiz, { path: "teacher" });

exports.getQuiz = catchAsync(async (req, res, next) => {
  const { quizId } = req.params;

  const quiz = await Quiz.findById(quizId).populate("teacher");
  const isSubmitted = quiz.submissions.some(
    (submission) =>
      submission.student._id.toString() === req.user._id.toString()
  );

  res.status(200).json({
    status: "success",
    data: { doc: quiz, isSubmitted },
  });
});

exports.submitQuiz = catchAsync(async (req, res, next) => {
  const { quizId } = req.params;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) return next(new AppError("quiz with this ID not found", 404));

  const isSubmitted = quiz.submissions.some(
    (submission) =>
      submission.student._id.toString() === req.user._id.toString()
  );
  if (isSubmitted)
    return next(new AppError("You have already submitted this quiz", 400));

  const newSubmission = {
    markValue: req.body.markValue,
    selectedAnswers: req.body.selectedAnswers,
    student: req.user._id,
    submittedAt: new Date(),
  };

  quiz.submissions.push(newSubmission);
  await quiz.save();

  res.status(200).json({
    status: "success",
    data: { quiz },
  });
});

exports.getSubmissions = catchAsync(async (req, res, next) => {
  const { quizId } = req.params;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) return next(new AppError("quiz with this ID not found", 404));

  const submissions = quiz.submissions;
  res.status(200).json({
    status: "success",
    data: { submissions },
  });
});

exports.reEnterQuiz = catchAsync(async (req, res, next) => {
  const { quizId } = req.params;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) return next(new AppError("quiz with this ID not found", 404));

  const updatedSubmissions = quiz.submissions.filter(
    (submission) =>
      submission.student._id.toString() !== req.user._id.toString()
  );

  quiz.submissions = updatedSubmissions;
  await quiz.save();

  res.status(200).json({
    status: "success",
    data: { updatedSubmissions },
  });
});
