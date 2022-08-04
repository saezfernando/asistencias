const { Model, DataTypes } = require("sequelize");
const DB = require("./DB");
// const Schedule = require("./Schedule");
// const Subject = require("./Subject");

class ScheduleSubject extends Model {}

ScheduleSubject.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_horary: {
      type: DataTypes.INTEGER,
    },
    id_subject: {
      type: DataTypes.INTEGER,
    },
  },
  { sequelize: DB, modelName: "subjects-horaries", timestamps: false }
);

module.exports = ScheduleSubject;
