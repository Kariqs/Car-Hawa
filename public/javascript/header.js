const humButton = document.querySelector(".hum-button");
const sideDrawer = document.getElementById("side-drawer");

if (!sideDrawer.style.display) {
  sideDrawer.style.display = "none";
}

humButton.addEventListener("click", () => {
  if (sideDrawer.style.display === "none" || sideDrawer.style.display === "") {
    sideDrawer.style.display = "block";
  } else {
    sideDrawer.style.display = "none";
  }
});
