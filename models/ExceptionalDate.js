const { Model, DataTypes } = require("sequelize");
const DB = require("./DB");
const Subject = require("./Subject");
class ExceptionalDate extends Model {}

ExceptionalDate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_subject: {
      type: DataTypes.INTEGER,
    },
    day: {
      type: DataTypes.INTEGER,
    },
    month: {
      type: DataTypes.INTEGER,
    },
  },
  { sequelize: DB, modelName: "exceptional_dates", timestamps: false }
);

/* ExceptionalDate.belongsTo(Subject, {
  as: "Subject",
  foreignKey: "id_subject",
});

Subject.hasMany(ExceptionalDate, {
  as: "Exceptionals",
  foreignKey: "id_exceptionalDate",
});
 */
module.exports = ExceptionalDate;
