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
    Number(product.price).toLocaleString("vi-VN") + " đ";

    document.getElementById("product-description").innerText =
    product.description ||
    "Sản phẩm chính hãng, bảo hành đầy đủ.";

    const specsDiv =
        document.getElementById("product-specs");
        if(product.specs){
            let specsHTML = "<table>";
            for(let key in product.specs){
                specsHTML += `
                <tr>
                    <td><b>${key}</b></td>
                    <td>${product.specs[key]}</td>
                </tr>
                `;
            }

            specsHTML += "</table>";

            specsDiv.innerHTML = specsHTML;
        }

    document.getElementById("product-promotion")
    .innerText = product.promotion;

    const relatedProducts =
        products.filter(item =>
            item.category === product.category &&
            item.id !== product.id
        );

    const relatedBox =
        document.getElementById(
            "related-products"
        );
        relatedProducts.forEach(item => {
            relatedBox.innerHTML += `
                <div class="related-card">
                    <img src="${item.image.replace("./assets","../assets")}">
                    <h3>${item.name}</h3>
                    <p>${Number(item.price).toLocaleString("vi-VN")} đ</p>
                    <a href="product-detail.html?id=${item.id}">
                        <button>
                            Xem chi tiết
                        </button>
                    </a>
                </div>
            `;
        });

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

