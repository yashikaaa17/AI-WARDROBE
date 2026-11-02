var selectedColor = "";
var selectedVibe = "";

var colors = document.querySelectorAll(".colours span");
var styleCards = document.querySelectorAll(".style-card");
var findButton = document.getElementById("findStyle");
var styleResult = document.getElementById("styleResult");

colors.forEach(function (color) {
    color.addEventListener("click", function () {
        var chosen = color.classList[0];

        AIWardrobe.call("getColorMatches", { color: chosen }).then(function (result) {
            if (!result.ok) return;

            document.getElementById("colorTitle").innerText = result.title;
            document.getElementById("matchingColors").innerText = result.matches.join("  •  ");

            colors.forEach(function (c) { c.classList.remove("activeColor"); });
            color.classList.add("activeColor");

            selectedColor = chosen;
            AIWardrobe.call("setPreference", { name: "color", value: chosen });
            styleResult.innerText = "";
            findButton.style.display = "inline-block";
        });
    });
});

styleCards.forEach(function (card) {
    card.addEventListener("click", function () {
        var already = card.classList.contains("activeStyle");

        styleCards.forEach(function (c) { c.classList.remove("activeStyle"); });

        if (already) {
            selectedVibe = "";
        } else {
            card.classList.add("activeStyle");
            selectedVibe = card.querySelector("h3").innerText.trim();
        }
        AIWardrobe.call("setPreference", { name: "vibe", value: selectedVibe });
    });
});

findButton.addEventListener("click", function () {
    AIWardrobe.call("findMyStyle", { color: selectedColor, vibe: selectedVibe }).then(function (result) {
        styleResult.innerText = result.message;

        if (result.ok) {
            window.open(result.url, "_blank", "noopener");
        }
    });
});

AIWardrobe.call("getPreferences").then(function (result) {
    var prefs = result.preferences;

    if (prefs.vibe) {
        styleCards.forEach(function (card) {
            if (card.querySelector("h3").innerText.trim() === prefs.vibe) {
                card.classList.add("activeStyle");
                selectedVibe = prefs.vibe;
            }
        });
    }

    if (prefs.color) {
        var swatch = document.querySelector(".colours span." + prefs.color);
        if (swatch) swatch.click();
    }
});
