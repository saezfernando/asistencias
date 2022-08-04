const { Model, DataTypes } = require("sequelize");
const DB = require("./DB");
const Role = require("./Role");
const Subject = require("./Subject");
const UserSubject = require("./User-Subject");
const SubjectUser = require("./User-Subject");

class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    dni: {
      type: DataTypes.INTEGER,
    },
    id_role: {
      type: DataTypes.INTEGER,
    },
  },
  { sequelize: DB, modelName: "User", timestamps: false }
);

User.belongsTo(Role, {
  as: "Role",
  foreignKey: "id_role",
});
/*
Role.hasMany(User, {
  as: "User",
  foreignKey: "id_user",
});*/
/*
User.hasMany(Subject, {
  as: "Subjects",
  foreignKey: "id_subject",
});*/

User.belongsToMany(Subject, {
  as: "Subjects",
  through: SubjectUser,
  foreignKey: "id_user",
});

Subject.belongsToMany(User, {
  as: "Users",
  through: SubjectUser,
  foreignKey: "id_subject",
});
/*
SubjectUser.hasOne(User, {
  as: "User",
  foreignKey: "id_user",
});*/

// SubjectUser.hasOne(Subject, {
//   as: "Subject",
//   foreignKey: "id",
// });

module.exports = User;
