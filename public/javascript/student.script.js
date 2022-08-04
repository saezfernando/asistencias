document.onkeydown = function (evt) {
  if (document.getElementsByClassName("modal").length !== 0) {
    //console.log(document.getElementsByClassName("modal"))
    evt = evt || window.event;
    if (evt.keyCode == 27) {
      toggleInscripForm();
    }
  }
};

const handleSignUpSubject = (evt) => {
  //   console.log(evt);
  evt.preventDefault();

  const selectElement = document.querySelector("#subjects");
  const optionSelected = selectElement[selectElement.selectedIndex];

  const idSubjectSelected = optionSelected.value;

  //   console.log("Id de la materia: " + idSubjectSelected);

  fetch("/Student/signUpSubject", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idSubject: idSubjectSelected }),
  }).then(async (res) => {
    if (res.status !== 201) {
      const data = await res.json();
      const message = data.message;
      showMessage(message, false);
      return;
    }

    showMessage("Solicitud exitosa", true);
    // location.reload();
  });

  return false;
};

function markAttendance(id) {
  fetch("/Student/markAttendance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idSubject: id }),
  }).then(async (res) => {
    if (res.status !== 201) {
      const data = await res.json();
      const message = data.message;
      showAttendanceErrorMessage(message, false, id);
      return;
    }
    showAttendanceErrorMessage("Asistencia marcada!", true, id);

    // location.reload();
  });
}

function toggleInscripForm() {
  //   evt.preventDefault();
  document.getElementById("modal").classList.toggle("modal");
  document.getElementById("misMaterias").classList.toggle("on-back");
  document.getElementById("nav").classList.toggle("on-back");
  document.getElementById("ul").classList.toggle("on-back");
  hideMessage();

  return false;
}

function showMessage(message, status) {
  // const errorModal = document.querySelector("#errorModal");
  // const errorText = document.querySelector("#errorText");
  // errorText.innerText = message;
  // errorModal.classList.add("errorModal-on");
  const msgContainer = document.querySelector("#msgDiv");
  const text = document.querySelector("#msg");
  text.innerText = message;
  msgContainer.classList.add("msgDiv-on", status ? "okStyle" : "errorStyle");
}

function hideMessage() {
  const msgContainer = document.querySelector("#msgDiv");
  msgContainer.classList.remove("msgDiv-on", status ? "okStyle" : "errorStyle");
}

function showAttendanceErrorMessage(message, status, id) {
  // const attendanceErrorModal = document.querySelector("#attendanceErrorModal");
  // const errorText = document.querySelector("#attendanceErrorText");

  // errorText.innerText = message;
  // attendanceErrorModal.classList.add("errorModal-on");
  const msgContainer = document.querySelector(`#span${id}`);
  const text = document.querySelector("#msgMark");
  text.innerText = message;
  msgContainer.classList.add("msgMark-on", status ? "okStyle" : "errorStyle");
}

function closeErrorModal() {
  const errorModal = document.querySelector("#errorModal");
  errorModal.classList.remove("errorModal-on");
}

function closeattendanceErrorModal() {
  const errorModal = document.querySelector("#attendanceErrorModal");
  errorModal.classList.remove("errorModal-on");
}

function logout() {
  console.log("chau");

  fetch("/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    location.replace("/");
  });
}
