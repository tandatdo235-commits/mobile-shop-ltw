var cart = JSON.parse(localStorage.getItem("cart")) || [];
var cartItems = document.getElementById("cart-items");
var totalPrice = document.getElementById("total-price");

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        total = total + Number(cart[i].quantity || 1);
    }
    var cartCount = document.getElementById("cart-count");
    if (cartCount) {
        cartCount.textContent = total;
    }
    var headerCount = document.getElementById("cart-count-header");
    if (headerCount) {
        headerCount.textContent = total;
    }
}

function renderCart() {
    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <tr>
                <td colspan="6" style="padding:40px;text-align:center;color:#6b7280;">
                    Giỏ hàng của bạn đang trống
                </td>
            </tr>
        `;
        if (totalPrice) totalPrice.textContent = "0đ";
        updateCartCount();
        return;
    }

    var total = 0;

    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var id = String(item.id);
        var name = item.name || "";
        var image = item.image || "";
        var price = Number(item.price) || 0;
        var quantity = Number(item.quantity) || 1;

        total = total + price * quantity;

        var row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <img src="${image}" class="product-img" onerror="this.src='../assets/images/no-image.png'">
            </td>
            <td>${name}</td>
            <td>${price.toLocaleString("vi-VN")}đ</td>
            <td>
                <div class="quantity">
                    <button onclick="decrease('${id}')">-</button>
                    <span>${quantity}</span>
                    <button onclick="increase('${id}')">+</button>
                </div>
            </td>
            <td>${(price * quantity).toLocaleString("vi-VN")}đ</td>
            <td>
                <button class="remove-btn" onclick="removeItem('${id}')">Xóa</button>
            </td>
        `;
        cartItems.appendChild(row);
    }

    if (totalPrice) totalPrice.textContent = total.toLocaleString("vi-VN") + "đ";
    saveCart();
    updateCartCount();
}

function increase(id) {
    for (var i = 0; i < cart.length; i++) {
        if (String(cart[i].id) === String(id)) {
            cart[i].quantity = Number(cart[i].quantity || 1) + 1;
            break;
        }
    }
    renderCart();
}

function decrease(id) {
    for (var i = 0; i < cart.length; i++) {
        if (String(cart[i].id) === String(id)) {
            if (Number(cart[i].quantity) > 1) {
                cart[i].quantity--;
            }
            break;
        }
    }
    renderCart();
}

function removeItem(id) {
    var newCart = [];
    for (var i = 0; i < cart.length; i++) {
        if (String(cart[i].id) !== String(id)) {
            newCart.push(cart[i]);
        }
    }
    cart = newCart;
    renderCart();
}

function addToCart(productId, productName, productPrice, productImage) {
    var existing = null;
    for (var i = 0; i < cart.length; i++) {
        if (String(cart[i].id) === String(productId)) {
            existing = cart[i];
            break;
        }
    }

    if (existing) {
        existing.quantity = Number(existing.quantity || 1) + 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: Number(productPrice),
            image: productImage || "",
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showToast("Đã thêm vào giỏ hàng", "success");
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderCart);
} else {
    renderCart();
}