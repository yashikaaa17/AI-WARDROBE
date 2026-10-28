let form = document.getElementById("loginForm");

form.onsubmit = function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;

    document.getElementById("emailError").innerText = "";
    document.getElementById("passwordError").innerText = "";
    document.getElementById("loginMessage").innerText = "";

    let valid = true;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("emailError").innerText =
            "Please enter a valid email";
        valid = false;
    }

    if (password.length < 8) {
        document.getElementById("passwordError").innerText =
            "Password must have at least 8 characters";
        valid = false;
    }

    if (valid) {
        document.getElementById("loginMessage").innerText =
            "Login form submitted successfully!";
    }
};
document.getElementById("showPassword").onclick = function() {
    let password = document.getElementById("password");

    if (this.checked) {
        password.type = "text";
    } else {
        password.type = "password";
    }
};
