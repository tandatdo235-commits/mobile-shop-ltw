var products = JSON.parse(localStorage.getItem("products")) || [];
var orders = JSON.parse(localStorage.getItem("orders")) || [];

var revenueElement = document.getElementById("revenue");
var ordersElement = document.getElementById("orders-count");
var productsElement = document.getElementById("products-count");
var customersElement = document.getElementById("customers-count");

if (revenueElement) {
    var revenue = 0;
    for (var i = 0; i < orders.length; i++) {
        revenue += orders[i].total;
    }
    revenueElement.innerText = revenue.toLocaleString() + "đ";
    ordersElement.innerText = orders.length;
    productsElement.innerText = products.length;

    var customerSet = {};
    for (var i = 0; i < orders.length; i++) {
        customerSet[orders[i].customer] = true;
    }
    customersElement.innerText = Object.keys(customerSet).length;
}

var chartCanvas = document.getElementById("salesChart");
if (chartCanvas) {
    new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Doanh thu',
                data: [12000000, 15000000, 20000000, 18000000, 22000000, 25000000]
            }]
        }
    });
}

var productTable = document.getElementById("product-table");
if (productTable) {
    renderProducts();
}

function renderProducts() {
    var products = JSON.parse(localStorage.getItem("products")) || [];
    productTable.innerHTML = "";
    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        productTable.innerHTML += `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price.toLocaleString()}đ</td>
            <td>
                <button onclick="editProduct(${product.id})">Sửa</button>
            </td>
            <td>
                <button onclick="deleteProduct(${product.id})">Xóa</button>
            </td>
        </tr>
        `;
    }
}

var addBtn = document.getElementById("add-btn");
if (addBtn) {
    addBtn.addEventListener("click", function() {
        var name = prompt("Tên sản phẩm");
        var price = prompt("Giá");
        if (!name || !price) return;
        var products = JSON.parse(localStorage.getItem("products")) || [];
        products.push({
            id: Date.now(),
            name: name,
            price: Number(price)
        });
        localStorage.setItem("products", JSON.stringify(products));
        renderProducts();
    });
}

function deleteProduct(id) {
    var products = JSON.parse(localStorage.getItem("products")) || [];
    var newProducts = [];
    for (var i = 0; i < products.length; i++) {
        if (products[i].id !== id) {
            newProducts.push(products[i]);
        }
    }
    localStorage.setItem("products", JSON.stringify(newProducts));
    renderProducts();
}

function editProduct(id) {
    var products = JSON.parse(localStorage.getItem("products")) || [];
    var product = null;
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            product = products[i];
            break;
        }
    }
    var newName = prompt("Tên mới", product.name);
    var newPrice = prompt("Giá mới", product.price);
    product.name = newName;
    product.price = Number(newPrice);
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
}

var ordersTable = document.getElementById("orders-table");
if (ordersTable) {
    renderOrders();
}

function renderOrders() {
    var orders = JSON.parse(localStorage.getItem("orders")) || [];
    ordersTable.innerHTML = "";
    for (var i = 0; i < orders.length; i++) {
        var order = orders[i];
        ordersTable.innerHTML += `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.phone}</td>
            <td>${order.total.toLocaleString()}đ</td>
            <td>${order.payment}</td>
            <td>
                <select onchange="changeStatus(${order.id}, this.value)">
                    <option ${order.status === "Chờ xác nhận" ? "selected" : ""}>Chờ xác nhận</option>
                    <option ${order.status === "Đã duyệt" ? "selected" : ""}>Đã duyệt</option>
                    <option ${order.status === "Đang giao" ? "selected" : ""}>Đang giao</option>
                    <option ${order.status === "Hoàn thành" ? "selected" : ""}>Hoàn thành</option>
                    <option ${order.status === "Đã hủy" ? "selected" : ""}>Đã hủy</option>
                </select>
            </td>
            <td>
                <button onclick="viewOrder(${order.id})">Chi tiết</button>
            </td>
        </tr>
        `;
    }
}

function viewOrder(id) {
    var orders = JSON.parse(localStorage.getItem("orders")) || [];
    var order = null;
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].id === id) {
            order = orders[i];
            break;
        }
    }
    var productsHtml = "";
    for (var i = 0; i < order.items.length; i++) {
        var item = order.items[i];
        productsHtml += item.name + " x " + item.quantity + " - " + (item.price * item.quantity).toLocaleString() + "đ\n";
    }
    alert(
        "===== CHI TIẾT ĐƠN =====\n\n" +
        "Khách hàng: " + order.customer + "\n" +
        "SĐT: " + order.phone + "\n" +
        "Địa chỉ: " + order.address + "\n" +
        "------------------------\n" +
        productsHtml +
        "------------------------\n" +
        "Tổng tiền: " + order.total.toLocaleString() + "đ\n" +
        "Trạng thái: " + order.status
    );
}

function changeStatus(id, newStatus) {
    var orders = JSON.parse(localStorage.getItem("orders")) || [];
    var order = null;
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].id === id) {
            order = orders[i];
            break;
        }
    }
    order.status = newStatus;
    localStorage.setItem("orders", JSON.stringify(orders));
    showToast("Đơn #" + id + " đã chuyển sang " + newStatus);
}