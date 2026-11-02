var signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var message = document.getElementById("signupMessage");

    AIWardrobe.call("registerUser", {
        name: document.getElementById("name").value,
        email: document.getElementById("signupEmail").value,
        password: document.getElementById("signupPassword").value,
        confirmPassword: document.getElementById("confirmPassword").value
    }).then(function (result) {
        message.innerText = result.message;

        if (result.ok) {
            signupForm.reset();
            setTimeout(function () {
                window.location.href = "index.html";
            }, 800);
        }
    });
});
