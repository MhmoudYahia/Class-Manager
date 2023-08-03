const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let id;
    if (req.params.markId) id = req.params.markId;
    else if (req.params.quizId) id = req.params.quizId;
    else id = req.params.id;
    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
      return next(new appError("Document with this ID not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Document have been Deleted",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let id;
    if (req.params.markId) id = req.params.markId;
    else if (req.params.quizId) id = req.params.quizId;
    else id = req.params.id;
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true, //if true, return the modified document rather than the original
    });

    if (!doc) {
      return next(new appError("Doc with this ID not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { doc },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: { doc },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let id;
    if (req.params.markId) id = req.params.markId;
    // else if (req.params.quizId) id = req.params.quizId;
    else id = req.params.id;
    
    let query = Model.findById(id);
    if (popOptions) query = query.populate(popOptions.path);

    const doc = await query;

    if (!doc) {
      return next(new appError("doc with this ID not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { doc },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.classId) filter = { class: req.params.classId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const tours = await Tour.find();
    const docs = await features.query;

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: { docs },
    });
  });
