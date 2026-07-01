if(cart.length === 0){

    document.getElementById("cart-items").innerHTML = `
        <tr>
            <td colspan="6">
                Giỏ hàng của bạn đang trống
            </td>
        </tr>
    `;

    document.getElementById("total-price").innerText="0đ";

    return;
}
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
let cart = JSON.parse(localStorage.getItem("cart")) || [

{
    id:1,
    name:"iPhone 16 Pro Max",
    price:34990000,
    quantity:1,
    image:"https://via.placeholder.com/80"
},

{
    id:2,
    name:"MacBook Air M4",
    price:29990000,
    quantity:1,
    image:"https://via.placeholder.com/80"
}

];

const cartItems = document.getElementById("cart-items");
const totalPrice = document.getElementById("total-price");

function saveCart(){
    localStorage.setItem("cart",JSON.stringify(cart));
}

function renderCart(){

    cartItems.innerHTML="";

    let total=0;

    cart.forEach(item=>{

        const row=document.createElement("tr");

        total += item.price * item.quantity;

        row.innerHTML=`

        <td>
            <img src="${item.image}" class="product-img">
        </td>

        <td>${item.name}</td>

        <td>${item.price.toLocaleString()}đ</td>

        <td>

            <div class="quantity">

                <button onclick="decrease(${item.id})">-</button>

                <span>${item.quantity}</span>

                <button onclick="increase(${item.id})">+</button>

            </div>

        </td>

        <td>
            ${(item.price * item.quantity).toLocaleString()}đ
        </td>

        <td>
            <button
                class="remove-btn"
                onclick="removeItem(${item.id})">
                Xóa
            </button>
        </td>
        `;

        cartItems.appendChild(row);

    });

    totalPrice.innerText=total.toLocaleString()+"đ";

    saveCart();

}

function increase(id){

    const item = cart.find(i=>i.id===id);

    item.quantity++;

    renderCart();

}

function decrease(id){

    const item = cart.find(i=>i.id===id);

    if(item.quantity > 1){

        item.quantity--;

    }

    renderCart();

}

function removeItem(id){

    cart = cart.filter(item=>item.id!==id);

    renderCart();

}

renderCart();
