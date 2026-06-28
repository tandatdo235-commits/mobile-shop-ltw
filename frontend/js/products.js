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

// ==========================
// Đọc dữ liệu
// ==========================
fetch("../assets/mock-data/products.json")
    .then(res => res.json())
    .then(products => {

        // Lọc theo danh mục
        if (category) {
            products = products.filter(product =>
                product.category && product.category.toLowerCase() === category.toLowerCase()
            );
        }

        // Lọc theo hãng
        if (brand) {
            products = products.filter(product =>
                product.brand && product.brand.toLowerCase() === brand.toLowerCase()
            );
        }

        // Lọc theo từ khóa
        if (keyword) {
            products = products.filter(product =>
                product.name.toLowerCase().includes(keyword.toLowerCase())
            );
            }

        // Lọc khuyến mãi
        if (discount) {
            products = products.filter(product =>
                product.discount && Number(product.discount) > 0
            );
        }

        allProducts = products;

        renderProducts(allProducts);
        renderPagination(allProducts);
        changeTitle();
    });

// ==========================
// Hiển thị sản phẩm
// ==========================
function renderProducts(products) {
    productList.innerHTML = "";
    
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const currentProducts = products.slice(start, end);

    currentProducts.forEach(product => {
        let imageSrc = Array.isArray(product.image) ? product.image[0] : (product.image || product.images);
        // Fix đường dẫn ảnh khi ở thư mục pages/
        imageSrc = imageSrc.replace('./assets', '../assets');

        let newPriceNum = Number(product.price);
        let oldPriceNum = product.discount ? Math.round(newPriceNum / (1 - product.discount / 100)) : newPriceNum;

        let newPriceStr = newPriceNum.toLocaleString("vi-VN");
        let oldPriceStr = oldPriceNum.toLocaleString("vi-VN");

        let badgeHTML = product.discount ? `<div class="sale-badge">Giảm ${product.discount}%</div>` : '';
        let oldPriceHTML = product.discount ? `<span class="old-price">${oldPriceStr} VNĐ</span>` : '';
        let promoHTML = product.promotion ? `<p class="promotion-text">${product.promotion}</p>` : '';

        productList.innerHTML += `
        <div class="product-card" onclick="window.location.href='product-detail.html?id=${product.id}'">
            ${badgeHTML}
            <img src="${imageSrc}" alt="${product.name}">
            
            <h3 class="product-name">${product.name}</h3>
            
            <div class="price-box">
                <span class="new-price">${newPriceStr} VNĐ</span>
                ${oldPriceHTML}
            </div>
            
            ${promoHTML}
        </div>
        `;
    });
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

// ==========================
// Đổi trang
// ==========================
function changePage(page) {

    currentPage = page;

    renderProducts(allProducts);
    renderPagination(allProducts);

}

// ==========================
// Tiêu đề
// ==========================
function changeTitle() {

    if (brand) {

        const brands = {
            iphone: "Điện thoại iPhone",
            samsung: "Điện thoại Samsung",
            xiaomi: "Điện thoại Xiaomi",
            oppo: "Điện thoại OPPO",
            vivo: "Điện thoại Vivo",

            dell: "Laptop Dell",
            hp: "Laptop HP",
            asus: "Laptop ASUS",
            acer: "Laptop Acer",
            lenovo: "Laptop Lenovo",
            macbook: "MacBook",

            ipad: "iPad",
            samsung_tablet: "Máy tính bảng Samsung",
            xiaomi_tablet: "Máy tính bảng Xiaomi",
            lenovo_tablet: "Máy tính bảng Lenovo",
            oppo_tablet: "Máy tính bảng OPPO",
        };

        title.innerText = brands[brand] || "Danh sách sản phẩm";
        return;
    }

    if (category === "phone") {
        title.innerText = "Điện thoại";
    }
    else if (category === "laptop") {
        title.innerText = "Laptop";
    }
    else if (category === "tablet") {
        title.innerText = "Máy tính bảng";
    }
    else {
        title.innerText = "Danh sách sản phẩm";
    }
}