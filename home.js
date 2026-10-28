let user = JSON.parse(localStorage.getItem("wardrobeUser"));

if (user && user.name) {
    document.getElementById("welcomeText").innerText =
        "Welcome back, " + user.name + "! ";
}