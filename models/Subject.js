const { Model, DataTypes } = require("sequelize");
const DB = require("./DB");
const User = require("./User");
const UserSubject = require("./User-Subject");

class Subject extends Model {}

Subject.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    average: {
      type: DataTypes.FLOAT,
    },
  },
  { sequelize: DB, modelName: "Subject", timestamps: false }
);

module.exports = Subject;
