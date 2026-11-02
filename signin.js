var form = document.getElementById("loginForm");
var emailError = document.getElementById("emailError");
var passwordError = document.getElementById("passwordError");
var loginMessage = document.getElementById("loginMessage");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value;

    emailError.innerText = "";
    passwordError.innerText = "";
    loginMessage.innerText = "";

    AIWardrobe.call("loginUser", { email: email, password: password }).then(function (result) {
        if (!result.ok) {
            if (result.field === "password") {
                passwordError.innerText = result.message;
            } else {
                emailError.innerText = result.message;
            }
            return;
        }

        loginMessage.innerText = result.message;
        setTimeout(function () {
            window.location.href = "index.html";
        }, 800);
    });
});

document.getElementById("showPassword").addEventListener("click", function () {
    document.getElementById("password").type = this.checked ? "text" : "password";
});
