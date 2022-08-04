const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

const encrypt = (pass) => {
  return bcrypt.hash(pass, 10);
};

const comparePass = (pass, hash) => {
  return bcrypt.compare(pass, hash);
};

module.exports = {
  encrypt,
  comparePass,
};
