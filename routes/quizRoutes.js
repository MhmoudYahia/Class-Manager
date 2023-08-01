const express = require("express");
const authController = require("../controllers/authController");
const quizController = require("../controllers/quizController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);


router.route("/getClassQuizes").get(quizController.getClassQuizes);

router
  .route("/")
  .post(
    authController.strictTo("Teacher"),
    quizController.addTeachertoBody,
    quizController.createQuiz
  );

router
  .route("/:quizId")
  .patch(authController.strictTo("Teacher"), quizController.addQuestionsToQuiz)
  .delete(authController.strictTo("Teacher"), quizController.deleteQuiz)
  .get(quizController.getQuiz);

router
  .route("/:quizId/submit")
  .patch(
    authController.strictTo("Student"),
    quizController.preSubmitQuiz,
    quizController.submitQuiz
  );

router
  .route("/:quizId/submissions")
  .get(authController.strictTo("Teacher"), quizController.getSubmissions);

module.exports = router;
