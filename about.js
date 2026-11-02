document.getElementById("feedbackForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var form = this;

    AIWardrobe.call("submitFeedback", {
        name: document.getElementById("fbName").value,
        email: document.getElementById("fbEmail").value,
        rating: document.getElementById("fbRating").value,
        message: document.getElementById("fbMessage").value
    }).then(function (result) {
        if (!result.ok) {
            alert(result.message);
            return;
        }

        document.getElementById("feedbackResult").innerText = result.message;
        form.reset();
    });
});
