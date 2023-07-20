const express = require("express");
const teacherController = require("../controllers/teacherController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(teacherController.createTeacher)
  .get(teacherController.getAllTeachers);

router
  .route("/:id")
  .get(teacherController.getTeacher)
  .delete(teacherController.deleteTeacher)
  .patch(teacherController.updateTeacher);

  module.exports = router;
