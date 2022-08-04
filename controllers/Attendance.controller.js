const AttendanceModel = require("../models/Attendance");
const DB = require("../models/DB");
const Registration = require("../models/Registration");
const User = require("../models/User");

const markedToday = async (id) => {
  try {
    await DB.authenticate();
    console.log("Database connected");

    return AttendanceModel.findOne({
      where: {
        id_registration: id,
        day: new Date(Date.now()).getDate(),
        month: new Date(Date.now()).getMonth(),
      },
    });
  } catch (err) {
    console.log("Unable to connect to database to check attentance");
  }
};

const getTodayAttendances = async () => {
  const att = await AttendanceModel.findOne({
    where: {
      id_registration: id,
      day: new Date(Date.now()).getDate(),
      month: new Date(Date.now()).getMonth(),
    },
  });
};

const getAttendancesInfo = async (idSubject) => {
  try {
    await DB.authenticate();
    console.log("Database connected");

    return AttendanceModel.findAll({
      include: [
        {
          model: Registration,
          as: "Registration",
          where: {
            id_subject: idSubject,
          },
          include: [{ model: User, as: "RegistrationOfUser" }],
        },
      ],
    });
  } catch (err) {
    console.log(
      "Unable to connect to database to get attentances with users " + err
    );
  }
};

module.exports = {
  markedToday,
  getAttendancesInfo,
};
