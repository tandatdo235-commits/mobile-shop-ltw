const cart =
JSON.parse(localStorage.getItem("cart"))
|| [];

const cartList =
document.getElementById("cart-list");

cart.forEach(product => {

    cartList.innerHTML += `
        <div>
            <h3>${product.name}</h3>
            <p>${product.price} đ</p>
        </div>
        <hr>
    `;

});