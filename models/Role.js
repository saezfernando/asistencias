const { Model, DataTypes } = require("sequelize");
const DB = require("./DB");

class Role extends Model {}
Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  { sequelize: DB, modelName: "Role", timestamps: false }
);

module.exports = Role;
