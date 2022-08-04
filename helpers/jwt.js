const { sign, verify } = require("jsonwebtoken");

const generateToken = (id) => {
  return sign({ id: id }, process.env.SECRET, {
    expiresIn: 60 * 60 * 24 * 7,
  });
};

const checkToken = (token) => {
  return verify(token, process.env.SECRET);
};

module.exports = {
  generateToken,
  checkToken,
};
