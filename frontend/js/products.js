var productList = document.getElementById("product-list");
var title = document.getElementById("page-title");

var params = new URLSearchParams(window.location.search);

var category = params.get("category");
var discount = params.get("discount");
var brand = params.get("brand");
var keyword = params.get("search");

var allProducts = [];

var productsPerPage = 10;
var currentPage = 1;

function showLoading() {
    if (productList) {
        productList.innerHTML = '<div style="text-align:center;padding:40px;color:#6b7280;">Đang tải sản phẩm...</div>';
    }
}

function showError(message) {
    if (productList) {
        productList.innerHTML = '<div style="text-align:center;padding:40px;color:#dc2626;">' + message + '</div>';
    }
}

showLoading();

fetch("https://api-shopmobile-w12y.onrender.com/api/products")
    .then(function(res) {
        if (!res.ok) {
            throw new Error("Không thể kết nối đến máy chủ");
        }
        return res.json();
    })
    .then(function(products) {
        if (!products || products.length === 0) {
            showError("Không có sản phẩm nào");
            return;
        }

        if (category) {
            var filtered = [];
            var targetCategory = category.toLowerCase();
            if (targetCategory === "phone") targetCategory = "smartphone";
            
            for (var i = 0; i < products.length; i++) {
                if (products[i].category && products[i].category.toLowerCase() === targetCategory) {
                    filtered.push(products[i]);
                }
            }
            products = filtered;
        }

        if (brand) {
            var filtered = [];
            var targetBrand = brand.toLowerCase();
            for (var i = 0; i < products.length; i++) {
                if (products[i].brand && products[i].brand.toLowerCase() === targetBrand) {
                    filtered.push(products[i]);
                }
            }
            products = filtered;
        }

        if (keyword) {
            var filtered = [];
            var searchKeyword = keyword.toLowerCase();
            for (var i = 0; i < products.length; i++) {
                if (products[i].name && products[i].name.toLowerCase().includes(searchKeyword)) {
                    filtered.push(products[i]);
                }
            }
            products = filtered;
        }

        if (discount) {
            var filtered = [];
            for (var i = 0; i < products.length; i++) {
                if (products[i].discount && Number(products[i].discount) > 0) {
                    filtered.push(products[i]);
                }
            }
            products = filtered;
        }

        allProducts = products;
        renderProducts(allProducts);
        renderPagination(allProducts);
        changeTitle();
        updateCartCount();
    })
    .catch(function(error) {
        showError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
        console.error("Lỗi:", error);
    });

function renderProducts(products) {
    if (!productList) return;
    productList.innerHTML = "";

    var start = (currentPage - 1) * productsPerPage;
    var end = start + productsPerPage;
    var currentProducts = products.slice(start, end);

    if (currentProducts.length === 0) {
        productList.innerHTML = '<div style="text-align:center;padding:40px;color:#6b7280;">Không tìm thấy sản phẩm phù hợp</div>';
        return;
    }

    for (var i = 0; i < currentProducts.length; i++) {
        var product = currentProducts[i];
        var imageSrc = product.thumbnail || '';
        var newPriceNum = Number(product.price) || 0;
        var oldPriceNum = product.discount ? Math.round(newPriceNum / (1 - product.discount / 100)) : newPriceNum;
        var newPriceStr = newPriceNum.toLocaleString("vi-VN");
        var oldPriceStr = oldPriceNum.toLocaleString("vi-VN");

        var badgeHTML = product.discount ? '<div class="sale-badge">Giảm ' + product.discount + '%</div>' : '';
        var oldPriceHTML = product.discount ? '<span class="old-price">' + oldPriceStr + ' VNĐ</span>' : '';
        var promoHTML = product.promotion ? '<p class="promotion-text">' + product.promotion + '</p>' : '';

        var card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            ${badgeHTML}
            <img src="${imageSrc}" alt="${product.name}" onclick="window.location.href='product-detail.html?id=${product._id}'" onerror="this.src='../assets/images/no-image.png'">
            <h3 class="product-name" onclick="window.location.href='product-detail.html?id=${product._id}'">${product.name}</h3>
            <div class="price-box">
                <span class="new-price">${newPriceStr} VNĐ</span>
                ${oldPriceHTML}
            </div>
            ${promoHTML}
            <button class="btn-add-cart" onclick="addToCart('${product._id}')">Thêm vào giỏ hàng</button>
        `;
        productList.appendChild(card);
    }
}

function addToCart(id) {
    var product = null;
    for (var i = 0; i < allProducts.length; i++) {
        if (allProducts[i]._id === id) {
            product = allProducts[i];
            break;
        }
    }

    if (!product) {
        showToast("Không tìm thấy sản phẩm", "error");
        return;
    }

    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var exist = null;
    var productIdStr = String(product._id);
    
    for (var i = 0; i < cart.length; i++) {
        if (String(cart[i].id) === productIdStr) {
            exist = cart[i];
            break;
        }
    }

    if (exist) {
        exist.quantity = Number(exist.quantity || 1) + 1;
    } else {
        cart.push({
            id: product._id,
            name: product.name,
            price: Number(product.price),
            image: product.thumbnail || '',
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showToast("Đã thêm vào giỏ hàng", "success");
}

function updateCartCount() {
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        total += Number(cart[i].quantity) || 0;
    }
    var cartBtn = document.getElementById("cart-count");
    if (cartBtn) {
        cartBtn.innerHTML = "Giỏ hàng (" + total + ")";
    }
    var headerCount = document.getElementById("cart-count-header");
    if (headerCount) {
        headerCount.textContent = total;
    }
}

function renderPagination(products) {
    var pagination = document.getElementById("pagination");
    if (!pagination) return;
    pagination.innerHTML = "";

    var totalPages = Math.ceil(products.length / productsPerPage);
    if (totalPages <= 1) return;

    for (var i = 1; i <= totalPages; i++) {
        var btn = document.createElement("button");
        btn.className = (i === currentPage) ? "page-btn active-page" : "page-btn";
        btn.textContent = i;
        btn.onclick = function(page) {
            return function() {
                changePage(page);
            };
        }(i);
        pagination.appendChild(btn);
    }
}

function changePage(page) {
    currentPage = page;
    renderProducts(allProducts);
    renderPagination(allProducts);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function changeTitle() {
    if (!title) return;

    if (brand) {
        var brands = {
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

function updateCartCount() {
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var count = 0;
    for (var i = 0; i < cart.length; i++) {
        count += Number(cart[i].quantity) || 0;
    }
    var cartCount = document.getElementById("cart-count");
    if (cartCount) {
        cartCount.innerText = count;
    }
}

updateCartCount();