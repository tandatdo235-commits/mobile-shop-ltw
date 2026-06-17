fetch("./assets/mock-data/products.json")
.then(res => res.json())
.then(products => {

    const phoneList =
    document.getElementById("phone-list");

    const laptopList =
    document.getElementById("laptop-list");

    const tabletList =
    document.getElementById("tablet-list");

    products.forEach(product => {

        const card = `
        <div class="product-card">

            <img src="${product.image}">

            <div class="product-name">
                ${product.name}
            </div>

            <div class="product-price">
                ${product.price} đ
            </div>

        </div>
        `;
        const phones = [
    {
        id: 1,
        name: "iPhone 16",
        price: 21990000,
        image: "./assets/images/iphone16.jpg"
    },
    {
        id: 2,
        name: "Samsung S25 Ultra",
        price: 28990000,
        image: "./assets/images/samsung-s25.jpg"
    }
];

        if(product.category === "phone"){
            phoneList.innerHTML += card;
        }

        if(product.category === "laptop"){
            laptopList.innerHTML += card;
        }

        if(product.category === "tablet"){
            tabletList.innerHTML += card;
        }

    });

});