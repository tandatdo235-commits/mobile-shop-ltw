document
.getElementById("search-btn")
.addEventListener("click", () => {

    const keyword =
    document
    .getElementById("search-input")
    .value
    .toLowerCase();

    const cards =
    document.querySelectorAll(".product-card");

    cards.forEach(card => {

        const name =
        card.querySelector(".product-name")
        .innerText
        .toLowerCase();

        if(name.includes(keyword)){
            card.style.display = "block";
        }
        else{
            card.style.display = "none";
        }

    });

});