let allProducts = [];

/* ======================
   Render sản phẩm (Giao diện mới)
====================== */
function renderProducts(products){
    const phoneList = document.getElementById("phone-list");
    const laptopList = document.getElementById("laptop-list");
    const tabletList = document.getElementById("tablet-list");

    // Ẩn tất cả section trước khi render
    document.querySelectorAll(".product-section").forEach(section => {
        section.style.display = "none";
    });

    phoneList.innerHTML = "";
    laptopList.innerHTML = "";
    tabletList.innerHTML = "";

    products.forEach(product => {
        // Xử lý ảnh (Lấy ảnh đầu tiên nếu là mảng, ưu tiên image rồi đến images)
        let imageSrc = Array.isArray(product.image) ? product.image[0] : (product.image || product.images);

        // Logic tính giá: Giả sử product.price là giá đã giảm (theo code cũ của bạn)
        let newPriceNum = Number(product.price);
        let oldPriceNum = product.discount ? Math.round(newPriceNum / (1 - product.discount / 100)) : newPriceNum;

        let newPriceStr = newPriceNum.toLocaleString("vi-VN");
        let oldPriceStr = oldPriceNum.toLocaleString("vi-VN");

        // Các thành phần HTML động
        let badgeHTML = product.discount ? `<div class="sale-badge">Giảm ${product.discount}%</div>` : '';
        let oldPriceHTML = product.discount ? `<span class="old-price">${oldPriceStr} VNĐ</span>` : '';
        let promoHTML = product.promotion ? `<p class="promotion-text">${product.promotion}</p>` : '';

        // Cấu trúc Card mới (Click vào cả card để xem chi tiết)
        const card = `
        <div class="product-card" onclick="window.location.href='./pages/product-detail.html?id=${product.id}'">
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

        // Phân loại render
        if(product.category === "phone"){
            phoneList.innerHTML += card;
            phoneList.parentElement.style.display = "block";
        }

        if(product.category === "laptop"){
            laptopList.innerHTML += card;
            laptopList.parentElement.style.display = "block";
        }

        if(product.category === "tablet"){
            tabletList.innerHTML += card;
            tabletList.parentElement.style.display = "block";
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
    // Kiểm tra xem ảnh có tồn tại thực tế không, tạm thời dùng src mảng
    bannerImage.src = banners[index];
    dots.forEach(dot => dot.classList.remove("active"));
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
document.getElementById("search-btn").addEventListener("click", () => {
    const keyword = document.getElementById("search-input").value.toLowerCase();
    const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(keyword)
    );
    renderProducts(filtered);
});

document.getElementById("search-input").addEventListener("keyup", (e) => {
    if(e.key === "Enter"){
        document.getElementById("search-btn").click();
    }
});

/* ======================
   Sidebar Accordion (Đóng/mở danh mục)
====================== */
document.querySelectorAll('.menu-header').forEach(header => {
    header.addEventListener('click', () => {
        const submenu = header.nextElementSibling;
        const icon = header.querySelector('.toggle-icon');
        
        // Bật/tắt hiển thị submenu
        if(submenu.style.display === 'none' || submenu.style.display === '') {
            submenu.style.display = 'block';
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        } else {
            submenu.style.display = 'none';
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    });
});