const express = require("express");
const classController = require("../controllers/classController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/")
  .get(classController.getAllClasses)
  .post(authController.strictTo("Teacher"), classController.createClass);

//materials CRUD
router
  .route("/:id/addMaterial")
  .post(authController.strictTo("Teacher"), classController.addMaterial);

router
  .route("/:id/editMaterial/:matId")
  .patch(authController.strictTo("Teacher"), classController.editMaterial);

router
  .route("/:id/deleteMaterial/:matId")
  .delete(authController.strictTo("Teacher"), classController.deleteMaterial);

router
  .route("/enroll")
  .patch(
    authController.strictTo("Student"),
    classController.addMyEmail,
    classController.addStudentOrTeacher
  );

router
  .route("/:id/addUser")
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
