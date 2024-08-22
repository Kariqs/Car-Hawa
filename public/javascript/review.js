const postReview = async () => {
  const productId = document.getElementById("productId").value;
  const review = document.getElementById("review").value.trim();
  const rating = document.getElementById("rating").value.trim();

  if (!review || !rating) {
    return alert("Please enter both a review and a rating.");
  }

  const ratingValue = parseInt(rating, 10);
  if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
    return alert("Please enter a valid rating between 1 and 5.");
  }

  try {
    const response = await fetch(`/review/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        review: review,
        rating: ratingValue,
      }),
    });

    if (response.ok) {
      const message = await response.json();
      document.getElementById("message").style.top = "50%";
      showRes(message.message, undefined);
      document.getElementById("review").value = "";
      document.getElementById("rating").value = "1";
    }
  } catch (err) {
    console.log("Error:", err);
  }
};

const showRes = (message, clas) => {
  document.getElementById("message").style.display = "block";
  document.getElementById("message").textContent = message;
  document.getElementById("message").classList.add(clas);
  setTimeout(() => {
    document.getElementById("message").style.display = "none";
    document.getElementById("message").classList.remove(clas);
  }, 2000);
};
