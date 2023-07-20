const mongoose = require("mongoose");
const validator = require("validator");

// Define the schema for a Class
const classSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Class", classSchema);
