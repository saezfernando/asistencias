const DB = require("../models/DB");
const UserModel = require("../models/User");
const RegistrationModel = require("../models/Registration");
const SubjectModel = require("../models/Subject");
const HoraryModel = require("../models/Schedule");

const { getAllValidRegistrations } = require("./Registration.controller");

const getAllStudentsInfo = async (req, res, next) => {
  try {
    await DB.authenticate();
    console.log("-----------> Dabatase connected");

    return UserModel.findAll({
      where: {
        id_role: 3,
      },
      include: [
        {
          model: RegistrationModel,
          as: "RegistrationsOfUser",
          where: {
            validated: true,
          },
          include: [
            {
              model: SubjectModel,
              as: "RegistrationToSubject",
              include: [{ model: HoraryModel, as: "Schedules" }],
            },
          ],
        },
      ],
    });
  } catch (err) {
    console.error("Unable to connect to database to get conflicts", err);
  }
};

function formatConflict(student, subject, sch, subjectAux, schAux) {
  return {
    student: student,
    subjects: [
      {
        subject: subject,
        conflictHorary: {
          startAt: sch.startAt,
          endAt: sch.endAt,
        },
      },
      {
        subject: subjectAux,
        conflictHorary: {
          startAt: schAux.startAt,
          endAt: schAux.endAt,
        },
      },
    ],
  };
}
const getConflicts = async (req, res, next) => {
  try {
    await DB.authenticate();
    console.log("-----------> Dabatase connected");

    const students = await getAllStudentsInfo();

    const conflicts = [];
    students.map((student) => {
      return student.RegistrationsOfUser.map((reg, index) => {
        // conflicts.push(reg);
        // console.log(".....index ", index);
        // console.log(  ".....student.RegistrationsOfUser.length ",student.RegistrationsOfUser.length);
        if (index < student.RegistrationsOfUser.length - 1) {
          const subject = reg.RegistrationToSubject;
          const subjectAux =
            student.RegistrationsOfUser[index + 1].RegistrationToSubject;

          // console.log(".....subject: ", JSON.stringify(subject));
          // console.log(".....subjectAux: ", JSON.stringify(subjectAux));

          subject.Schedules.map((sch) => {
            subjectAux.Schedules.map((schAux) => {
              // console.log(".....sch: ", JSON.stringify(sch));
              // console.log(".....schAux: ", JSON.stringify(schAux));
              // console.log("-----------DIV-----------");
              if (
                sch.id == schAux.id &&
                !conflicts.some((conf) => conf.student.id === student.id)
              ) {
                conflicts.push(
                  formatConflict(student, subject, sch, subjectAux, schAux)
                );
              }

              if (
                sch.dayOfWeek == schAux.dayOfWeek &&
                !conflicts.some((conf) => conf.student.id === student.id) &&
                ((sch.endAt >= schAux.startAt && sch.endAt <= schAux.endAt) ||
                  (sch.startAt >= schAux.startAt && sch.startAt < schAux.endAt))
              ) {
                conflicts.push(
                  formatConflict(student, subject, sch, subjectAux, schAux)
                );
              }
            });
          });
        }
      });
    });

    // res.json(conflicts);
    res.render("conflicts.pug", { conflicts });
  } catch (err) {
    console.error("Unable to connect to database to get conflicts", err);
  }
};

module.exports = {
  getConflicts,
};
