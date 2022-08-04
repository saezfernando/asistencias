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
