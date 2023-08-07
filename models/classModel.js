const mongoose = require("mongoose");
const validator = require("validator");

// Define the schema for a Class
const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Learning Class",
    },
    code: {
      type: String,
      required: [true, "Enter a code for your class"],
      unique: true,
      minlength: 5,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: [true, "class must have a teacher"],
      },
    ],
    materials: [
      {
        description: String,
        link: String,
      },
    ],
    coverImage: {
      type: String,
      default: "/imgs/classImgs/cover.jpg.jpg",
    },
    announcements: [
      {
        teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Teacher",
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
        announcementBody: {
          type: String,
          default: "Hello Everybody",
        },
        isEdited: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    // strictQuery: true,
    virtuals: true,
  }
);

classSchema.virtual("quizes", {
  ref: "Quiz",
  localField: "_id",
  foreignField: "class",
});

classSchema.virtual("marks", {
  ref: "Mark",
  localField: "_id",
  foreignField: "class",
});

classSchema.pre(/^find/, function (next) {
  this.populate({
    path: "teachers",
    select: "name email photo",
  });

  this.populate({
    path: "students",
    select: "name email photo",
  });

  this.populate({
    path: "announcements.teacher",
    select: "name email",
  });
  next();
});

module.exports = mongoose.model("Class", classSchema);
