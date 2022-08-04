const DB = require("../models/DB");
const RegistrationModel = require("../models/Registration");
const SubjectModel = require("../models/Subject");
const ScheduleModel = require("../models/Schedule");
const UserModel = require("../models/User");

const { markedToday } = require("./Attendance.controller");
const { generateScheduleDates, dayToIndex } = require("../helpers/dates");

const getValidRegistrations = async (idStudent) => {
  try {
    await DB.authenticate();
    console.log("---------> Dabatase connected");
    return RegistrationModel.findAll({
      where: {
        id_user: idStudent,
        validated: true,
      },
      include: [
        {
          model: SubjectModel,
          as: "RegistrationToSubject",
          include: [{ model: ScheduleModel, as: "Schedules" }],
        },
      ],
    });
  } catch (err) {
    console.log(
      "---------> Unable to connect to database to get student registrations",
      err
    );
  }
};

const getAllInvalidRegistrations = async (idSubject) => {
  try {
    await DB.authenticate();
    console.log("---------> Dabatase connected");
    return RegistrationModel.findAll({
      where: {
        id_subject: idSubject,
        validated: false,
      },
      include: [
        {
          model: UserModel,
          as: "RegistrationOfUser",
        },
        {
          model: SubjectModel,
          as: "RegistrationToSubject",
          include: [{ model: ScheduleModel, as: "Schedules" }],
        },
      ],
    });
  } catch (err) {
    console.log(
      "---------> Unable to connect to database to get students requests ",
      err
    );
  }
};

const getAllValidRegistrations = async (idSubject) => {
  try {
    await DB.authenticate();
    console.log("---------> Dabatase connected");
    return RegistrationModel.findAll({
      where: {
        id_subject: idSubject,
        validated: true,
      },
      include: [
        {
          model: UserModel,
          as: "RegistrationOfUser",
        },
        {
          model: SubjectModel,
          as: "RegistrationToSubject",
          include: [{ model: ScheduleModel, as: "Schedules" }],
        },
      ],
    });
  } catch (err) {
    console.log(
      "---------> Unable to connect to database to get all valid registrations",
      err
    );
  }
};

const splitSubjects = async (registrations) => {
  try {
    await DB.authenticate();
    console.log("---------> Dabatase connected");
    const activeSubjects = [];
    const inactiveSubjects = [];

    await Promise.all(
      registrations.map(async (reg) => {
        const alreadyMarkedToday = await markedToday(reg.id);

        if (alreadyMarkedToday) {
          inactiveSubjects.push(reg.RegistrationToSubject);
          return;
        }
        reg.RegistrationToSubject.Schedules.map((sc, index) => {
          const [dateStart, dateEnd] = generateScheduleDates(sc);

          if (
            new Date(Date.now()) >= dateStart &&
            new Date(Date.now()) <= dateEnd &&
            !inactiveSubjects.some(
              (sub) => sub.id == reg.RegistrationToSubject.subject_id
            ) &&
            !activeSubjects.some(
              (sub) => sub.id == reg.RegistrationToSubject.subject_id
            ) &&
            dayToIndex(sc.dayOfWeek) === new Date(Date.now()).getDay()
          ) {
            activeSubjects.push({
              ...reg.RegistrationToSubject,
              startHour: sc.startAt,
            });
            // return;
          } else if (
            !inactiveSubjects.some(
              (sub) => sub.id == reg.RegistrationToSubject.subject_id
            ) &&
            !activeSubjects.some(
              (sub) => sub.id == reg.RegistrationToSubject.subject_id
            ) &&
            index == reg.RegistrationToSubject.Schedules.length - 1
          )
            inactiveSubjects.push(reg.RegistrationToSubject);
          // console.log("*********adentro");
        });
      })
    );

    return { activeSubjects, inactiveSubjects };
  } catch (err) {
    console.log(
      "---------> Unable to connect to database to get split registrations",
      err
    );
  }
};

const getActiveSubjects = (registrations) => {
  return registrations.map(async (reg) => {
    console.log("antes del marked");
    const alreadyMarkedToday = await markedToday(reg.id);
    console.log("despues del marked");

    reg.RegistrationToSubject.Schedules.map((sc) => {
      const [dateStart, dateEnd] = generateScheduleDates(sc);

      console.log("adentro");
      if (
        new Date(Date.now()) >= dateStart &&
        new Date(Date.now()) <= dateEnd &&
        !alreadyMarkedToday &&
        dayToIndex(sc.dayOfWeek) === new Date(Date.now()).getDay()
      )
        return {
          ...reg.RegistrationToSubject,
          startHour: sc.startAt,
        };
    });
  });
};

const getRegistration = async (idStudent, idSubject) => {
  console.log(idStudent, idSubject);
  try {
    await DB.authenticate();
    console.log("---------> Dabatase connected");
    return RegistrationModel.findOne({
      where: {
        id_user: idStudent,
        id_subject: idSubject,
      },
    });
  } catch (err) {
    console.log(
      "---------> Unable to connect to database to get registration",
      err
    );
  }
};

module.exports = {
  getValidRegistrations,
  getAllInvalidRegistrations,
  getAllValidRegistrations,
  splitSubjects,
  getActiveSubjects,
  getRegistration,
};
