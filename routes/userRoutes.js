const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router({ mergeParams: true });

router.route("/signup").post(authController.signUp);
router.route("/signin").post(authController.signIn);
router.route("/signout").patch(authController.signOut);
router.route("/forgetPassword").post(authController.forgetPassword);
router.route("/resetPassword/:resetToken").patch(authController.resetPassword);

router.use(authController.protect);

router.route("/changePassword").patch(authController.changePassword);
router.route("/me").get(userController.getMe, userController.getUser);
router
  .route("/updateMe")
  .patch(
    userController.uploadPhoto,
    userController.resizePhoto,
    userController.updateMe
  );

module.exports = router;
