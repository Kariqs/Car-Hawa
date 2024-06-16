const humButton = document.querySelector(".hum-button");
const sideDrawer = document.getElementById("side-drawer");

humButton.addEventListener("click", () => {
  if ((sideDrawer.style.display === "none")) {
    sideDrawer.style.display = "block";
  } else {
    sideDrawer.style.display = "none";
  }
});
