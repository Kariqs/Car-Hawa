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

const image = document.getElementById("image");
const form = document.getElementById("productForm");

image.addEventListener("change", function (event) {
  const file = event.target.files[0];
  const imagePreviewDiv = document.querySelector(".previewDiv");
  const imagePreview = document.getElementById("imagePreview");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreviewDiv.style.display = "block";
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.src = "";
    imagePreviewDiv.style.display = "none";
    imagePreview.style.display = "none";
  }
});

form.addEventListener("reset", function () {
  const imagePreviewDiv = document.querySelector(".previewDiv");
  const imagePreview = document.getElementById("imagePreview");
  imagePreview.src = "";
  imagePreviewDiv.style.display = "none";
  imagePreview.style.display = "none";
});
