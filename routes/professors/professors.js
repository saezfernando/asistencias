var express = require("express");
const {
  addExceptionalDate,
  deleteExceptionalDates,
} = require("../../controllers/ExceptionalDates.controller");
var router = express.Router();

const {
  getProfessor,
  getSubjectOfProfessor,
  deleteStudent,
  acceptStudent,
  addHorary,
  deleteHorary,
  getAttendaces,
  downloadExcel,
} = require("../../controllers/Professor.controller");

router.get("/", getProfessor);

router.get("/course/:id", getSubjectOfProfessor);
router.post("/deleteStudent", deleteStudent);
router.post("/acceptStudent", acceptStudent);
router.post("/addHorary", addHorary);
router.post("/deleteHorary", deleteHorary);
router.post("/:id/addExceptionalDate", addExceptionalDate);
router.post("/deleteExceptionalDate", deleteExceptionalDates);
router.get("/course/:id/attendances", getAttendaces);
router.get("/course/:id/attendance/download", downloadExcel);

module.exports = router;
