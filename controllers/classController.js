const Class = require("../models/classModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const isURL = require("is-url");

exports.deleteClass = factory.deleteOne(Class);
exports.updateClass = factory.updateOne(Class);
exports.getClass = factory.getOne(Class);
exports.getAllClasses = factory.getAll(Class);

exports.addMyEmail = (req, res, next) => {
  req.body.email = req.user.email;
  next();
};

exports.createClass = catchAsync(async (req, res, next) => {
  const newClass = await Class.create(req.body);

  newClass.teachers.push(req.user._id);
  await newClass.save();

  const teacher = await User.findById(req.user._id);
  teacher.classes.push(newClass._id);
  await teacher.save();

  res.status(201).json({
    status: "success",
    data: { newClass },
  });
});

exports.addStudentOrTeacher = catchAsync(async (req, res, next) => {
  const { email, code } = req.body;
  const { id } = req.params;

  let myClass;
  if (id) myClass = await Class.findById(id);
  else if (code) myClass = await Class.findOne(code);

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

exports.addMaterial = catchAsync(async (req, res, next) => {
  const { link, description } = req.body; // make a mmiddleware for code
  const { id } = req.params;

  if (!link || !description)
    return next(
      new AppError(
        "To add a material, enter both the link and the description",
        400
      )
    );

  const myClass = await Class.findById(id);
  if (!myClass) return next(new AppError("No Class with this code", 404));

  for (let i = 0; i < myClass.materials.length; i++) {
    if (myClass.materials[i].link === link) {
      return next(new AppError(" this material allready exists", 400));
    }
  }

  if (!isURL(link)) return next(new AppError("Not a valid URL", 400));

  myClass.materials.push({ link, description });
  await myClass.save();

  res.status(200).json({
    status: "success",
    message: "Material has been added successfully ",
    class: myClass,
  });
});

exports.editMaterial = catchAsync(async (req, res, next) => {
  const { link, description } = req.body; // make a mmiddleware for code
  const { matId, id } = req.params;

  if (!link && !description)
    return next(new AppError("there is no change", 400));

  const myClass = await Class.findById(id);
  if (!myClass) return next(new AppError("No Class with this code", 404));

  if (!isURL(link)) return next(new AppError("Not a valid URL", 400));

  myClass.materials.forEach((material) => {
    // foreach run in background, so it is skiped in the event loop
    if (material._id == matId) {
      if (link) material.link = link;
      if (description) material.description = description;
    }
  });
  await myClass.save();

  res.status(200).json({
    status: "success",
    message: "Material has been edited successfully ",
    class: myClass,
  });
});

exports.deleteMaterial = catchAsync(async (req, res, next) => {
  const { matId, id } = req.params;
  const myClass = await Class.findById(id);
  if (!myClass) return next(new AppError("No Class with this code", 404));

  myClass.materials = myClass.materials.filter(
    (material) => material._id != matId
  );
  await myClass.save();

  res.status(200).json({
    status: "success",
    message: "Material has been deleted successfully ",
    class: myClass,
  });
});
