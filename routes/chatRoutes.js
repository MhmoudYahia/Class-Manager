const express = require("express");
const chatController = require("../controllers/chatController");
const authController = require("../controllers/authController");
const router = express.Router();

router.use(authController.protect);
router.route("/:sender/:receiver/").get(chatController.getChat);
router.route("/").post(chatController.createMessage);
router.route("/getContacts").get(chatController.getContacts);
module.exports = router;
