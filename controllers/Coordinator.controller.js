const DB = require("../models/DB");

const {
  createSubject,
  allSubjectsProfessors,
  linkProfessorToSubject,
  unlinkProfessorToSubject,
  getSubjectInfo,
} = require("./Subject.controller");
const { getUser, getAllProfessors } = require("./User.controller");
const { createProfessor, getStudentsInfo } = require("./Professor.controller");
const { getExceptionalDates } = require("./ExceptionalDates.controller");
const { indexToDate, getMonths } = require("../helpers/dates");

const addSubject = async (req, res, next) => {
  const { name } = req.body;

  const subject = await createSubject(
    name.charAt(0).toUpperCase() + name.slice(1)
  );

  if (!subject) res.status(409).send();

  res.status(201).send();
};

const addProfessor = async (req, res, next) => {
  const { professorBody } = req.body;

  const professor = await createProfessor(professorBody);

  if (!professor) res.status(409).send();

  res.status(201).send();
};

const getCoodinator = async (req, res, next) => {
  const { email, role } = req.session;
  // console.log("cookie en /coordinators: " + role);
  // if (!role == "Coordinator") res.status(403).redirect("/");
  const coordinator = await getUser(email);
  if (!coordinator)
    res.status(404).send({ mesagge: "Coordinador no encontrado" });

  let SUBJECTS = await allSubjectsProfessors();
  const professors = await getAllProfessors();

  //------------------------------

  SUBJECTS = await Promise.all(
    SUBJECTS.map(async (subject) => {
      if (subject.Users[0]) {
        const subjectAux = await getSubjectInfo(
          subject.id,
          subject.Users[0].id
        );
        const horaries = subjectAux.Schedules;
        const students = await getStudentsInfo(subjectAux.id);
        const exceptionalDates = await getExceptionalDates(subjectAux.id);

        const validDays = new Set();
        horaries.map((h) => {
          validDays.add(h.dayOfWeek);
        });

        const months = getMonths();
        const validMonths = months.map((m) => {
          const validMonth = [];
          m.map((d) => {
            if (validDays.has(indexToDate(d.getDay()))) {
              validMonth.push(d);
            }
          });
          return validMonth;
        });

        let total = 0,
          presents = 0;

        students.map((s) => {
          validMonths.map((m) => {
            m.map((d) => {
              if (
                s.RegistrationsOfUser[0].Attendances.some(
                  (a) => d.getDate() == a.day && d.getMonth() == a.month - 1
                ) ||
                exceptionalDates.some(
                  (exc) =>
                    d.getDate() == exc.day && d.getMonth() == exc.month - 1
                )
              ) {
                total++;
                presents++;
              } else {
                total++;
              }
            });
          });
        });

        subject.average =
          total == 0 ? 0 : Math.floor((presents * 100) / total) / 100;
        await subject.save();
      }
      return subject;
    })
  );

  //------------------------------

  // console.log(SUBJECTS[6]);

  return res.render("coodinators/coordinatorsHome.pug", {
    coordinator,
    professors,
    SUBJECTS,
  });
};

const assignProfessorToSubject = async (req, res, next) => {
  const { idProfessor, idSubject } = req.body;

  console.log(req.body);

  const link = await linkProfessorToSubject(idProfessor, idSubject);

  if (!link)
    return res
      .status(409)
      .send({ message: "Ya está registrado este profesor para esta materia" });

  res.status(201).send();
};

const unassignProfessorToSubject = async (req, res, next) => {
  const { idProfessor, idSubject } = req.body;

  // console.log(req.body);

  const unlinked = await unlinkProfessorToSubject(idProfessor, idSubject);

  if (!unlinked)
    return res
      .status(409)
      .send({ message: "Este profesor no esta asignado a esta materia" });

  res.status(201).send();
};

module.exports = {
  addSubject,
  addProfessor,
  getCoodinator,
  assignProfessorToSubject,
  unassignProfessorToSubject,
};
