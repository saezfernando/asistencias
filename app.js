//-----------Configs
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");

require("dotenv").config();
//-------------Middlewares
const { isAuthenticated } = require("./middlewares/isAuthenticated");
const {
  isCoordinator,
  isProfessor,
  isStudent,
  isNotStudent,
} = require("./middlewares/isAuthorized");

//-------------Routers
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var studentsRouter = require("./routes/students/students");
var professorsRouter = require("./routes/professors/professors");
var coordinatorsRouter = require("./routes/coordinators/coordinators");
var conflictsRouter = require("./routes/conflicts");

var app = express();

//-------------view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(
  session({
    secret: "cookie_secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//--------------Routes

app.use("/", indexRouter);
app.use("/auth", authRouter);
// app.use("/users", usersRouter);
app.use(isAuthenticated);
app.use("/Student", isStudent, studentsRouter);
app.use("/Professor", isProfessor, professorsRouter);
app.use("/Coordinator", isCoordinator, coordinatorsRouter);
app.use("/conflicts", isNotStudent, conflictsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
