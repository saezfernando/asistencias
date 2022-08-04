const isCoordinator = (req, res, next) => {
  if (req.session.role !== "Coordinator") res.status(401).send();
  console.log("---------------> Coordinador autorizado");
  next();
};
const isProfessor = (req, res, next) => {
  if (req.session.role !== "Professor") res.status(401).send();
  console.log("---------------> Profesor autorizado");
  next();
};
const isStudent = (req, res, next) => {
  if (req.session.role !== "Student") res.status(401).send();
  console.log("---------------> Estudiante autorizado");
  next();
};

const isNotStudent = (req, res, next) => {
  if (req.session.role == "Student") res.status(401).send();
  console.log("---------------> Estudiante autorizado");
  next();
};

module.exports = {
  isCoordinator,
  isProfessor,
  isStudent,
  isNotStudent,
};
