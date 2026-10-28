document.getElementById("signupForm").onsubmit = function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("signupEmail").value.trim();
    let password = document.getElementById("signupPassword").value;
    let confirm = document.getElementById("confirmPassword").value;

    let message = document.getElementById("signupMessage");

    if (name == "" || email == "" || password == "" || confirm == "") {
        message.innerText = "Please fill all the fields";
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        message.innerText = "Please enter a valid email";
    }
    else if (password.length < 8) {
        message.innerText = "Password must have at least 8 characters";
    }
    else if (password !== confirm) {
        message.innerText = "Passwords do not match";
    }
    else {
        message.innerText = "Registration form submitted successfully!";

        let user = {
            name: name,
            email: email
        };

        localStorage.setItem("wardrobeUser", JSON.stringify(user));
        document.getElementById("signupForm").reset();
    }
};
