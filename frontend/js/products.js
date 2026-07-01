const productList = document.getElementById("product-list");
const title = document.getElementById("page-title");

const params = new URLSearchParams(window.location.search);

const category = params.get("category");
const discount = params.get("discount");
const brand = params.get("brand");
const keyword = params.get("search");

let allProducts = [];

const productsPerPage = 10;
let currentPage = 1;

fetch("https://api-shopmobile-w12y.onrender.com/api/products")
    .then(res => res.json())
    .then(products => {

        if (category) {
            products = products.filter(product => {
                let targetCategory = category.toLowerCase();
                if (targetCategory === "phone") targetCategory = "smartphone";

                return product.category &&
                    product.category.toLowerCase() === targetCategory;
            });
        }

        
        if (brand) {
            products = products.filter(product =>
                product.brand &&
                product.brand.toLowerCase() === brand.toLowerCase()
            );
        }

       
        if (keyword) {
            products = products.filter(product =>
                product.name.toLowerCase().includes(keyword.toLowerCase())
            );
        }

       
        if (discount) {
            products = products.filter(product =>
                product.discount &&
                Number(product.discount) > 0
            );
        }

        allProducts = products;

        renderProducts(allProducts);
        renderPagination(allProducts);
        changeTitle();
        updateCartCount();
    });

function renderProducts(products) {

    productList.innerHTML = "";

    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;

    const currentProducts = products.slice(start, end);

    currentProducts.forEach(product => {

        let imageSrc = product.thumbnail;

        let newPriceNum = Number(product.price);

        let oldPriceNum = product.discount
            ? Math.round(newPriceNum / (1 - product.discount / 100))
            : newPriceNum;

        let newPriceStr = newPriceNum.toLocaleString("vi-VN");
        let oldPriceStr = oldPriceNum.toLocaleString("vi-VN");

        let badgeHTML = product.discount
            ? `<div class="sale-badge">Giảm ${product.discount}%</div>`
            : "";

        let oldPriceHTML = product.discount
            ? `<span class="old-price">${oldPriceStr} VNĐ</span>`
            : "";

        let promoHTML = product.promotion
            ? `<p class="promotion-text">${product.promotion}</p>`
            : "";

        productList.innerHTML += `

        <div class="product-card">

            ${badgeHTML}

            <img
                src="${imageSrc}"
                alt="${product.name}"
                onclick="window.location.href='product-detail.html?id=${product._id}'">

            <h3
                class="product-name"
                onclick="window.location.href='product-detail.html?id=${product._id}'">

                ${product.name}

            </h3>

            <div class="price-box">

                <span class="new-price">

                    ${newPriceStr} VNĐ

                </span>

                ${oldPriceHTML}

            </div>

            ${promoHTML}

            <button
                class="btn-add-cart"
                onclick="addToCart('${product._id}')">

                🛒 Thêm vào giỏ hàng

            </button>

        </div>

        `;

    });

}

function addToCart(id) {

    const product = allProducts.find(p => p._id === id);

    if (!product) {

        alert("Không tìm thấy sản phẩm");

        return;

    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exist = cart.find(item => item.id === id);

    if (exist) {

        exist.quantity++;

    } else {

        cart.push({

            id: product._id,

            name: product.name,

            price: Number(product.price),

            image: product.thumbnail,

            quantity: 1

        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    alert("Đã thêm vào giỏ hàng");

}

function updateCartCount() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;

    cart.forEach(item => {

        total += item.quantity;

    });

    const cartBtn = document.getElementById("cart-count");

    if (cartBtn) {

        cartBtn.innerHTML =
            `Giỏ hàng (${total}) <i class="fa-solid fa-cart-arrow-down"></i>`;

    }

}


// ==========================
// Phân trang
// ==========================

function renderPagination(products) {

    const pagination =
        document.getElementById("pagination");

    pagination.innerHTML = "";

    const totalPages =
        Math.ceil(products.length / productsPerPage);

    for (let i = 1; i <= totalPages; i++) {

        pagination.innerHTML += `
        <button
            class="${i === currentPage ? 'active-page' : ''}"
            onclick="changePage(${i})">
            ${i}
        </button>
        `;

    }

}

function changePage(page) {

    currentPage = page;

    renderProducts(allProducts);
    renderPagination(allProducts);

}

function changeTitle() {

    if (brand) {

        const brands = {
            apple: category === "laptop" ? "MacBook" : (category === "tablet" ? "iPad" : "Sản phẩm Apple"),
            samsung: category === "tablet" ? "Máy tính bảng Samsung" : "Điện thoại Samsung",
            xiaomi: category === "tablet" ? "Máy tính bảng Xiaomi" : "Điện thoại Xiaomi",
            oppo: category === "tablet" ? "Máy tính bảng OPPO" : "Điện thoại OPPO",
            lenovo: category === "tablet" ? "Máy tính bảng Lenovo" : "Laptop Lenovo",
            vivo: "Điện thoại Vivo",
            dell: "Laptop Dell",
            hp: "Laptop HP",
            asus: "Laptop ASUS",
            acer: "Laptop Acer"
        };

        title.innerText = brands[brand] || "Danh sách sản phẩm";

        return;

    }

    if (category === "phone" || category === "smartphone") {

        title.innerText = "Điện thoại";

    } else if (category === "laptop") {

        title.innerText = "Laptop";

    } else if (category === "tablet") {

        title.innerText = "Máy tính bảng";

    } else {

        title.innerText = "Danh sách sản phẩm";

    }

}
function updateCartCount(){

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const count = cart.reduce((sum,item)=>sum + item.quantity,0);

    const cartCount = document.getElementById("cart-count");

    if(cartCount){

        cartCount.innerText = count;

    }

}

updateCartCount();
