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

            <img src="${product.image}" alt="${product.name}">

            <div class="product-name">
                ${product.name}
            </div>

            <div class="product-price">
                ${product.price.toLocaleString("vi-VN")} đ
            </div>
            <a href="pages/product-detail.html?id=${product.id}">
                <button class="detail-btn">
                    Xem chi tiết
                </button>
                </a>
        </div>
        `;

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