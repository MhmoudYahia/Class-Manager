const mongoose = require("mongoose");
const validator = require("validator");

const markSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  maksValue: Number,
});

module.exports = mongoose.model("Mark", markSchema);
