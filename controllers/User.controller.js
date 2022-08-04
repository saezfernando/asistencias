const DB = require("../models/DB");
const UserModel = require("../models/User");

const getUser = async (email) => {
  try {
    await DB.authenticate();
    console.log("Dabatase connected");

    return UserModel.findOne({
      where: {
        email: email,
      },
    });
  } catch (err) {
    console.log("Unable to connect to database to get user", err);
  }
};

const getAllStudents = async () => {
  try {
    await DB.authenticate();
    console.log("Dabatase connected");

    return UserModel.findAll({
      where: {
        id_role: 3,
      },
    });
  } catch (err) {
    console.log("Unable to connect to database to get user", err);
  }
};

const getAllProfessors = async () => {
  try {
    await DB.authenticate();
    console.log("Dabatase connected");

    return UserModel.findAll({
      where: {
        id_role: 2,
      },
    });
  } catch (err) {
    console.log("Unable to connect to database to get user", err);
  }
};

module.exports = {
  getUser,
  getAllStudents,
  getAllProfessors,
};
