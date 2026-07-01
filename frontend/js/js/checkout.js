var cart = JSON.parse(localStorage.getItem("cart")) || [];
var totalElement = document.getElementById("checkout-total");
var form = document.getElementById("checkout-form");
var total = 0;

for (var i = 0; i < cart.length; i++) {
    total = total + (Number(cart[i].price) || 0) * (Number(cart[i].quantity) || 1);
}

if (totalElement) {
    totalElement.innerText = total.toLocaleString() + "đ";
}

if (form) {
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        var name = document.getElementById("name").value.trim();
        var phone = document.getElementById("phone").value.trim();
        var address = document.getElementById("address").value.trim();

        if (!name || !phone || !address) {
            showToast("Vui lòng nhập đầy đủ thông tin", "error");
            return;
        }

        if (!/^[0-9]{10,11}$/.test(phone)) {
            showToast("Số điện thoại không hợp lệ", "error");
            return;
        }

        var paymentRadios = document.querySelectorAll('input[name="payment"]');
        var payment = "COD";
        for (var i = 0; i < paymentRadios.length; i++) {
            if (paymentRadios[i].checked) {
                payment = paymentRadios[i].value;
                break;
            }
        }

        var order = {
            id: Date.now(),
            customer: name,
            phone: phone,
            address: address,
            payment: payment,
            total: total,
            items: cart,
            status: "Chờ xác nhận",
            created_at: new Date().toISOString()
        };

        var orders = JSON.parse(localStorage.getItem("orders") || "[]");
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));
        localStorage.removeItem("cart");

        showToast("Đặt hàng thành công!", "success");
        
        setTimeout(function() {
            window.location.href = "../index.html";
        }, 1500);
    });
}