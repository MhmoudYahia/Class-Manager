const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "tell us your name"],
    trim: true,
    match: [
      new RegExp(/^[a-zA-Z\s]+$/),
      "{VALUE} is not valid. Please use only letters",
    ],
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  email: {
    type: String,
    required: [true, "tell us your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid password"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    select: false,
    validate: {
      validator: function (ele) {
        return ele === this.password;
      },
      message: "passwordConfirm is wrong",
    },
  },
  active: {
    type: Boolean,
    select: false,
    default: true,
  },
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  ],
  passwordChangedAt: Date,
  passwordResetExpires: Date,
  passwordResetToken: String,
});

// Create models for each schema

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && !this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
  next();
});

userSchema.methods.checkIfPasswordIsCorrect = async function (
  myPlaintextPassword,
  hash
) {
  return await bcrypt.compare(myPlaintextPassword, hash);
};

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 1000 * 10 * 60;

  return resetToken;
};

userSchema.methods.passwordChangedAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return changedStamp > jwtTimestamp;
  }
  return false;
};

module.exports = mongoose.model("User", userSchema);
