const Mark = require("../models/marksModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.preAddMark = (req, res, next) => {
  req.body.teacher = req.user._id;
  req.body.class = req.params.classId;
  next();
};

exports.addMark = factory.createOne(Mark);
exports.preGetMarksFor = (req, res, next) => {
  if (req.user.__t == "Student") req.query.student = req.user._id;
  else if (req.user.__t == "Teacher") req.query.teacher = req.user._id;

  next();
};

exports.getMarksFor = factory.getAll(Mark);
exports.updateMark = factory.updateOne(Mark);
exports.deleteMark = factory.deleteOne(Mark);

// exports.getAllMyMarks = catchAsync(async (req, res, next) => {
//   let filterBody = {};
//   if (req.user.__t == "Teacher") {
//     filterBody = { teacher: req.user._id };
//   } else if (req.user.__t == "Student") {
//     filterBody = { student: req.user._id };
//   }

//   const myMarks = await Mark.find(filterBody);
//   res.status(200).json({
//     status: "success",
//     results: docs.length,
//     data: { myMarks },
//   });
// });
