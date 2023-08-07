const Message = require("../models/chatModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.getChat = catchAsync(async (req, res, next) => {
  const { sender, receiver } = req.params;
  if (!receiver || !sender) {
    return next(new AppError("no sender or receiver", 400));
  }

  const messages = await Message.find({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender },
    ],
  }).sort("timeStamp");

  res.status(200).json({
    status: "success",
    data: { messages },
  });
});

exports.createMessage = factory.createOne(Message);

exports.getContacts = catchAsync(async (req, res, next) => {
  const myId = req.user._id;
  const contacts = await Message.aggregate([
    //_id: null is used in the $group stage to group all the documents into a single group
    { $match: { $or: [{ sender: myId }, { receiver: myId }] } },
    {
      $group: {
        _id: null,
        users: {
          $addToSet: {
            $cond: [{ $eq: ["$sender", myId] }, "$receiver", "$sender"],
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "users",
        foreignField: "_id",
        as: "userDetails",
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: { contacts: contacts[0].userDetails },
  });
});
