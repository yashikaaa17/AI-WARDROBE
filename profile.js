function renderProfile() {
    return AIWardrobe.call("getProfile").then(function (result) {
        if (!result.ok) {
            window.location.href = "signin.html";
            return;
        }

        var p = result.profile;
        document.getElementById("profileAvatar").textContent = p.name.trim().charAt(0).toUpperCase();
        document.getElementById("profileName").textContent = p.name;
        document.getElementById("profileEmail").textContent = p.email;
        document.getElementById("profileSince").textContent = p.createdAt
            ? "Member since " + new Date(p.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
            : "";
        document.getElementById("statItems").textContent = p.items;
        document.getElementById("statFeedback").textContent = p.feedbacks;
        document.getElementById("profileNameInput").value = p.name;
        document.getElementById("profileEmailInput").value = p.email;
    });
}

document.getElementById("profileForm").addEventListener("submit", function (event) {
    event.preventDefault();

    AIWardrobe.call("updateProfile", {
        name: document.getElementById("profileNameInput").value
    }).then(function (result) {
        document.getElementById("profileMessage").textContent = result.message;
        if (result.ok) {
            renderProfile();
            AIWardrobe.refreshNav();
        }
    });
});

document.getElementById("passwordForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var form = this;

    AIWardrobe.call("changePassword", {
        currentPassword: document.getElementById("currentPassword").value,
        newPassword: document.getElementById("newPassword").value,
        confirmPassword: document.getElementById("confirmNewPassword").value
    }).then(function (result) {
        document.getElementById("passwordMessage").textContent = result.message;
        if (result.ok) form.reset();
    });
});

document.getElementById("profileLogout").addEventListener("click", function () {
    AIWardrobe.call("logoutUser").then(function () {
        window.location.href = "index.html";
    });
});

renderProfile();
