let pinterestColor = "";
let combinations = {
    purple: ["White", "Beige", "Light Grey"],
    pink: ["White", "Cream", "Brown"],
    beige: ["White", "Brown", "Black"],
    black: ["White", "Grey", "Pink"],
    blue: ["White", "Beige", "Navy Blue"]
};

let colors = document.querySelectorAll(".colours span");

colors.forEach(function (color) {
    color.onclick = function () {

        let selected = color.classList[0];

        document.getElementById("colorTitle").innerText =
            "Colours that match " + selected;

        document.getElementById("matchingColors").innerText =
            combinations[selected].join("  •  ");

        colors.forEach(c => c.classList.remove("activeColor"));
        color.classList.add("activeColor");

        pinterestColor = selected;

        document.getElementById("findStyle").style.display = "inline-block";
    };

    document.getElementById("findStyle").addEventListener("click", function() {

    let search = pinterestColor + " outfit ideas clothing";

    let url = "https://www.google.com/search?tbm=isch&q="
          + encodeURIComponent(search);;

    window.open(url, "_blank");

});
});