function showToast(message) {
    var toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(function() {
        toast.classList.add("show");
    }, 100);

    setTimeout(function() {
        toast.remove();
    }, 3000);
}

setInterval(function() {
    if (window.location.href.includes("orders.html")) {
        showToast("Có đơn hàng mới!");
    }
}, 30000);