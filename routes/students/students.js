var express = require("express");
var router = express.Router();

const {
  getStudent,
  signUpSubject,
  markAttendance,
} = require("../../controllers/Student.controller");

// router.get("/", getStudent);
router.get("/", getStudent);
router.post("/signUpSubject", signUpSubject);
router.post("/markAttendance", markAttendance);

module.exports = router;
