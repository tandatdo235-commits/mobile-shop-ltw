const products =
JSON.parse(localStorage.getItem("products")) || [];

const orders =
JSON.parse(localStorage.getItem("orders")) || [];

const revenueElement =
document.getElementById("revenue");

const ordersElement =
document.getElementById("orders-count");

const productsElement =
document.getElementById("products-count");

const customersElement =
document.getElementById("customers-count");

if(revenueElement){

    let revenue = 0;

    orders.forEach(order=>{
        revenue += order.total;
    });

    revenueElement.innerText =
    revenue.toLocaleString()+"đ";

    ordersElement.innerText =
    orders.length;

    productsElement.innerText =
    products.length;

    customersElement.innerText =
    new Set(
        orders.map(
            order=>order.customer
        )
    ).size;

}

const chartCanvas =
document.getElementById("salesChart");

if(chartCanvas){

new Chart(chartCanvas,{

type:'bar',

data:{

labels:[
'Jan','Feb','Mar',
'Apr','May','Jun'
],

datasets:[{

label:'Doanh thu',

data:[
12000000,
15000000,
20000000,
18000000,
22000000,
25000000
]

}]

}

});

}
const productTable =
document.getElementById(
"product-table"
);

if(productTable){

renderProducts();

}

function renderProducts(){

let products =
JSON.parse(
localStorage.getItem("products")
) || [];

productTable.innerHTML="";

products.forEach(product=>{

productTable.innerHTML += `

<tr>

<td>${product.id}</td>

<td>${product.name}</td>

<td>
${product.price.toLocaleString()}đ
</td>

<td>

<button
onclick="editProduct(${product.id})">

Sửa

</button>

</td>

<td>

<button
onclick="deleteProduct(${product.id})">

Xóa

</button>

</td>

</tr>

`;

});

}

const addBtn =
document.getElementById("add-btn");

if(addBtn){

addBtn.addEventListener(
"click",

()=>{

let name =
prompt("Tên sản phẩm");

let price =
prompt("Giá");

if(!name || !price)
return;

let products =
JSON.parse(
localStorage.getItem("products")
) || [];

products.push({

id:Date.now(),

name,

price:Number(price)

});

localStorage.setItem(
"products",
JSON.stringify(products)
);

renderProducts();

}

);

}

function deleteProduct(id){

let products =
JSON.parse(
localStorage.getItem("products")
) || [];

products =
products.filter(
product=>product.id!==id
);

localStorage.setItem(
"products",
JSON.stringify(products)
);

renderProducts();

}

function editProduct(id){

let products =
JSON.parse(
localStorage.getItem("products")
) || [];

const product =
products.find(
product=>product.id===id
);

const newName =
prompt(
"Tên mới",
product.name
);

const newPrice =
prompt(
"Giá mới",
product.price
);

product.name =
newName;

product.price =
Number(newPrice);

localStorage.setItem(
"products",
JSON.stringify(products)
);

renderProducts();

}

const ordersTable =
document.getElementById("orders-table");

if(ordersTable){

renderOrders();

}

function renderOrders(){

const orders =
JSON.parse(
localStorage.getItem("orders")
) || [];

ordersTable.innerHTML = "";

orders.forEach(order=>{

ordersTable.innerHTML += `

<tr>

<td>#${order.id}</td>

<td>${order.customer}</td>

<td>${order.phone}</td>

<td>
${order.total.toLocaleString()}đ
</td>

<td>
${order.payment}
</td>

<td>

<select
onchange="changeStatus(
${order.id},
this.value
)">

<option
${order.status==="Chờ xác nhận"?"selected":""}>
Chờ xác nhận
</option>

<option
${order.status==="Đã duyệt"?"selected":""}>
Đã duyệt
</option>

<option
${order.status==="Đang giao"?"selected":""}>
Đang giao
</option>

<option
${order.status==="Hoàn thành"?"selected":""}>
Hoàn thành
</option>

<option
${order.status==="Đã hủy"?"selected":""}>
Đã hủy
</option>

</select>

</td>

<td>

<button
onclick="viewOrder(${order.id})">

Chi tiết

</button>

</td>

</tr>

`;

});

}
function viewOrder(id){

const orders =
JSON.parse(
localStorage.getItem("orders")
) || [];

const order =
orders.find(
order=>order.id===id
);

let productsHtml = "";

order.items.forEach(item=>{

productsHtml +=

`
${item.name}
x ${item.quantity}

- ${(
item.price *
item.quantity
).toLocaleString()}đ

\n
`;

});

alert(

`
===== CHI TIẾT ĐƠN =====

Khách hàng:
${order.customer}

SĐT:
${order.phone}

Địa chỉ:
${order.address}

------------------------

${productsHtml}

------------------------

Tổng tiền:
${order.total.toLocaleString()}đ

Trạng thái:
${order.status}

`

);

}
function changeStatus(
id,
newStatus
){

let orders =
JSON.parse(
localStorage.getItem("orders")
) || [];

const order =
orders.find(
order=>order.id===id
);

order.status =
newStatus;

localStorage.setItem(
"orders",
JSON.stringify(orders)
);

showToast(
`Đơn #${id}
đã chuyển sang
${newStatus}`
);

}