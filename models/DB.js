const Sequelize = require("sequelize");

const db = new Sequelize(`ULP_system`, "root", "", {
  host: process.env.HOST,
  dialect: "mysql",
});

module.exports = db;
