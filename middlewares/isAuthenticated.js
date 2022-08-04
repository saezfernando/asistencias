const { checkToken } = require("../helpers/jwt");

const isAuthenticated = (req, res, next) => {
  if (!req.session.token || !checkToken(req.session.token)) {
    console.log("----------------> No está autenticado");

    return res.status(403).redirect("/");
  }
  console.log("----------------> Está autenticado");
  next();
};

module.exports = {
  isAuthenticated,
};
