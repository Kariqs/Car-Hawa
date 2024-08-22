let cartItemCount = document.getElementById("cq").value;
document.getElementById("cart-quantity").textContent = cartItemCount;

const addToCart = async () => {
  try {
    const productId = document.getElementById("productId").value;
    console.log(productId);
    const response = await fetch("/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId: productId }),
    });

    if (response.ok) {
      const results = await response.json();
      cartItemCount = +cartItemCount + 1;
      showMessage(results.message, undefined);
      document.getElementById("cart-quantity").textContent = cartItemCount;
    } else {
      alert("Kindly login.");
    }
  } catch (error) {
    console.log(error);
  }
};

const showMessage = (message, clas) => {
  document.getElementById("message").style.display = "block";
  document.getElementById("message").textContent = message;
  document.getElementById("message").classList.add(clas);
  setTimeout(() => {
    document.getElementById("message").style.display = "none";
    document.getElementById("message").classList.remove(clas);
  }, 2000);
};


