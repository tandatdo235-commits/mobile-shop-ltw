let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cart-items");
const totalPrice = document.getElementById("total-price");

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {

    const total = cart.reduce((sum, item) => {
        return sum + Number(item.quantity || 1);
    }, 0);

    const cartCount = document.getElementById("cart-count");

    if (cartCount) {
        cartCount.textContent = total;
    }
}

function renderCart() {

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <tr>
                <td colspan="6" style="padding:30px;text-align:center;">
                    Giỏ hàng của bạn đang trống
                </td>
            </tr>
        `;

        totalPrice.textContent = "0đ";

        updateCartCount();

        return;
    }

    let total = 0;

    cart.forEach(item => {

        const id = String(item.id);

        const name = item.name || "";

        const image = item.image || "";

        const price = Number(item.price) || 0;

        const quantity = Number(item.quantity) || 1;

        total += price * quantity;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <img src="${image}" class="product-img" width="80">
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

            <td>

                ${(price * quantity).toLocaleString("vi-VN")}đ

            </td>

            <td>

                <button
                    class="remove-btn"
                    onclick="removeItem('${id}')">

                    Xóa

                </button>

            </td>
        `;

        cartItems.appendChild(row);

    });

    totalPrice.textContent = total.toLocaleString("vi-VN") + "đ";

    saveCart();

    updateCartCount();

}

function increase(id) {

    const item = cart.find(p => String(p.id) === String(id));

    if (!item) return;

    item.quantity = Number(item.quantity || 1) + 1;

    renderCart();

}

function decrease(id) {

    const item = cart.find(p => String(p.id) === String(id));

    if (!item) return;

    if (Number(item.quantity) > 1) {

        item.quantity--;

    }

    renderCart();

}

function removeItem(id) {

    cart = cart.filter(item => String(item.id) !== String(id));

    renderCart();

}

renderCart();
