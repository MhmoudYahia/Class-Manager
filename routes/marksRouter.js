const express = require("express");
const authController = require("../controllers/authController");
const marksController = require("../controllers/marksController");

const router = express.Router({ mergeParams: true });

router
  .route("/addMark")
  .post(
    authController.strictTo("Teacher"),
    marksController.preAddMark,
    marksController.addMark
  );

router
  .route("/")
  .get(
    
    authController.protect,
    marksController.preGetMarksFor,
    marksController.getMarksFor
  );

// router.route("/myMarks").get(authController.protect, marksController.getAllMyMarks);

router.use(authController.strictTo("Teacher"));
router
  .route("/:markId")
  .delete(marksController.deleteMark)
  .patch(marksController.updateMark);
module.exports = router;
