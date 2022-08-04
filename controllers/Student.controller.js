const DB = require("../models/DB");
const SubjectModel = require("../models/Subject");
const UserModel = require("../models/User");
const ScheduleSubjectModel = require("../models/Schedule-Subject");
const UserSubjectModel = require("../models/User-Subject");
const ScheduleModel = require("../models/Schedule");
const RegistrationModel = require("../models/Registration");
const AttendanceModel = require("../models/Attendance");

// const { Op } = require("sequelize");

const { allSubjects } = require("./Subject.controller");
const { markedToday } = require("./Attendance.controller");
const {
  getValidRegistrations,
  splitSubjects,
  getActiveSubjects,
} = require("./Registration.controller");

// const { generateScheduleDates, dayToIndex } = require("../helpers/dates");

const getStudent = async (req, res, next) => {
  const idStudent = req.session.idUser;

  try {
    await DB.authenticate();
    console.log("---------> Dabatase connected");

    const registrations = await getValidRegistrations(idStudent);
    const student = await UserModel.findByPk(idStudent);
    const subjects = await allSubjects();

    const { activeSubjects, inactiveSubjects } = await splitSubjects(
      registrations
    );
    // console.log("Inscripciones del estudiante: ");
    // console.log(activeSubjects);

    return res.render("students/mySubjects.pug", {
      student: student,
      activeSubjects: activeSubjects,
      inactiveSubjects: inactiveSubjects,
      SUBJECTS: subjects,
    });
  } catch (err) {
    console.log("---------> Unable to connect to database to get student", err);
  }
};

const signUpSubject = async (req, res, next) => {
  const idStudent = req.session.idUser;
  const { idSubject } = req.body;
  try {
    await DB.authenticate();
    console.log("---------> Dabatase connected");

    const existSubject = await SubjectModel.findByPk(idSubject);

    if (!existSubject) return res.status(400).send();

    let registration = await RegistrationModel.findOne({
      where: {
        id_user: idStudent,
        id_subject: idSubject,
      },
    });

    if (registration)
      return res
        .status(409)
        .send({ message: "Ya está registrado en esta materia" });

    registration = await RegistrationModel.create({
      id_user: idStudent,
      id_subject: idSubject,
    });

    if (!registration) return res.status(417).send();

    res.status(201).send();
  } catch (err) {
    console.log(
      "---------> Unable to connect to database to sign up student in the subject",
      err
    );
  }
};

const markAttendance = async (req, res, next) => {
  const { idSubject } = req.body;
  const idStudent = req.session.idUser;

  try {
    await DB.authenticate();
    console.log("---------> Dabatase connected");

    let registration = await RegistrationModel.findOne({
      where: {
        id_user: idStudent,
        id_subject: idSubject,
      },
      include: [
        {
          model: SubjectModel,
          as: "RegistrationToSubject",
          include: [{ model: ScheduleModel, as: "Schedules" }],
        },
      ],
    });

    if (!registration) res.status(404).send();

    if (
      !registration.RegistrationToSubject.Schedules.some((sch) => {
        const hour = parseInt(sch.startAt.split(":")[0]);
        const minutes = parseInt(sch.startAt.split(":")[1]) + 30;

        const currentTime = new Date();
        const compareTime = new Date();
        compareTime.setHours(hour, minutes);

        return currentTime.getTime() <= compareTime.getTime();
      })
    )
      return res.status(409).send({ message: "Está fuera de horario" });

    let attendance = await AttendanceModel.findOne({
      where: {
        id_registration: registration.id,
        day: new Date(Date.now()).getDate(),
        month: new Date(Date.now()).getMonth(),
      },
    });

    if (attendance)
      res.status(409).send({ message: "Ya marcó la asistencia de hoy" });

    await AttendanceModel.create({
      id_registration: registration.id,
      day: new Date(Date.now()).getDate(),
      month: new Date(Date.now()).getMonth(),
    });

    res.status(201).send();
  } catch (err) {
    console.log(
      "---------> Unable to connect to database to mark attendance in the subject",
      err
    );
  }
};

module.exports = {
  getStudent,
  signUpSubject,
  markAttendance,
};
