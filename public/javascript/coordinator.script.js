//----------------- Constantes

const regexEmail =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

//------------------ Funcionales

const createSubject = (evt) => {
  evt.preventDefault();

  const subjectName = document.querySelector("#subjectName").value;

  fetch("/coordinator/subject", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: subjectName }),
  }).then((res) => {
    if (res.status === 201) return location.reload();
    const span = document.querySelector(".addSubjError");
    span.classList.add("error-on");
    // console.log("error a manejar");
  });
  console.log("acá");
};
const createProfessor = (evt) => {
  evt.preventDefault();

  const professor = {
    email: document.querySelector("#inp-email").value,
    password: document.querySelector("#inp-pass").value,
    dni: document.querySelector("#inp-dni").value,
    first_name: document.querySelector("#inp-firstName").value,
    last_name: document.querySelector("#inp-lastName").value,
  };

  //console.table(professor)

  if (
    !professor.email ||
    !professor.password ||
    !professor.first_name ||
    !professor.last_name ||
    !professor.dni
  ) {
    alert("No completó todos los campos.");
    return false;
  }

  if (!regexEmail.test(professor.email)) {
    alert("Correo invalido.");
    return false;
  }

  fetch("/Coordinator/addProf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ professorBody: professor }),
  }).then((res) => {
    if (res.status === 201) {
      document.querySelector("#inp-email").value = "";
      document.querySelector("#inp-pass").value = "";
      document.querySelector("#inp-dni").value = "";
      document.querySelector("#inp-firstName").value = "";
      document.querySelector("#inp-lastName").value = "";
      return location.reload();
    }
    const span = document.querySelector(".addProfError");
    span.classList.add("error-on");
    // console.log("error a manejar");
  });
  //   console.log("acá");
};

function linkProf(idSubject) {
  const selectElement = document.querySelector(`#select${idSubject}`);
  const idProfessor = selectElement[selectElement.selectedIndex].value;

  fetch("/Coordinator/linkProf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idProfessor, idSubject }),
  }).then((res) => {
    if (res.status !== 201) {
      alert("Este profesor ya se encuentra asignado a esta materia");
      return;
    }

    location.reload();
  });
}
function unlinkProf(idSubject) {
  const selectElement = document.querySelector(`#select${idSubject}`);
  const idProfessor = selectElement[selectElement.selectedIndex].value;

  //   console.log(idProfessor);

  fetch("/Coordinator/unlinkProf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idProfessor, idSubject }),
  }).then((res) => {
    if (res.status !== 201) {
      alert("Este profesor no se encuentra asignado a esta materia");
      return;
    }

    location.reload();
  });
}

function logout() {
  console.log("chau");

  fetch("/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }).then((res) => {
    location.replace("/");
  });
}

function goToConflics() {
  location.replace("/Conflicts");
}

// ------------- Visuales

function toggleMngModal() {
  const backModal = document.querySelector(".backModal");
  const modal = document.querySelector(".modalManageSubject");

  backModal.classList.toggle("modal-on");
  modal.classList.toggle("modal-on");
}

function toggleAddProfessorModal() {
  const backModal = document.querySelector(".backModal");
  const modal = document.querySelector(".modalAddProfessor");

  backModal.classList.toggle("modal-on");
  modal.classList.toggle("modal-on");
}

function togglelAddSubjectModal() {
  const backModal = document.querySelector(".backModal");
  const modal = document.querySelector(".modalAddSubject");

  backModal.classList.toggle("modal-on");
  modal.classList.toggle("modal-on");
}

function hideSubjError() {
  const span = document.querySelector(".addSubjError");
  span.classList.remove("error-on");
}

function hideProfError() {
  const span = document.querySelector(".addProfError");
  span.classList.remove("error-on");
}
