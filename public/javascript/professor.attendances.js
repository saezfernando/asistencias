function logout() {
  console.log("chau");

  fetch("/auth/logout", { method: "POST" }).then((res) => {
    location.replace("/");
  });
}

function toggleMonth() {
  const selectElement = document.querySelector("#month");
  const monthSelected = selectElement[selectElement.selectedIndex].value;

  document.querySelector(".div-on").classList.remove("div-on");
  document.querySelector(`#m${monthSelected}`).classList.add("div-on");
}

function wasPresent(attendances, date) {
  return attendances.some((a) => (date = new Date(2022, a.month - 1, a.day)));
}
