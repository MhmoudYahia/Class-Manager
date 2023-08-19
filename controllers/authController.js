const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const Email = require("../utils/email");
const { promisify } = require("util");
const crypto = require("crypto");
const { log } = require("console");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
};

const createAndSendToken = (user, statusCode, res, req) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRESIN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  res.status(statusCode).json({
    status: "success",
    data: {user},
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const { name, password, passwordConfirm, email, type } = req.body;

  const user = await User.create({
    name,
    password,
    passwordConfirm,
    email,
    __t: type,
  });

  createAndSendToken(user, 201, res, req);
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return next(new appError("Enter your email or password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    console.log(1);
    return next(new appError("NO User With This Email, Go To Sign Up"), 404);
  }

  if (!(await user.checkIfPasswordIsCorrect(password, user.password))) {
    return next(new appError("Wrong Password", 404));
  }

  createAndSendToken(user, 201, res, req);
});

exports.signOut = catchAsync(async (req, res) => {
  res.cookie("jwt", "loggedOut", {
    expires: new Date(Date.now() + 1 * 1000),
  });

  res.status(200).json({
    status: "success",
    message: "Logged Out successfully",
  });
});

// Only for rendered pages, no errors!
exports.isLoggedInMiddleWare = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) return next(new appError("You are not logged in.", 401));

  // 2) Verification token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3) Check if user still exists
  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser)
    return next(
      new appError(
        "The User belonging to this token does no longer exist.",
        401
      )
    );

  // 4) Check if user changed password after the token was issued
  if (currentUser.passwordChangedAfter(decodedToken.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // Done
  req.user = currentUser;
  next();
});

exports.strictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.__t)) {
      return next(
        new appError(
          "You don't have the permission to perform this action",
          401
        )
      );
    }
    next();
  };
};

exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword)
    return next(new appError("Complete The Required Data", 400));

  const user = await User.findById(req.user._id).select("+password"); // from protect

  if (!(await user.checkIfPasswordIsCorrect(currentPassword, user.password)))
    return next(new appError("Your Current Password Is Wrong", 401));

  user.password = newPassword;
  user.passwordConfirm = confirmNewPassword;
  await user.save({ validateBeforeSave: true });

  createAndSendToken(user, 201, res, req);
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const { resetToken } = req.params;

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new appError("Invalid token or expired", 404));
  }

  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save({ validateBeforeSave: false });

  createAndSendToken(user, 201, res, req);
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new appError("Enter your email address", 400));

  const user = await User.findOne({ email });
  if (!user) return next(new appError("No User With This Email", 404));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetUrl = `${req.protocol}://${
      req.get("host")
    }/resetPassword/${resetToken}`; // set the react route here
    await new Email(user, resetUrl).sendResetPasswordEmail();

    res.status(200).json({
      status: "success",
      message: "Email has been Sent Successfully. Check Your Spam",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    next(new appError("Error in sending the email. Try again later", 500));
  }
});
