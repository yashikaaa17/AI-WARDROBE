var clothesGrid = document.querySelector(".clothes");
var addForm = document.getElementById("addForm");
var clothesForm = document.getElementById("clothesForm");
var filterButtons = document.querySelectorAll(".categories button");
var activeCategory = "All";

function showForm() {
    addForm.style.display = "block";
}

function buildCard(item) {
    var card = document.createElement("div");
    card.className = "clothes-card";
    card.setAttribute("data-category", item.category);

    var img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;

    var heading = document.createElement("h3");
    heading.textContent = item.name;

    var detail = document.createElement("p");
    detail.textContent = item.detail || item.category;

    card.append(img, heading, detail);
    return card;
}

function applyFilter() {
    clothesGrid.querySelectorAll(".clothes-card").forEach(function (card) {
        var show = activeCategory === "All" || card.getAttribute("data-category") === activeCategory;
        card.classList.toggle("hidden", !show);
    });
}

AIWardrobe.call("listClothes", { category: "All" }).then(function (result) {
    result.items.forEach(function (item) {
        clothesGrid.appendChild(buildCard(item));
    });
    return AIWardrobe.call("getPreferences");
}).then(function (result) {
    activeCategory = result.preferences.filter || "All";
    applyFilter();
});

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        activeCategory = button.textContent.trim();
        AIWardrobe.call("setPreference", { name: "filter", value: activeCategory });
        applyFilter();
    });
});

clothesForm.addEventListener("submit", function (event) {
    event.preventDefault();

    AIWardrobe.call("addClothingItem", {
        name: document.getElementById("clothName").value,
        category: document.getElementById("clothCategory").value,
        image: document.getElementById("clothImage").value
    }).then(function (result) {
        if (!result.ok) {
            alert(result.message);
            return;
        }

        clothesGrid.appendChild(buildCard(result.item));
        applyFilter();
        clothesForm.reset();
        addForm.style.display = "none";
        alert(result.message);
    });
});
