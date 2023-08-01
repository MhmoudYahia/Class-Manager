const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const appError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Set security HTTP headers
app.use(helmet());

// Body parser, reading data from body into req.body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(
  hpp({
    // whitelist: [
    // ],
  })
);
// compress the responses
app.use(compression());

const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: {
    message: "Too many requests, try again in an hour",
    status: "warning",
  },
});

app.use("/api", limiter);

const cors = require("cors");
app.use(cors({ origin: true, credentials: true }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // res.locals.jwt = req.cookies.jwt;
  // console.log(res.locals.jwt);
  // req.session.isAuth = true;
  // console.log(req.cookies);
  next();
});

app.use(express.static(path.join(__dirname, "./Client")));
// if the above route doesn't fit, this will work

// routes
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const classRoutes = require("./routes/classRoutes");
const userRoutes = require("./routes/userRoutes");
const quizRoutes = require("./routes/quizRoutes");
const marksRouter = require("./routes/marksRouter");

app.use("/api/v1/quizes", quizRoutes);

app.use(xss()); // Data sanitization against XSS

app.use("/api/v1/classes", classRoutes);
app.use("/api/v1/teachers", teacherRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/marks", marksRouter);

app.all("*", (req, res, next) => {
  next(new appError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
