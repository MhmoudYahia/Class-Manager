const Class = require("../models/classModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.createClass = factory.createOne(Class);
exports.deleteClass = factory.deleteOne(Class);
exports.updateClass = factory.updateOne(Class);
exports.getClass = factory.getOne(Class);
exports.getAllClasses = factory.getAll(Class);

exports.addStudentOrTeacher = catchAsync(async (req, res, next) => {
  const { code, email } = req.body;

  const myClass = await Class.findOne({ code });

  if (!myClass) return next(new AppError("No Class with this code", 404));

  const user = await User.findOne({ email });

  if (!user) return next(new AppError("No user with this email", 404));

  if (user.classes.includes(myClass._id))
    return next(new AppError("This User allready exists", 400));

  if (user.__t === "Student") {
    myClass.students.push(user._id);
  } else if (user.__t === "Teacher") {
    myClass.teachers.push(user._id);
  }
  await myClass.save();

  user.classes.push(myClass);
  await user.save();

  res.status(200).json({
    status: "success",
    message: "email has been added successfully",
    class: myClass,
  });
});
