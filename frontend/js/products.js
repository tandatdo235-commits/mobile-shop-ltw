const productList =
document.getElementById("product-list");

const title =
document.getElementById("page-title");

const params =
new URLSearchParams(window.location.search);

const category =
params.get("category");

const discount =
params.get("discount");

let allProducts = [];

const productsPerPage = 5;
let currentPage = 1;

fetch("../assets/mock-data/products.json")
.then(res => res.json())
.then(products => {

    // Lọc theo danh mục
    if(category){
        products = products.filter(product =>
            product.category === category
        );
    }

    // Lọc khuyến mãi
    if(discount){
        products = products.filter(product =>
            product.discount
        );
    }

    allProducts = products;

    renderProducts(allProducts);
    renderPagination(allProducts);

});

function renderProducts(products){

    productList.innerHTML = "";

    const start =
    (currentPage - 1) * productsPerPage;

    const end =
    start + productsPerPage;

    const currentProducts =
    products.slice(start, end);

    currentProducts.forEach(product => {

        let image;

        if(Array.isArray(product.image)){
            image = product.image[0];
        }else{
            image = product.image;
        }

        productList.innerHTML += `
        <div class="product-card">

            ${
                product.discount
                ?
                `<span class="discount-badge">
                    -${product.discount}%
                </span>`
                :
                ""
            }

            <img
            src="${image.replace('./assets','../assets')}">

            <h3>${product.name}</h3>

            <p>
                ${Number(product.price)
                .toLocaleString("vi-VN")} đ
            </p>

            <a href="product-detail.html?id=${product.id}">
                <button>
                    Xem chi tiết
                </button>
            </a>

        </div>
        `;
    });

}

function renderPagination(products){

    const totalPages =
    Math.ceil(
        products.length /
        productsPerPage
    );

    const pagination =
    document.getElementById("pagination");

    pagination.innerHTML = "";

    for(let i = 1; i <= totalPages; i++){

        pagination.innerHTML += `
        <button onclick="changePage(${i})">
            ${i}
        </button>
        `;
    }

}

function changePage(page){

    currentPage = page;

    renderProducts(allProducts);

}

if(category === "phone"){
    title.innerText =
    "Danh sách điện thoại";
}

if(category === "laptop"){
    title.innerText =
    "Danh sách laptop";
}

if(category === "tablet"){
    title.innerText =
    "Danh sách máy tính bảng";
}