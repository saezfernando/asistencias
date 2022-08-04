const days = {
  1: "Lunes",
  2: "Martes",
  3: "Miercoles",
  4: "Jueves",
  5: "Viernes",
};
const indexs = {
  Lunes: 1,
  Martes: 2,
  Miercoles: 3,
  Jueves: 4,
  Viernes: 5,
};

const monthsNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const dayToIndex = (day) => indexs[day];

const indexToDate = (day) => days[day];
const currentTimeToString = () =>
  `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`;

function generateScheduleDates(schedule) {
  const dateStart = new Date(
    new Date(Date.now()).getFullYear(),
    new Date(Date.now()).getMonth(),
    new Date(Date.now()).getDate(),
    schedule.startAt.split(":")[0],
    schedule.startAt.split(":")[1]
  );

  const dateEnd = new Date(
    new Date(Date.now()).getFullYear(),
    new Date(Date.now()).getMonth(),
    new Date(Date.now()).getDate(),
    schedule.startAt.split(":")[0],
    schedule.startAt.split(":")[1] + 30
  );

  return [dateStart, dateEnd];
}

function getDatesOfMonth(month) {
  const dates = [];

  let year = 2022;

  let daysInMonth /* = new Date(year, month + 1, 0).getDate() */;
  if (month == new Date(Date.now()).getMonth()) {
    daysInMonth = new Date(Date.now()).getDate();
  } else {
    daysInMonth = new Date(year, month + 1, 0).getDate();
  }

  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(new Date(year, month, day));
  }

  return dates;
}
function getAllDatesOfMonth(month) {
  const dates = [];

  let year = 2022;

  let daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(new Date(year, month, day));
  }

  return dates;
}

function getMonths() {
  const months = [];
  for (let month = 0; month <= new Date(Date.now()).getMonth(); month++) {
    months.push(getDatesOfMonth(month));
  }

  return months;
}

function getAllMonths() {
  const months = [];
  for (let month = 0; month <= 11; month++) {
    months.push(getAllDatesOfMonth(month));
  }

  return months;
}

module.exports = {
  dayToIndex,
  indexToDate,
  currentTimeToString,
  generateScheduleDates,
  getMonths,
  getAllMonths,
  monthsNames,
};
