const express = require("express");
const studentController = require("../controllers/studentController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(studentController.getAllStudents)
  .post(studentController.createStudent);

router
  .route("/:id")
  .get(studentController.getStudent)
  .delete(studentController.deleteStudent)
  .patch(studentController.updateStudent);

  module.exports = router;
