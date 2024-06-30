document.addEventListener("DOMContentLoaded", (event) => {
  const table = document.getElementById("myTable");
  const tbody = table.querySelector("tbody");
  const rows = tbody.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const firstCell = rows[i].getElementsByTagName("td")[0];
    firstCell.textContent = i + 1;
  }
});

const addProductButtonElement = document.getElementById("add");
const cancelButtonElement = document.getElementById("cancel");
const backDropDivElement = document.querySelector(".form-div");
addProductButtonElement.addEventListener("click", () => {
  backDropDivElement.style.display = "block";
});

cancelButtonElement.addEventListener("click", () => {
  backDropDivElement.style.display = "none";
});
