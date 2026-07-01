var allProducts = [];

function renderProducts(products) {
    var phoneList = document.getElementById("phone-list");
    var laptopList = document.getElementById("laptop-list");
    var tabletList = document.getElementById("tablet-list");

    var sections = document.querySelectorAll(".product-section");
    for (var i = 0; i < sections.length; i++) {
        sections[i].style.display = "none";
    }

    phoneList.innerHTML = "";
    laptopList.innerHTML = "";
    tabletList.innerHTML = "";

    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        
        var imageSrc = product.thumbnail;
        var newPriceNum = Number(product.price);
        var oldPriceNum = product.discount ? Math.round(newPriceNum / (1 - product.discount / 100)) : newPriceNum;

        var newPriceStr = newPriceNum.toLocaleString("vi-VN");
        var oldPriceStr = oldPriceNum.toLocaleString("vi-VN");

        var badgeHTML = product.discount ? '<div class="sale-badge">Giảm ' + product.discount + '%</div>' : '';
        var oldPriceHTML = product.discount ? '<span class="old-price">' + oldPriceStr + ' VNĐ</span>' : '';
        var promoHTML = product.promotion ? '<p class="promotion-text">' + product.promotion + '</p>' : '';

        var card = `
        <div class="product-card" onclick="window.location.href='./pages/product-detail.html?id=${product._id}'">
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

        if (product.category === "smartphone" || product.category === "phone") {
            phoneList.innerHTML += card;
            phoneList.parentElement.style.display = "block";
        }

        if (product.category === "laptop") {
            laptopList.innerHTML += card;
            laptopList.parentElement.style.display = "block";
        }

        if (product.category === "tablet") {
            tabletList.innerHTML += card;
            tabletList.parentElement.style.display = "block";
        }
    }
}

fetch("https://api-shopmobile-w12y.onrender.com/api/products")
.then(function(res) { return res.json(); })
.then(function(products) {
    allProducts = products;
    renderProducts(products);
});

var banners = [
    "./assets/images/banner1.png",
    "./assets/images/banner2.png",
    "./assets/images/banner3.png"
];

var currentBanner = 0;
var bannerImage = document.getElementById("banner-image");
var dots = document.querySelectorAll(".dot");

function showBanner(index) {
    if (!bannerImage) return;
    bannerImage.src = banners[index];
    for (var i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    if (dots[index]) {
        dots[index].classList.add("active");
    }
}

if (bannerImage) {
    setInterval(function() {
        currentBanner++;
        if (currentBanner >= banners.length) {
            currentBanner = 0;
        }
        showBanner(currentBanner);
    }, 3000);

    for (var i = 0; i < dots.length; i++) {
        (function(index) {
            dots[index].addEventListener("click", function() {
                currentBanner = index;
                showBanner(currentBanner);
            });
        })(i);
    }
}

var searchBtn = document.getElementById("search-btn");
var searchInput = document.getElementById("search-input");

if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", function() {
        var keyword = searchInput.value.toLowerCase();
        var filtered = [];
        for (var i = 0; i < allProducts.length; i++) {
            if (allProducts[i].name.toLowerCase().includes(keyword)) {
                filtered.push(allProducts[i]);
            }
        }
        renderProducts(filtered);
    });

    searchInput.addEventListener("keyup", function(e) {
        if (e.key === "Enter") {
            searchBtn.click();
        }
    });
}

var menuHeaders = document.querySelectorAll('.menu-header');
for (var i = 0; i < menuHeaders.length; i++) {
    (function(header) {
        header.addEventListener('click', function() {
            var submenu = header.nextElementSibling;
            var icon = header.querySelector('.toggle-icon');
            
            if (submenu.style.display === 'none' || submenu.style.display === '') {
                submenu.style.display = 'block';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                submenu.style.display = 'none';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    })(menuHeaders[i]);
}