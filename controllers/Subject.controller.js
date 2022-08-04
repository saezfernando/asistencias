const SubjectModel = require("../models/Subject");
const UserModel = require("../models/User");
const ProfessorSubjectModel = require("../models/User-Subject");
const DB = require("../models/DB");
const ScheduleModel = require("../models/Schedule");
const AttendanceModel = require("../models/Attendance");
const RegistrationModel = require("../models/Registration");

const allSubjects = async () => {
  try {
    await DB.authenticate();
    console.log("------> DB CONNECTED");
    return SubjectModel.findAll();
  } catch (error) {
    console.error(
      "------> Unable to connect to database to get SUBJECTS: " + error
    );
  }
};

const allSubjectsOfOneProfessors = async (id) => {
  try {
    await DB.authenticate();
    console.log("------> DB CONNECTED");
    return SubjectModel.findAll({
      include: [{ model: UserModel, as: "Users", where: { id: id } }],
    });
  } catch (error) {
    console.error(
      "------> Unable to connect to database to get SUBJECTS with Professors: " +
        error
    );
  }
};
const allSubjectsProfessors = async () => {
  try {
    await DB.authenticate();
    console.log("------> DB CONNECTED");
    return SubjectModel.findAll({
      include: [{ model: UserModel, as: "Users" }],
    });
  } catch (error) {
    console.error(
      "------> Unable to connect to database to get SUBJECTS with Professors: " +
        error
    );
  }
};

const createSubject = async (name) => {
  try {
    await DB.authenticate();
    console.log("------> DB CONNECTED");

    const exist = await SubjectModel.findOne({
      where: {
        name: name.charAt(0).toUpperCase() + name.slice(1),
      },
    });

    if (exist) return null;

    return SubjectModel.create({
      name: name.charAt(0).toUpperCase() + name.slice(1),
    });
  } catch (error) {
    console.error(
      "------> Unable to connect to database to create SUBJECT: " + error
    );
  }
};

const linkProfessorToSubject = async (idProfessor, idSubject) => {
  try {
    await DB.authenticate();

    console.log("------> DB CONNECTED");

    let link = await ProfessorSubjectModel.findOne({
      where: {
        id_user: idProfessor,
        id_subject: idSubject,
      },
    });

    if (link) return null;

    return await ProfessorSubjectModel.create({
      id_user: idProfessor,
      id_subject: idSubject,
    });
  } catch (error) {
    console.error(
      "------> Unable to connect to database to get SUBJECTS with Professors: " +
        error
    );
  }
};

const unlinkProfessorToSubject = async (idProfessor, idSubject) => {
  try {
    await DB.authenticate();

    console.log("------> DB CONNECTED");

    let link = await ProfessorSubjectModel.findOne({
      where: {
        id_user: idProfessor,
        id_subject: idSubject,
      },
    });

    if (!link) return false;

    await link.destroy();

    return true;
  } catch (error) {
    console.error(
      "------> Unable to connect to database to get SUBJECTS with Professors: " +
        error
    );
  }
};

const getSubjectInfo = async (idSubject, idProfessor) => {
  try {
    await DB.authenticate();

    console.log("------> DB CONNECTED");

    let link = await ProfessorSubjectModel.findOne({
      where: {
        id_user: idProfessor,
        id_subject: idSubject,
      },
    });

    if (!link) return null;

    let subject = await SubjectModel.findByPk(link.id_subject, {
      include: [
        { model: ScheduleModel, as: "Schedules" },
        { model: RegistrationModel, as: "Regitrations" },
      ],
    });

    return subject;
  } catch (error) {
    console.error(
      "------> Unable to connect to database to get SUBJECTS with Professors: " +
        error
    );
  }
};

module.exports = {
  allSubjects,
  createSubject,
  allSubjectsProfessors,
  linkProfessorToSubject,
  unlinkProfessorToSubject,
  getSubjectInfo,
  allSubjectsOfOneProfessors,
};
