const DB = require("../models/DB");
const UserModel = require("../models/User");
const { encrypt, comparePass } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

const validateUser = async (req, res, next) => {
  // console.log(req.body);
  const { email, password } = req.body;

  try {
    await DB.authenticate();
    console.log("-----------> Dabatase connected");

    const user = await UserModel.findOne({
      where: {
        email: email,
      },
      include: "Role",
    });

    if (!user) res.status(404).send();

    if (!(await comparePass(password, user.password))) res.status(401).send();
    // console.log(user.Role.name);

    req.session.token = generateToken(user.id);
    req.session.role = user.Role.name;
    req.session.email = email;
    req.session.idUser = user.id;

    res.status(200).redirect("/" + user.Role.name);
  } catch (err) {
    console.error("Unable to connect to database to get user", err);
  }
};

const registerUser = async (req, res, next) => {
  const { user } = req.body;
  // console.log(user);

  try {
    await DB.authenticate();
    console.log("-----------> Dabatase connected");

    UserModel.findOne({
      where: {
        email: user.email,
      },
    }).then((exist) => {
      if (exist) return res.status(409).send();
    });

    const userCreated = await UserModel.create({
      ...user,
      password: await encrypt(user.password),
      id_role: 3,
    });

    if (!userCreated) res.status(304).send();

    req.session.token = generateToken(userCreated.id);
    req.session.role = "Student";
    req.session.email = user.email;
    req.session.idUser = userCreated.id;

    res.status(201).send();
  } catch (err) {
    console.error("Unable to connect to database to register user", err);
  }
};

module.exports = {
  validateUser,
  registerUser,
};
