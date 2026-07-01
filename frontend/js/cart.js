let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cart-items");
const totalPrice = document.getElementById("total-price");

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <tr>
                <td colspan="6">
                    Giỏ hàng của bạn đang trống
                </td>
            </tr>
        `;

        totalPrice.innerText = "0đ";

        updateCartCount();

        return;
    }

    let total = 0;

    cart.forEach(item => {

        const price = Number(item.price);

        const quantity = Number(item.quantity);

        total += price * quantity;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <img src="${item.image}" class="product-img" width="80">
            </td>

            <td>${item.name}</td>

            <td>${price.toLocaleString("vi-VN")}đ</td>

            <td>

                <div class="quantity">

                    <button onclick="decrease('${item.id}')">-</button>

                    <span>${quantity}</span>

                    <button onclick="increase('${item.id}')">+</button>

                </div>

            </td>

            <td>

                ${(price * quantity).toLocaleString("vi-VN")}đ

            </td>

            <td>

                <button
                    class="remove-btn"
                    onclick="removeItem('${item.id}')">

                    Xóa

                </button>

            </td>
        `;

        cartItems.appendChild(row);

    });

    totalPrice.innerText = total.toLocaleString("vi-VN") + "đ";

    saveCart();

    updateCartCount();

}

function increase(id){

    const item = cart.find(p => p.id === id);

    if(item){

        item.quantity++;

        renderCart();

    }

}

function decrease(id){

    const item = cart.find(p => p.id === id);

    if(item && item.quantity > 1){

        item.quantity--;

    }

    renderCart();

}

function removeItem(id){

    cart = cart.filter(item => item.id !== id);

    renderCart();

}

function updateCartCount(){

    const count = cart.reduce((sum,item)=>{

        return sum + Number(item.quantity);

    },0);

    const cartCount = document.getElementById("cart-count");

    if(cartCount){

        cartCount.innerText = count;

    }

}

renderCart();
