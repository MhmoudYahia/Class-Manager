const Quiz = require("../models/quizModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.addTeachertoBody = (req, res, next) => {
  req.body.teacher = req.user._id;
  next();
};
exports.createQuiz = factory.createOne(Quiz);
exports.addQuestionsToQuiz = factory.updateOne(Quiz);
exports.deleteQuiz = factory.deleteOne(Quiz);
exports.getQuiz = factory.getOne(Quiz, { path: "teacher" });
exports.getClassQuizes = factory.getAll(Quiz);

exports.preSubmitQuiz = (req, res, next) => {
  req.body.student = req.user._id;
  next();
};
exports.submitQuiz = catchAsync(async (req, res, next) => {
  const { quizId } = req.params;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) return next(new AppError("quiz with this ID not found", 404));

  quiz.submissions.forEach((submission) => {
    if (submission.student._id === req.user._id)
      return next(new AppError("You Submited Before", 400));
  });

  quiz.submissions.push(req.body);
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
