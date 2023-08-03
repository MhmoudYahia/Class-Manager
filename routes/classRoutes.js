const express = require("express");
const classController = require("../controllers/classController");
const authController = require("../controllers/authController");
const marksRouter = require("../routes/marksRouter");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.use("/:classId/marks", marksRouter);

router.route("/getMyClasses").get(classController.getMyClasses);

//not needed
router.route("/:classId/students").get(classController.getClassStudents);
router.route("/:classId/anouncements").get(classController.getClassAnouncement);

router
  .route("/:classId/addAnnouncement")
  .post(authController.strictTo("Teacher"), classController.addAnnouncement);

router
  .route("/:id/editAnnouncement/:annId")
  .patch(authController.strictTo("Teacher"), classController.editAnnouncement);

router
  .route("/:id/deleteAnnouncement/:annId")
  .delete(authController.strictTo("Teacher"), classController.deleteAnnouncement);

router
  .route("/")
  .get(classController.getAllClasses)
  .post(
    authController.strictTo("Teacher"),
    classController.uploadCoverImg,
    classController.resizePhoto,
    classController.createClass
  );

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
  .route("/:classId/unenroll")
  .patch(authController.strictTo("Student"), classController.unEnrollMe);

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
