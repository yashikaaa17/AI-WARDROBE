function showForm() {
    document.getElementById("addForm").style.display = "block";
}

document.getElementById("clothesForm").onsubmit = function(event) {
    event.preventDefault();

    let name = document.getElementById("clothName").value;
    let category = document.getElementById("clothCategory").value;
    let image = document.getElementById("clothImage").value;

    let card = document.createElement("div");
    card.className = "clothes-card";

    let img = document.createElement("img");
    img.src = image;
    img.alt = name;

    let heading = document.createElement("h3");
    heading.textContent = name;

    let detail = document.createElement("p");
    detail.textContent = category;

    card.append(img, heading, detail);

    document.querySelector(".clothes").appendChild(card);

    document.getElementById("clothesForm").reset();
    document.getElementById("addForm").style.display = "none";

    alert("Clothing added successfully!");
};
