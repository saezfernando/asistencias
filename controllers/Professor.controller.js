const DB = require("../models/DB");
const UserModel = require("../models/User");
const HoraryModel = require("../models/Schedule");
const ScheduleSubjectModel = require("../models/Schedule-Subject");
const AttendanceModel = require("../models/Attendance");
const RegistrationModel = require("../models/Registration");
const xl = require("excel4node");
const path = require("path");

const { getUser } = require("../controllers/User.controller");
const { encrypt } = require("../helpers/bcrypt");
const { getMonths, indexToDate, monthsNames } = require("../helpers/dates");
const {
  getAllInvalidRegistrations,
  getAllValidRegistrations,
  getRegistration,
} = require("./Registration.controller");
const {
  allSubjects,
  getSubjectInfo,
  allSubjectsOfOneProfessors,
} = require("./Subject.controller");
const { findAll } = require("../models/User");
const Registration = require("../models/Registration");
const { getAttendancesInfo } = require("./Attendance.controller");
const { getExceptionalDates } = require("./ExceptionalDates.controller");

const getProfessor = async (req, res, next) => {
  const idProfessor = req.session.idUser;

  try {
    await DB.authenticate();
    console.log("---------> Dabatase connected");

    // const registrations = await getAllInvalidRegistrations(idProfessor);
    const professor = await getUser(req.session.email);
    const subjects = await allSubjectsOfOneProfessors(idProfessor);

    return res.render("professors/myCourses", { professor, COURSES: subjects });
  } catch (err) {
    console.log("---------> Unable to connect to database to get student", err);
  }
};

const createProfessor = async (professor) => {
  try {
    await DB.authenticate();
    console.log("------> DB CONNECTED");

    let prof = await getUser(professor.email.toLowerCase());

    if (prof) return null;

    return UserModel.create({
      ...professor,
      password: await encrypt(professor.password),
      id_role: 2,
    });
  } catch (err) {
    console.log("Unable to connect to database to create professor" + err);
  }
};

const getSubjectOfProfessor = async (req, res, next) => {
  const subjectId = req.params.id;
  const idProfessor = req.session.idUser;

  const subjectInfo = await getSubjectInfo(subjectId, idProfessor);
  const exceptionalDates = await getExceptionalDates(subjectId);
  // reg.RegistrationToSubject.Schedules

  // console.log("...............");
  // console.log(subjectInfo);

  if (!subjectInfo)
    return res.status(404).send({
      mesagge:
        "No se encontró informacion sobre la asocion de esta materia con este profesor",
    });
  const requests = await getAllInvalidRegistrations(subjectInfo.id);
  const students = await getAllValidRegistrations(subjectInfo.id);
  // console.log(exceptionalDates);
  // console.log(requests, students);

  return res.render("professors/course.pug", {
    subject: subjectInfo,
    requests,
    students,
    exceptionalDates: exceptionalDates ?? [],
  });
};

const deleteStudent = async (req, res, next) => {
  const { idStudent, idSubject } = req.body;
  const registration = await getRegistration(idStudent, idSubject);

  if (!registration) return res.status(404).send();

  await registration.destroy();

  res.status(201).send();
};

const acceptStudent = async (req, res, next) => {
  const { idStudent, idSubject } = req.body;
  const registration = await getRegistration(idStudent, idSubject);

  if (!registration) return res.status(404).send();

  registration.validated = true;

  await registration.save();

  res.status(201).send();
};

const addHorary = async (req, res, next) => {
  const { idSubject, horary } = req.body;

  try {
    await DB.authenticate();
    console.log("------> DB CONNECTED");

    const [horaryFromDB, created] = await HoraryModel.findOrCreate({
      where: horary,
      defaults: horary,
    });

    if (!horaryFromDB) return res.status(304).send();

    if (!created) {
      const linked = await ScheduleSubjectModel.findOne({
        where: {
          id_subject: idSubject,
          id_horary: horaryFromDB.id,
        },
      });
      if (linked) return res.status(409).send();
    }

    const link = await ScheduleSubjectModel.create({
      id_subject: idSubject,
      id_horary: horaryFromDB.id,
    });

    if (!link) return res.status(304).send();

    res.status(201).send();
  } catch (err) {
    console.log("Unable to connect to database to create or add horary " + err);
  }
};

const deleteHorary = async (req, res, next) => {
  const { idHorary } = req.body;

  try {
    await DB.authenticate();
    console.log("------> DB CONNECTED");

    const link = await ScheduleSubjectModel.findOne({
      where: { id_horary: idHorary },
    });

    if (!link) return res.status(404).send();

    await link.destroy();

    res.status(201).send();
  } catch (err) {
    console.log("Unable to connect to database to create or add horary " + err);
  }
};

const getStudentsInfo = async (idSubject) => {
  try {
    await DB.authenticate();
    console.log("---------> Dabatase connected");

    return await UserModel.findAll({
      include: [
        {
          model: RegistrationModel,
          as: "RegistrationsOfUser",
          where: {
            id_subject: idSubject,
          },
          include: [{ model: AttendanceModel, as: "Attendances" }],
        },
      ],
    });
  } catch (err) {
    console.log(
      "---------> Unable to connect to database to get students info",
      err
    );
  }
};

const getValidStudentsInfo = async (idSubject) => {
  try {
    await DB.authenticate();
    console.log("---------> Dabatase connected");

    return await UserModel.findAll({
      include: [
        {
          model: RegistrationModel,
          as: "RegistrationsOfUser",
          where: {
            id_subject: idSubject,
            validated: true,
          },
          include: [{ model: AttendanceModel, as: "Attendances" }],
        },
      ],
    });
  } catch (err) {
    console.log(
      "---------> Unable to connect to database to get students info",
      err
    );
  }
};

const getAttendaces = async (req, res, next) => {
  const idProfessor = req.session.idUser;
  const idSubject = req.params.id;

  try {
    await DB.authenticate();
    console.log("------> DB CONNECTED");

    const subject = await getSubjectInfo(idSubject, idProfessor);
    const horaries = subject.Schedules;
    const attendances = await getAttendancesInfo(idSubject);
    const students = await getValidStudentsInfo(idSubject);
    const exceptionalDates = await getExceptionalDates(idSubject);

    const validDays = new Set();
    horaries.map((h) => {
      validDays.add(h.dayOfWeek);
    });
    // console.log(subject);
    // const setDates = new Set();
    // attendances.map((att) => {
    //   setDates.add(`${att.day}/${att.month}/2022`);
    // });

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

    students.map((s) => {
      const attendances = [];
      validMonths.map((m) => {
        const aux = [];
        m.map((d) => {
          aux.push(
            s.RegistrationsOfUser[0].Attendances.some(
              (a) => d.getDate() == a.day && d.getMonth() == a.month - 1
            ) ||
              exceptionalDates.some(
                (exc) => d.getDate() == exc.day && d.getMonth() == exc.month - 1
              )
              ? "P"
              : "A"
          );
        });

        attendances.push(aux);
      });

      s.attParse = attendances;
    });

    return res.render("professors/courseAttendance.pug", {
      subject: subject,
      MONTHS: validMonths,
      students,
      attendances,
      monthsNames,
    });
  } catch (err) {
    console.log("Unable to connect to database to get attendances " + err);
  }
};

const downloadExcel = async (req, res, next) => {
  const idSubject = req.params.id;
  const idProfessor = req.session.idUser;

  try {
    await DB.authenticate();
    console.log("------> DB CONNECTED");

    const subject = await getSubjectInfo(idSubject, idProfessor);
    const horaries = subject.Schedules;
    // const attendances = await getAttendancesInfo(idSubject);
    const exceptionalDates = await getExceptionalDates(idSubject);
    const students = await getValidStudentsInfo(idSubject);

    const validDays = new Set();
    horaries.map((h) => {
      validDays.add(h.dayOfWeek);
    });
    // console.log(subject);
    // const setDates = new Set();
    // attendances.map((att) => {
    //   setDates.add(`${att.day}/${att.month}/2022`);
    // });

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

    students.map((s) => {
      const attendances = [];
      validMonths.map((m) => {
        const aux = [];
        m.map((d) => {
          aux.push(
            s.RegistrationsOfUser[0].Attendances.some(
              (a) => d.getDate() == a.day && d.getMonth() == a.month - 1,
              d.getDate(),
              d.getMonth()
            ) ||
              exceptionalDates.some(
                (exc) => d.getDate() == exc.day && d.getMonth() == exc.month - 1
              )
              ? "P"
              : "A"
          );
        });

        attendances.push(aux);
      });

      s.attParse = attendances;
    });

    /*  const ATTENDANCES = [
      {
        month: "Febrero",
        dates: [
          "Usuario",
          "Nombre",
          "Apellido",
          "17/02",
          "19/02",
          "20/02",
          "25/02",
          "26/02",
          "01/03",
          "03/03",
          "17/02",
          "19/02",
          "20/02",
          "25/02",
          "26/02",
          "01/03",
          "03/03",
        ],
        students: [
          {
            first_name: "Juan",
            last_name: "Perez",
            user: "JuanPerezUser",
            ATTENS: [
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
            ],
          },
          {
            first_name: "Lucas",
            last_name: "Diaz",
            user: "LucasDiazUser",
            ATTENS: [
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
            ],
          },
          {
            first_name: "Romina",
            last_name: "Quiroga",
            user: "RominaQuirogaUser",
            ATTENS: [
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
            ],
          },
          {
            first_name: "Lucia",
            last_name: "Leyes",
            user: "LuciaLeyesUser",
            ATTENS: [
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
            ],
          },
        ],
      },
      {
        month: "Marzo",
        dates: [
          "Usuario",
          "Nombre",
          "Apellido",
          "17/02",
          "19/02",
          "20/02",
          "25/02",
          "26/02",
          "01/03",
          "03/03",
          "17/02",
          "19/02",
          "20/02",
          "25/02",
          "26/02",
          "01/03",
          "03/03",
        ],
        students: [
          {
            first_name: "Juan",
            last_name: "Perez",
            user: "JuanPerezUser",
            ATTENS: [
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
            ],
          },
          {
            first_name: "Lucas",
            last_name: "Diaz",
            user: "LucasDiazUser",
            ATTENS: [
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
            ],
          },
          {
            first_name: "Romina",
            last_name: "Quiroga",
            user: "RominaQuirogaUser",
            ATTENS: [
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
            ],
          },
          {
            first_name: "Lucia",
            last_name: "Leyes",
            user: "LuciaLeyesUser",
            ATTENS: [
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
              "P",
            ],
          },
        ],
      },
    ]; */
    const wb = new xl.Workbook();
    const style = wb.createStyle({
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
      border: {
        left: {
          style: "medium",
          color: "#3b78a3",
        },
        right: {
          style: "medium",
          color: "#3b78a3",
        },
        top: {
          style: "medium",
          color: "#3b78a3",
        },
        bottom: {
          style: "medium",
          color: "#3b78a3",
        },
      },
      font: {
        size: 14,
      },
      fill: {
        bgColor: "#3b78a3",
        type: "pattern",
      },
    });

    validMonths.map((month, index) => {
      let i = 2,
        j = 4;
      let ws = wb.addWorksheet(`${monthsNames[index]}`);

      month.map((day) => {
        // let formatedDate = date.split("/").reverse().join("-");
        // formatedDate = [...formatedDate]
        // console.log(formatedDate)
        ws.cell(1, 1).string("Usuario");
        ws.cell(1, 2).string("Nombre");
        ws.cell(1, 3).string("Apellido");
        ws.cell(1, j).string(`${day.getDate()}/${day.getMonth() + 1}/22`);
        // ws.cell(1, j).date(`2022-${formatedDate}`).style({numberFormat: 'dd/mm/yyyy'});
        j++;
      });

      j = 4;

      students.map((stud) => {
        ws.cell(i, 1).string(stud.email);
        ws.cell(i, 2).string(stud.first_name);
        ws.cell(i, 3).string(stud.last_name);
        stud.attParse[index].map((att) => {
          ws.cell(i, j).string(att);
          j++;
        });
        j = 4;
        i++;
      });

      ws.cell(1, 1).style(style);
      ws.cell(1, 2).style(style);
      ws.cell(1, 3).style(style);
    });

    const pathExcel = path.join(
      __dirname,
      "excels",
      `Asistencias a ${subject.name}.xlsx`
    );
    wb.write(pathExcel, async (err, stats) => {
      if (err) console.log(err);
      else {
        return res.download(pathExcel);
      }
    });
  } catch (err) {
    console.log("Unable to connect to database to download excel " + err);
  }
};

module.exports = {
  createProfessor,
  getProfessor,
  getSubjectOfProfessor,
  deleteStudent,
  acceptStudent,
  addHorary,
  deleteHorary,
  getAttendaces,
  downloadExcel,
  getStudentsInfo,
  getValidStudentsInfo,
};
