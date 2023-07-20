const mongoose = require("mongoose");
const User = require("./userModel");

// Define teacher schema as a child of user schema
module.exports = User.discriminator("Admin", new mongoose.Schema({}));
