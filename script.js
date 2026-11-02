document.addEventListener("DOMContentLoaded", function () {

    var input = document.getElementById("userInput");
    var sendBtn = document.getElementById("sendBtn");
    var image = document.getElementById("outfitImage");
    var title = document.getElementById("outfitTitle");
    var description = document.getElementById("outfitDescription");
    var tryBtn = document.getElementById("tryLookBtn");
    var currentLook = "casual";

    function showOutfit(text) {
        AIWardrobe.call("recommendOutfit", { query: text }).then(function (result) {
            if (result.ok) {
                currentLook = result.key;
                title.innerText = result.title;
                description.innerText = result.description;
                image.src = result.image;
            } else {
                title.innerText = result.title || "Style Not Found";
                description.innerText = result.message;
            }
        });
    }

    AIWardrobe.call("getPreferences").then(function (result) {
        if (result.preferences.lastLook) showOutfit(result.preferences.lastLook);
    });

    sendBtn.addEventListener("click", function () {
        showOutfit(input.value);
        input.value = "";
    });

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            showOutfit(input.value);
            input.value = "";
        }
    });

    document.querySelectorAll("[data-occasion]").forEach(function (button) {
        button.addEventListener("click", function () {
            showOutfit(button.getAttribute("data-occasion"));
        });
    });

    tryBtn.addEventListener("click", function () {
        AIWardrobe.call("suggestFromWardrobe", { look: currentLook }).then(function (result) {
            alert(result.message);
        });
    });

});
