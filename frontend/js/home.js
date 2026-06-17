let allProducts = [];

/* ======================
   Render sản phẩm
====================== */
function renderProducts(products){

    const phoneList = document.getElementById("phone-list");
    const laptopList = document.getElementById("laptop-list");
    const tabletList = document.getElementById("tablet-list");

    phoneList.innerHTML = "";
    laptopList.innerHTML = "";
    tabletList.innerHTML = "";

    products.forEach(product => {

        const card = `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>

            <p class="price">
                ${product.price} đ
            </p>

            <a href="./pages/product-detail.html?id=${product.id}">
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
}

/* ======================
   Load JSON
====================== */

fetch("./assets/mock-data/products.json")
.then(res => res.json())
.then(products => {

    allProducts = products;

    renderProducts(products);

});

/* ======================
   Banner Slider
====================== */

const banners = [
    "./assets/images/banner1.png",
    "./assets/images/banner2.png",
    "./assets/images/banner3.png"
];

let currentBanner = 0;

const bannerImage = document.getElementById("banner-image");
const dots = document.querySelectorAll(".dot");

function showBanner(index){

    if(!bannerImage) return;

    bannerImage.src = banners[index];

    dots.forEach(dot =>
        dot.classList.remove("active")
    );

    if(dots[index]){
        dots[index].classList.add("active");
    }
}

if(bannerImage){

    setInterval(() => {

        currentBanner++;

        if(currentBanner >= banners.length){
            currentBanner = 0;
        }

        showBanner(currentBanner);

    }, 3000);

    dots.forEach((dot,index) => {

        dot.addEventListener("click", () => {

            currentBanner = index;

            showBanner(currentBanner);

        });

    });

}

/* ======================
   Search
====================== */

document
.getElementById("search-btn")
.addEventListener("click", () => {

    const keyword =
    document
    .getElementById("search-input")
    .value
    .toLowerCase();

    const filtered =
    allProducts.filter(product =>

        product.name
        .toLowerCase()
        .includes(keyword)

    );
    renderProducts(filtered);
});

document
.getElementById("reset-btn")
.addEventListener("click",()=>{

    document
    .getElementById("search-input")
    .value = "";

    renderProducts(allProducts);

});

document
.getElementById("search-input")
.addEventListener("keyup", (e) => {

    if(e.key === "Enter"){

        document
        .getElementById("search-btn")
        .click();
    }
});
