var params = new URLSearchParams(window.location.search);
var productId = params.get("id");

fetch("https://api-shopmobile-w12y.onrender.com/api/products")
.then(function(res) { return res.json(); })
.then(function(products) {

    var product = null;
    for (var i = 0; i < products.length; i++) {
        if (products[i]._id == productId || products[i].id == productId) {
            product = products[i];
            break;
        }
    }

    if (!product) {
        document.getElementById('product-name').innerText = 'Không tìm thấy sản phẩm';
        return;
    }

    var currentImage = 0;
    var images = (product.images && product.images.length > 0) ? product.images : [product.thumbnail];
    
    document.getElementById("product-image").src = images[currentImage];

    document.getElementById("next-btn").addEventListener("click", function() {
        currentImage++;
        if (currentImage >= images.length) {
            currentImage = 0;
        }
        document.getElementById("product-image").src = images[currentImage];
    });

    document.getElementById("prev-btn").addEventListener("click", function() {
        currentImage--;
        if (currentImage < 0) {
            currentImage = images.length - 1;
        }
        document.getElementById("product-image").src = images[currentImage];
    });

    document.getElementById("product-name").innerText = product.name;
    document.getElementById("product-price").innerText = Number(product.price).toLocaleString("vi-VN") + " đ";
    document.getElementById("product-description").innerText = product.description || "Sản phẩm chính hãng, bảo hành đầy đủ.";
    document.getElementById("product-promotion").innerText = product.promotion || "Không có khuyến mãi";

    var specsTable = document.getElementById("product-specs");
    if (product.specs) {
        var dict = {
            "screen": "Màn hình", 
            "chip": "Chip xử lý", 
            "ram": "RAM",
            "storage": "Bộ nhớ trong", 
            "battery": "Pin và Sạc", 
            "camera": "Camera", 
            "weight": "Trọng lượng"
        };

        var specsHTML = "";
        for (var key in product.specs) {
            if (product.specs.hasOwnProperty(key)) {
                var viKey = dict[key] || key;
                specsHTML += `
                <tr>
                    <th>${viKey}</th>
                    <td>${product.specs[key]}</td>
                </tr>
                `;
            }
        }
        specsTable.innerHTML = specsHTML;
    }

    var relatedProducts = [];
    for (var i = 0; i < products.length; i++) {
        if (products[i].category === product.category && products[i]._id !== product._id) {
            relatedProducts.push(products[i]);
        }
    }

    var relatedBox = document.getElementById("related-products");
    
    for (var i = 0; i < relatedProducts.length; i++) {
        var item = relatedProducts[i];
        var imageSrc = item.thumbnail;

        var newPriceNum = Number(item.price);
        var oldPriceNum = item.discount ? Math.round(newPriceNum / (1 - item.discount / 100)) : newPriceNum;

        var newPriceStr = newPriceNum.toLocaleString("vi-VN");
        var oldPriceStr = oldPriceNum.toLocaleString("vi-VN");

        var badgeHTML = item.discount ? '<div class="sale-badge">Giảm ' + item.discount + '%</div>' : '';
        var oldPriceHTML = item.discount ? '<span class="old-price">' + oldPriceStr + ' VNĐ</span>' : '';
        var promoHTML = item.promotion ? '<p class="promotion-text">' + item.promotion + '</p>' : '';

        relatedBox.innerHTML += `
        <a href="product-detail.html?id=${item._id}" class="related-card-link">
            <div class="product-card">
                ${badgeHTML}
                <img src="${imageSrc}" alt="${item.name}">
                <h3 class="product-name">${item.name}</h3>
                <div class="price-box">
                    <span class="new-price">${newPriceStr} VNĐ</span>
                    ${oldPriceHTML}
                </div>
                ${promoHTML}
            </div>
        </a>
        `;
    }

    document.getElementById("add-cart-btn").addEventListener("click", function() {
        var cart = JSON.parse(localStorage.getItem("cart")) || [];
        var exist = null;
        var productIdStr = String(product._id || product.id);
        
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
                id: product._id || product.id,
                name: product.name,
                image: product.thumbnail,
                price: Number(product.price),
                quantity: 1
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        showToast("Đã thêm vào giỏ hàng", "success");
    });

    function updateCartCount() {
        var cart = JSON.parse(localStorage.getItem("cart")) || [];
        var count = 0;
        for (var i = 0; i < cart.length; i++) {
            count = count + Number(cart[i].quantity);
        }
        var cartCount = document.getElementById("cart-count");
        if (cartCount) {
            cartCount.innerText = count;
        }
        var headerCount = document.getElementById("cart-count-header");
        if (headerCount) {
            headerCount.innerText = count;
        }
    }

    updateCartCount();
});