const postReview = async (btn) => {
  const productId = btn.parentNode.querySelector("[name=productId]").value;
  const review = btn.parentNode.querySelector("[name=review]").value;

  if (!review.trim()) {
    return alert("Please enter a review.");
  }

  try {
    const response = await fetch(`/review/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        review: review,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to post review");
    }

    const data = await response.json();
    console.log("Review posted successfully:", data);
  } catch (err) {
    console.log("Error:", err);
  }
};
