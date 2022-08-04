window.onload = function () {
  /* const week = JSON.stringify(course.week);
  //console.log(week)
  for (const day in week) {
    if (week[day].scheduled) {
      document
        .getElementById(`${day}start${week[day].startAt}`)
        .setAttribute("selected", true);
      document
        .getElementById(`${day}end${week[day].endAt}`)
        .setAttribute("selected", true);
    }
  } */
};

function preventSubmit() {
  return false;
}
function logout() {
  console.log("chau");
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/auth/logout", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Response
      var response = this.responseText;
    }
  };
  xhttp.send();
  setTimeout(() => {
    location.replace("/");
  }, 700);
}

function validateHours(day) {
  const startAt = document.querySelector(`#${day}StartSelect`),
    endAt = document.querySelector(`#${day}EndSelect`);
  let hours = [
    startAt[startAt.selectedIndex].value,
    endAt[endAt.selectedIndex].value,
  ];
  hours = [hours[0].split(":"), hours[1].split(":")];

  if (parseInt(hours[0][0]) > parseInt(hours[1][0])) {
    alert("La hora de finalizacion no puede ser anterior a la de inicio");
    return false;
  }
  if (
    hours[0][0] == hours[1][0] &&
    parseInt(hours[0][1]) > parseInt(hours[1][1])
  ) {
    alert("La hora de finalizacion no puede ser anterior a la de inicio");
    return false;
  }
  console.log(hours);
}

function deleteStudent(idStudent) {
  const idSubject = document.querySelector(".subjectName").id;

  fetch("/Professor/deleteStudent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idStudent, idSubject: parseInt(idSubject) }),
  }).then((res) => {
    if (res.status == 201) {
      location.reload();
    }
    console.log(res);
  });
}

function acceptStudent(idStudent) {
  const idSubject = document.querySelector(".subjectName").id;

  fetch("/Professor/acceptStudent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idStudent, idSubject: parseInt(idSubject) }),
  }).then((res) => {
    if (res.status == 201) {
      location.reload();
    }
    console.log(res);
  });
}

function addHorary() {
  const idSubject = document.querySelector(".subjectName").id;

  if (
    parseInt(document.querySelector("#startAtHour").value) >
    parseInt(document.querySelector("#endAtHour").value)
  ) {
    alert("No es un horario válido, intente nuevamente");
    return;
  }

  if (
    parseInt(document.querySelector("#startAtHour").value) ==
      parseInt(document.querySelector("#endAtHour").value) &&
    parseInt(document.querySelector("#startAtMinutes").value) <
      parseInt(document.querySelector("#endAtMinutes").value)
  ) {
    alert("No es un horario válido, intente nuevamente");
    return;
  }

  const startTime =
    `${
      document.querySelector("#startAtHour").value.toString().length == 1
        ? "0" + document.querySelector("#startAtHour").value.toString()
        : document.querySelector("#startAtHour").value.toString()
    }` +
    ":" +
    `${
      document.querySelector("#startAtMinutes").value.toString().length == 1
        ? "0" + document.querySelector("#startAtMinutes").value.toString()
        : document.querySelector("#startAtMinutes").value.toString()
    }`;

  const endTime =
    `${
      document.querySelector("#endAtHour").value.toString().length == 1
        ? "0" + document.querySelector("#endAtHour").value.toString()
        : document.querySelector("#endAtHour").value.toString()
    }` +
    ":" +
    `${
      document.querySelector("#endAtMinutes").value.toString().length == 1
        ? "0" + document.querySelector("#endAtMinutes").value.toString()
        : document.querySelector("#endAtMinutes").value.toString()
    }`;

  const day =
    document.querySelector("#dayOfWeek")[
      document.querySelector("#dayOfWeek").selectedIndex
    ].value;

  if (endTime.length !== 5 || startTime.length !== 5) {
    alert("No es un horario válido, intente nuevamente");
    return;
  }

  const horary = {
    dayOfWeek: day,
    endAt: endTime,
    startAt: startTime,
  };

  fetch("/Professor/addHorary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idSubject, horary }),
  }).then((res) => {
    if (res.status == 201) return location.reload();

    if (res.status == 409)
      return alert("El horario que intenta agregar ya se encuentra agregado");
    return console.log("error: " + res.statusText);
  });
}

function deleteHorary(id) {
  fetch("/Professor/deleteHorary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idHorary: id }),
  }).then((res) => {
    if (res.status == 201) return location.reload();

    console.log("error: " + res.statusText);
  });
}

function addExceptionalDate() {
  const idSubject = document.querySelector(".subjectName").id;
  const date = document.querySelector("#exceptionalDate").value;
  // console.log(new Date(Date.now()).toDateString(), "dateString");
  // console.log(new Date(Date.now()).toLocaleDateString(), "localedateString");
  // console.log(new Date(Date.now()).toLocaleString(), "localeString");

  if (!date || new Date(date).getTime() < new Date(Date.now()).getTime())
    return alert("No ha seleccionado una fecha");

  const [, month, day] = date.split("-");
  // console.log(day, month);

  fetch(`/Professor/${idSubject}/addExceptionalDate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ day: parseInt(day), month: parseInt(month) }),
  }).then((res) => {
    if (res.status !== 201)
      return alert("La fecha que seleccionó no es válida, intente nuevamente");
    location.reload();
  });
}

function deleteExceptionalDate(id) {
  fetch(`/Professor/deleteExceptionalDate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_exceptional: id }),
  }).then((res) => {
    if (res.status !== 201) return alert("Hubo un error, intente nuevamente");
    location.reload();
  });
}
