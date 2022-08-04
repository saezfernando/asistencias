const { Model, DataTypes } = require("sequelize");
const DB = require("./DB");
const ScheduleSubject = require("./Schedule-Subject");
const Subject = require("./Subject");

class Schedule extends Model {}

Schedule.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dayOfWeek: {
      type: DataTypes.STRING,
    },
    startAt: {
      type: DataTypes.STRING,
    },
    endAt: {
      type: DataTypes.STRING,
    },
  },
  { sequelize: DB, modelName: "horaries", timestamps: false }
);

// Schedule.hasMany(Subject, {
//   as: "Subjects",
//   foreignKey: "id",
// });

Schedule.belongsToMany(Subject, {
  through: ScheduleSubject,
  foreignKey: "id_horary",
  as: "Subjects",
});

Subject.belongsToMany(Schedule, {
  through: ScheduleSubject,
  foreignKey: "id_subject",
  as: "Schedules",
});

// Subject.hasMany(Schedule, {
//   as: "Schedules",
//   foreignKey: "id",
// });

ScheduleSubject.hasOne(Schedule, {
  as: "Schedule",
  foreignKey: "id",
});

ScheduleSubject.hasOne(Subject, {
  as: "Subject",
  foreignKey: "id",
});

module.exports = Schedule;
