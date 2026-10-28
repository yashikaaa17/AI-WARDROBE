
document.addEventListener("DOMContentLoaded", function () {

    var input = document.getElementById("userInput");
    var sendBtn = document.getElementById("sendBtn");
    var image = document.getElementById("outfitImage");
    var title = document.getElementById("outfitTitle");
    var description = document.getElementById("outfitDescription");
    var tryBtn = document.getElementById("tryLookBtn");

    var outfits = {
        summer: ["Summer Look", "Floral top + shorts + sneakers",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"],
        winter: ["Winter Look", "Sweater + jeans + coat + boots",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80"],
        ethnic: ["Ethnic Look", "Traditional suit + jhumkas",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"],
        "date night": ["Date Night Look", "Western dress + heels + handbag",
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80"],
        party: ["Party Look", "Party dress + heels + accessories",
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"],
        spring: ["Spring Look", "Pastel top + light trousers",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"],
        monsoon: ["Monsoon Look", "Light top + trousers + rain-friendly shoes",
            "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80"],
        autumn: ["Autumn Look", "Long-sleeve top + jeans + jacket",
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"],
        college: ["College Look", "White top + blue jeans + sneakers",
            "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80"],
        casual: ["Casual Look", "T-shirt + jeans + sneakers",
            "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80"]
    };

    function recommendOutfit(text) {
        text = text.toLowerCase();

        if (text.includes("kurti") || text.includes("saree") ||
            text.includes("lehenga")) text = "ethnic";

        if (text.includes("birthday")) text = "party";
        if (text.includes("rainy")) text = "monsoon";

        var look = Object.keys(outfits).find(function (key) {
            return text.includes(key);
        });

        if (look) {
            title.innerText = outfits[look][0];
            description.innerText = outfits[look][1];
            image.src = outfits[look][2];
        } else {
            title.innerText = "Style Not Found";
            description.innerText =
                "Try summer, winter, ethnic, date night, party, college or casual.";
        }
    }

    sendBtn.addEventListener("click", function () {
        recommendOutfit(input.value);
    });

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") recommendOutfit(input.value);
    });

    document.querySelectorAll("[data-occasion]").forEach(function (button) {
        button.addEventListener("click", function () {
            input.value = button.getAttribute("data-occasion");
            recommendOutfit(input.value);
        });
    });

    tryBtn.addEventListener("click", function () {
        alert("Try this outfit with clothes from your wardrobe!");
    });

});


