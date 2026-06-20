const cart =
JSON.parse(localStorage.getItem("cart")) || [];

const totalElement =
document.getElementById("checkout-total");

const form =
document.getElementById("checkout-form");

let total = 0;

cart.forEach(item=>{

    total += item.price * item.quantity;

});

totalElement.innerText =
total.toLocaleString()+"đ";

form.addEventListener("submit",function(e){

    e.preventDefault();

    const name =
    document.getElementById("name").value;

    const phone =
    document.getElementById("phone").value;

    const address =
    document.getElementById("address").value;

    if(!name || !phone || !address){

        alert("Vui lòng nhập đầy đủ thông tin");

        return;

    }

    const payment =
    document.querySelector(
    'input[name="payment"]:checked'
    ).value;

    const order = {

        id:Date.now(),

        customer:name,

        phone,

        address,

        payment,

        total,

        items:cart,

        status:"Chờ xác nhận"

    };

    let orders =
    JSON.parse(
    localStorage.getItem("orders")
    ) || [];

    orders.push(order);

    localStorage.setItem(
    "orders",
    JSON.stringify(orders)
    );

    localStorage.removeItem("cart");

    alert("Đặt hàng thành công");

    window.location.href="../index.html";

});