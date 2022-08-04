const { Model, DataTypes } = require("sequelize");
const DB = require("./DB");
const User = require("./User");
const Subject = require("./Subject");

class Registration extends Model {}

Registration.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
    },
    id_subject: {
      type: DataTypes.INTEGER,
    },
    validated: {
      type: DataTypes.BOOLEAN,
    },
  },
  { sequelize: DB, modelName: "registrations", timestamps: false }
);

Registration.hasOne(User, {
  as: "User",
  foreignKey: "id",
});
Registration.hasOne(Subject, {
  as: "Subject",
  foreignKey: "id",
});

Registration.belongsTo(User, {
  as: "RegistrationOfUser",
  foreignKey: "id_user",
});
Registration.belongsTo(Subject, {
  as: "RegistrationToSubject",
  foreignKey: "id_subject",
});

User.hasMany(Registration, {
  as: "RegistrationsOfUser",
  foreignKey: "id_user",
});

Subject.hasMany(Registration, {
  as: "Regitrations",
  foreignKey: "id_subject",
});

module.exports = Registration;
