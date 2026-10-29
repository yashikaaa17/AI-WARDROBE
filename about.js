document.getElementById("feedbackForm").onsubmit = function(event) {
    event.preventDefault();

    let name = document.getElementById("fbName").value.trim();
    let email = document.getElementById("fbEmail").value.trim();
    let rating = document.getElementById("fbRating").value;
    let message = document.getElementById("fbMessage").value.trim();

    if (name == "" || email == "" || rating == "" || message == "") {
        alert("Please fill all fields");
        return;
    }

    let feedback = {name, email, rating, message};

    let data = JSON.parse(localStorage.getItem("feedbacks") || "[]");
    data.push(feedback);

    localStorage.setItem("feedbacks", JSON.stringify(data));

    document.getElementById("feedbackResult").innerText =
        "Thank you for your feedback! ";

    document.getElementById("feedbackForm").reset();
};