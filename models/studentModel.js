const mongoose = require('mongoose');
const User = require('./userModel');

// Define student schema as a child of user schema
module.exports = User.discriminator('Student', new mongoose.Schema({

}));


