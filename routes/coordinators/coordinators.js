var express = require("express");
var router = express.Router();
const { allSubjects } = require("../../controllers/Subject.controller");
const { getUser } = require("../../controllers/User.controller");
const { addProfessor } = require("../../controllers/Coordinator.controller");
const {
  addSubject,
  getCoodinator,
  assignProfessorToSubject,
  unassignProfessorToSubject,
} = require("../../controllers/Coordinator.controller");

router.get("/", getCoodinator);

router.post("/subject", addSubject);

// router.post("/assignProffesor");

router.get("/subeject/:id", function (req, res, next) {
  if (req.session.role == "coordinator") {
    return res.render("coordinators/subject.pug");
  }
  res.status(403);
  return res.redirect("/");
});

router.post("/addProf", addProfessor);
router.post("/linkProf", assignProfessorToSubject);
router.post("/unlinkProf", unassignProfessorToSubject);

module.exports = router;
