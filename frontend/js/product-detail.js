const params =
new URLSearchParams(window.location.search);

const productId =
params.get("id");

fetch("../assets/mock-data/products.json")
.then(res => res.json())
.then(products => {

    const product =
    products.find(p => p.id == productId);

    document.getElementById("product-image").src =
    product.image.replace("./assets","../assets");

    document.getElementById("product-name").innerText =
    product.name;

    document.getElementById("product-price").innerText =
    product.price + " đ";

    document.getElementById("product-description").innerText =
    product.description;

    document
    .getElementById("add-cart-btn")
    .addEventListener("click", () => {

        let cart =
        JSON.parse(localStorage.getItem("cart"))
        || [];

        cart.push(product);

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        alert("Đã thêm vào giỏ hàng!");
    });

});