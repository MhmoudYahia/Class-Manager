const Class = require("../models/classModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const isURL = require("is-url");
const multer = require("multer");
const sharp = require("sharp");

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload an image!", 400));
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

exports.uploadCoverImg = upload.single("coverImage");

exports.resizePhoto = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `class-${Date.now()}-${req.user._id}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(
      `F:/MyRepos/Class-Manager/Client/public/imgs/classImgs/${req.file.filename}`
    );

  next();
};

exports.deleteClass = factory.deleteOne(Class);
exports.updateClass = factory.updateOne(Class);
exports.getClass = factory.getOne(Class, { path: "quizes marks" });
exports.getAllClasses = factory.getAll(Class);

exports.addMyEmail = (req, res, next) => {
  req.body.email = req.user.email;
  next();
};

exports.getMyClasses = catchAsync(async (req, res, next) => {
  const myId = req.user._id;

  const myClasses = await Class.find({
    $or: [
      { teachers: { $elemMatch: { $eq: myId } } },
      { students: { $elemMatch: { $eq: myId } } },
    ],
  });

  res.status(201).json({
    status: "success",
    data: { myClasses },
  });
});

exports.createClass = catchAsync(async (req, res, next) => {
  if (req.file) req.body.coverImage = req.file.filename;
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
  else if (code) myClass = await Class.findOne({ code });

  if (!myClass) return next(new AppError("No Class with this code", 404));

  const user = await User.findOne({ email });

  if (!user) return next(new AppError("No user with this email", 404));

  if (user.classes.includes(myClass._id) || myClass.students.includes(user._id))
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
    data: { class: myClass },
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

exports.getClassStudents = catchAsync(async (req, res, next) => {
  const { classId } = req.params;
  const myClass = await Class.findById(classId).populate({
    path: "students",
    select: "name email",
  });
  if (!myClass) return next(new AppError("No Class with this code", 404));

  res.status(200).json({
    status: "success",
    length: myClass.students.length,
    students: myClass.students,
  });
});

exports.getClassAnouncement = catchAsync(async (req, res, next) => {
  const { classId } = req.params;
  const myClass = await Class.findById(classId).populate({
    path: "anouncements.teacher",
    select: "name email",
  });
  if (!myClass) return next(new AppError("No Class with this code", 404));

  res.status(200).json({
    status: "success",
    length: myClass.announcements.length,
    anouncements: myClass.announcements,
  });
});
exports.editAnnouncement = catchAsync(async (req, res, next) => {
  const { announcementBody } = req.body; // make a mmiddleware for code
  const { annId, id } = req.params;

  if (!announcementBody) return next(new AppError("there is no change", 400));

  const myClass = await Class.findById(id);
  if (!myClass) return next(new AppError("No Class with this code", 404));

  myClass.announcements.forEach((announcement) => {
    // foreach run in background, so it is skiped in the event loop
    if (announcement._id.toString() == annId.toString()) {
      if (announcementBody) {
        announcement.announcementBody = announcementBody;
        announcement.isEdited = true;
      }
    }
  });
  await myClass.save();

  res.status(200).json({
    status: "success",
    message: "Announcement has been edited successfully ",
    class: myClass,
  });
});

exports.deleteAnnouncement = catchAsync(async (req, res, next) => {
  const { annId, id } = req.params;
  const myClass = await Class.findById(id);
  if (!myClass) return next(new AppError("No Class with this code", 404));

  myClass.announcements = myClass.announcements.filter(
    (announcement) => announcement._id.toString() != annId.toString()
  );
  await myClass.save();

  res.status(200).json({
    status: "success",
    message: "Announcement has been deleted successfully ",
    class: myClass,
  });
});

exports.addAnnouncement = catchAsync(async (req, res, next) => {
  const { teacher, announcementBody } = req.body; // make a mmiddleware for code
  const { classId } = req.params;

  if (!teacher || !announcementBody)
    return next(
      new AppError(
        "To add a material, enter both the link and the description",
        400
      )
    );

  const myClass = await Class.findById(classId);
  if (!myClass) return next(new AppError("No Class with this Id", 404));

  myClass.announcements.push({ teacher, announcementBody });
  await myClass.save();

  res.status(200).json({
    status: "success",
    message: "announcement added successfully ",
    class: myClass,
  });
});

exports.unEnrollMe = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { classId } = req.params;

  let myClass = await Class.findById(classId);

  const temp = myClass.students.filter((studnt) => !studnt._id.equals(userId));

  myClass.students = temp;
  await myClass.save();

  let user = await User.findById(userId);

  user.classes = user.classes.filter((clss) => clss.toString() !== classId);
  await user.save();

  res.status(200).json({
    status: "success",
    message: "UnEnrollment Done",
  });
});
