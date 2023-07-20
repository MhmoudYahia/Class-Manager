const express = require("express");
const classController = require("../controllers/classController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/")
  .get(classController.getAllClasses)
  .post(authController.strictTo("Teacher"), classController.createClass);

router
  .route("/addUser")
  .patch(
    authController.strictTo("Teacher"),
    classController.addStudentOrTeacher
  );

router
  .route("/:id")
  .get(classController.getClass)
  .delete(authController.strictTo("Teacher"), classController.deleteClass)
  .patch(authController.strictTo("Teacher"), classController.updateClass);

module.exports = router;
