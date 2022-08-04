const { Model, DataTypes } = require("sequelize");
const DB = require("./DB");
const Registration = require("./Registration");
class Attendance extends Model {}

Attendance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_registration: {
      type: DataTypes.INTEGER,
    },
    day: {
      type: DataTypes.INTEGER,
    },
    month: {
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  { sequelize: DB, modelName: "Attendance", timestamps: false }
);

Attendance.belongsTo(Registration, {
  as: "Registration",
  foreignKey: "id_registration",
});

Registration.hasMany(Attendance, {
  as: "Attendances",
  foreignKey: "id_registration",
});

module.exports = Attendance;
