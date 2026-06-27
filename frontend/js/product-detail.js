const params =
new URLSearchParams(window.location.search);

const productId =
params.get("id");

fetch("../assets/mock-data/products.json")
.then(res => res.json())
.then(products => {

    const product =
    products.find(p => p.id == productId);
    console.log(product);

    let currentImage = 0;
    const images = Array.isArray(product.image)
        ? product.image
        : [product.image];
    document.getElementById("product-image").src =
    images[currentImage].replace(
        "./assets",
        "../assets"
    );

    document
    .getElementById("next-btn")
    .addEventListener("click", () => {
        currentImage++;
        if(currentImage >= images.length){
            currentImage = 0;
        }

        document.getElementById(
            "product-image"
        ).src =
        images[currentImage].replace(
            "./assets",
            "../assets"
        );

    });

    document
    .getElementById("prev-btn")
    .addEventListener("click", () => {
        currentImage--;
        if(currentImage < 0){
            currentImage =
            images.length - 1;
        }

        document.getElementById(
            "product-image"
        ).src =
        images[currentImage].replace(
            "./assets",
            "../assets"
        );

    });

    

    document.getElementById("product-name").innerText =
    product.name;

    document.getElementById("product-description").innerText = product.description || "Sản phẩm chính hãng, bảo hành đầy đủ.";
    document.getElementById("product-promotion").innerText = product.promotion || "Đang cập nhật chương trình khuyến mãi.";


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
    .innerText = product.promotion || "Không có khuyến mãi";

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
        // 1. Xử lý ảnh
        let itemImgData = item.image || item.images;
        let imageSrc = Array.isArray(itemImgData) ? itemImgData[0] : itemImgData;
        imageSrc = imageSrc.replace("./assets", "../assets");

        // 2. Tính toán giá tiền (Logic giống hệt trang chủ)
        let newPriceNum = Number(item.price);
        // Nếu có discount, tính ngược lại giá cũ (giá gốc)
        let oldPriceNum = item.discount ? Math.round(newPriceNum / (1 - item.discount / 100)) : newPriceNum;

        let newPriceStr = newPriceNum.toLocaleString("vi-VN");
        let oldPriceStr = oldPriceNum.toLocaleString("vi-VN");

        // 3. Tạo các thành phần HTML (Dùng lại class từ style.css)
        let badgeHTML = item.discount ? `<div class="sale-badge">Giảm ${item.discount}%</div>` : '';
        let oldPriceHTML = item.discount ? `<span class="old-price">${oldPriceStr} VNĐ</span>` : '';
        let promoHTML = item.promotion ? `<p class="promotion-text">${item.promotion}</p>` : '';

        // 4. Render vào HTML
        relatedBox.innerHTML += `
        <a href="product-detail.html?id=${item.id}" class="related-card-link">
            <div class="product-card">
                ${badgeHTML}
                <img src="${imageSrc}" alt="${item.name}">
                <h3 class="product-name">${item.name}</h3>
                
                <div class="price-box">
                    <span class="new-price">${newPriceStr} VNĐ</span>
                    ${oldPriceHTML}
                </div>
                
                ${promoHTML}
            </div>
        </a>
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

