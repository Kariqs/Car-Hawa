// JavaScript to handle the rating selection
let ratingValue = 0;

document.querySelectorAll('.rating-container .fa-star').forEach(star => {
    star.addEventListener('click', function () {
        ratingValue = this.getAttribute('data-value'); // Get the rating value from the clicked star
        // Update the appearance of the stars
        document.querySelectorAll('.rating-container .fa-star').forEach(s => {
            s.classList.remove('selected');
        });
        this.classList.add('selected');
        let previousSibling = this.previousElementSibling;
        while (previousSibling) {
            previousSibling.classList.add('selected');
            previousSibling = previousSibling.previousElementSibling;
        }
    });
});

const postReview = async () => {
    const productId = document.getElementById("productId").value;
    const review = document.getElementById("review").value.trim();
    const isLoggedIn = document.getElementById("user").value;

    // Check if review and rating are provided
    if (!review || ratingValue === 0) {
        document.getElementById("message").style.top = "50%";
        showRes("Review and Rating can't be empty.", "error");
        return;
    }

    // Check if the user is logged in
    if (!isLoggedIn) {
        document.getElementById("message").style.top = "50%";
        showRes("Kindly Log In First", "error");
        return;
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
            ratingValue = 0; // Reset rating
            document.querySelectorAll('.rating-container .fa-star').forEach(star => star.classList.remove('selected'));
        }
    } catch (err) {
        console.log("Error:", err);
    }
};

const showRes = (message, clas) => {
    const msgDiv = document.getElementById("message");
    msgDiv.style.display = "block";
    msgDiv.textContent = message;
    msgDiv.classList.add(clas);
    setTimeout(() => {
        msgDiv.style.display = "none";
        msgDiv.classList.remove(clas);
    }, 2000);
};
