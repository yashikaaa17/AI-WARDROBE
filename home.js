(function () {
    var welcome = document.getElementById("welcomeText");
    if (!welcome) return;

    AIWardrobe.call("getCurrentUser").then(function (result) {
        if (result.user) {
            welcome.innerText = "Welcome back, " + result.user.name + "! ";
        }
    });
})();
