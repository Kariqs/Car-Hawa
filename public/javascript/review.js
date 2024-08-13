const postReview = async (btn) => {
  const productId = btn.parentNode.querySelector("[name=productId]").value;
  const review = btn.parentNode.querySelector("[name=review]").value.trim();
  const rating = btn.parentNode.querySelector("[name=rating]").value.trim();

  if (!review || !rating) {
    return alert("Please enter both a review and a rating.");
  }

  const ratingValue = parseInt(rating, 10);
  if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
    return alert("Please enter a valid rating between 1 and 5.");
  }

  btn.disabled = true;

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

    if (!response.ok) {
      throw new Error("Failed to post review");
    }

    btn.parentNode.querySelector("[name=review]").value = "";
    btn.parentNode.querySelector("[name=rating]").value = "";

    alert("Your review has been sent.");
  } catch (err) {
    console.log("Error:", err);
  } finally {
    btn.disabled = false;
  }
};
