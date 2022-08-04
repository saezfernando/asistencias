const regexEmail =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const handleSubmit = (evt) => {
  evt.preventDefault();
  const user = {
    email: document.querySelector("#inp-email").value.toLowerCase(),
    password: document.querySelector("#inp-pass").value,
    dni: document.querySelector("#inp-dni").value,
    first_name: document.querySelector("#inp-firstName").value,
    last_name: document.querySelector("#inp-lastName").value,
  };

  //console.table(user)

  if (
    !user.email ||
    !user.password ||
    !user.first_name ||
    !user.last_name ||
    !user.dni
  ) {
    alert("No completó todos los campos.");
    return false;
  }

  if (!regexEmail.test(user.email)) {
    alert("Correo invalido.");
    return false;
  }

  fetch("/auth/signUp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: user }),
  }).then((res) => {
    if (res.status !== 201) return alert("algo salió mal");
    location.replace("/Student");
  });

  return false;
};

const ingresar = (evt) => {
  evt.preventDefault();

  const errorSpan = document.querySelector("#span");
  const user = {
    email: document.querySelector("#emailLog").value.toLowerCase(),
    password: document.querySelector("#passLog").value,
  };

  // console.log(user);

  if (!user.email || !user.password) {
    errorSpan.classList.add("login-error-on");
    return;
  }

  fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).then((res) => {
    console.log(res);
    if (res.status === 404 || res.status === 401)
      errorSpan.classList.add("login-error-on");
    console.log("todo ok");
    location.reload();
  });
};

document.onkeydown = function (evt) {
  if (document.getElementsByClassName("modal").length !== 0) {
    //console.log(document.getElementsByClassName("modal"))
    evt = evt || window.event;
    if (evt.keyCode == 27) {
      toggleSignForm();
    }
  }
};

function toggleSignForm() {
  document.getElementById("modal").classList.toggle("modal");
  //document.getElementById("imgIndex").classList.toggle("on-back");
  document.getElementById("div").classList.toggle("on-back");
}

function fadeSpan() {
  if (document.querySelector("#span") !== null)
    document.querySelector("#span").classList.remove("login-error-on");
}

function fadeSignMessage() {
  document.querySelector("#signYes").classList.toggle("modal");
  document.querySelector("#signYes").classList.toggle("modal-off-msg");
}
