const cart =
JSON.parse(localStorage.getItem("cart"))
|| [];

const cartList =
document.getElementById("cart-list");

let total = 0;

cart.forEach((product,index) => {

    total += Number(product.price);

    cartList.innerHTML += `
        <div class="cart-item">

            <img
            src="${product.image.replace("./assets","../assets")}"
            width="120">
            <div>
                <h3>${product.name}</h3>
                <p>
                    ${Number(product.price)
                    .toLocaleString("vi-VN")} đ
                </p>
                <button
                onclick="removeItem(${index})">
                    Xóa
                </button>

            </div>
        </div>
        <hr>
    `;
});

cartList.innerHTML += `
    <h2>
        Tổng tiền:
        ${total.toLocaleString("vi-VN")} đ
    </h2>
`;

function removeItem(index){

    cart.splice(index,1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    location.reload();
}