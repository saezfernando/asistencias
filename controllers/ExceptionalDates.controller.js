const DB = require("../models/DB");
const ExceptionalDateModel = require("../models/ExceptionalDate");
const { getSubjectInfo } = require("./Subject.controller");
const { getAllMonths, indexToDate } = require("../helpers/dates");

const addExceptionalDate = async (req, res, next) => {
  const idProfessor = req.session.idUser;
  const idSubject = req.params.id;
  const { day, month } = req.body;

  console.log(day, month);
  try {
    await DB.authenticate();
    console.log("------> DB CONNECTED");

    const subject = await getSubjectInfo(idSubject, idProfessor);
    const horaries = subject.Schedules;

    const validDays = new Set();
    horaries.map((h) => {
      validDays.add(h.dayOfWeek);
    });

    const months = getAllMonths();
    const validMonths = months.map((m) => {
      const validMonth = [];
      m.map((d) => {
        if (validDays.has(indexToDate(d.getDay()))) {
          validMonth.push(d);
        }
      });
      return validMonth;
    });

    if (!validMonths[month - 1].some((d) => d.getDate() == day))
      return res.status(404).send();

    const exists = await ExceptionalDateModel.findOne({
      where: {
        id_subject: idSubject,
        day: day,
        month: month,
      },
    });

    if (exists) return res.status(409).send();

    const entry = await ExceptionalDateModel.create({
      id_subject: idSubject,
      day: day,
      month: month,
    });

    if (!entry) res.status(500).sned();

    return res.status(201).send();
  } catch (err) {
    console.log(
      "Unable to connect to database to create exceptional date " + err
    );
  }
};

const getExceptionalDates = async (idSubject) => {
  try {
    await DB.authenticate();
    console.log("------> DB CONNECTED");

    return ExceptionalDateModel.findAll({
      where: {
        id_subject: idSubject,
      },
    });
  } catch (err) {
    console.log(
      "Unable to connect to database to get exceptional dates " + err
    );
  }
};

const deleteExceptionalDates = async (req, res, next) => {
  const { id_exceptional } = req.body;

  try {
    await DB.authenticate();
    console.log("------> DB CONNECTED");

    const date = await ExceptionalDateModel.findByPk(id_exceptional);

    if (!date) return res.status(404).send();

    date
      .destroy()
      .then((ok) => {
        return res.status(201).send();
      })
      .catch((err) => {
        return res.status(500).send();
      });
  } catch (err) {
    console.log(
      "Unable to connect to database to get exceptional dates " + err
    );
  }
};

module.exports = {
  addExceptionalDate,
  getExceptionalDates,
  deleteExceptionalDates,
};
