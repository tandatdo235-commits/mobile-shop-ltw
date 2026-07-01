const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

fetch("https://api-shopmobile-w12y.onrender.com/api/products")
.then(res => res.json())
.then(products => {

    const product = products.find(p => p._id == productId);
    console.log(product);

    if(!product) {
        console.error("Không tìm thấy sản phẩm!");
        return;
    }

    // 1. SỬA PHẦN GALLERY ẢNH (Bỏ replace, dùng đúng mảng images từ API)
    let currentImage = 0;
    const images = (product.images && product.images.length > 0) ? product.images : [product.thumbnail];
    
    document.getElementById("product-image").src = images[currentImage];

    document.getElementById("next-btn").addEventListener("click", () => {
        currentImage++;
        if(currentImage >= images.length){
            currentImage = 0;
        }
        document.getElementById("product-image").src = images[currentImage];
    });

    document.getElementById("prev-btn").addEventListener("click", () => {
        currentImage--;
        if(currentImage < 0){
            currentImage = images.length - 1;
        }
        document.getElementById("product-image").src = images[currentImage];
    });

    // 2. THÔNG TIN SẢN PHẨM
    document.getElementById("product-name").innerText = product.name;
    document.getElementById("product-price").innerText = Number(product.price).toLocaleString("vi-VN") + " đ";
    document.getElementById("product-description").innerText = product.description || "Sản phẩm chính hãng, bảo hành đầy đủ.";
    document.getElementById("product-promotion").innerText = product.promotion || "Không có khuyến mãi";

    // 3. THÔNG SỐ KỸ THUẬT
    const specsTable = document.getElementById("product-specs");
    if (product.specs) {
        const dict = {
            "screen": "Màn hình", "chip": "Chip xử lý", "ram": "RAM",
            "storage": "Bộ nhớ trong", "battery": "Pin & Sạc", 
            "camera": "Camera", "weight": "Trọng lượng"
        };

        let specsHTML = "";
        for (let key in product.specs) {
            let viKey = dict[key] || key;
            specsHTML += `
            <tr>
                <th>${viKey}</th>
                <td>${product.specs[key]}</td>
            </tr>
            `;
        }
        specsTable.innerHTML = specsHTML;
    }

    // 4. SẢN PHẨM LIÊN QUAN 
    const relatedProducts = products.filter(item =>
        item.category === product.category &&
        item._id !== product._id
    );

    const relatedBox = document.getElementById("related-products");
    
    relatedProducts.forEach(item => { 
        let imageSrc = item.thumbnail;

        let newPriceNum = Number(item.price);
        let oldPriceNum = item.discount ? Math.round(newPriceNum / (1 - item.discount / 100)) : newPriceNum;

        let newPriceStr = newPriceNum.toLocaleString("vi-VN");
        let oldPriceStr = oldPriceNum.toLocaleString("vi-VN");

        let badgeHTML = item.discount ? `<div class="sale-badge">Giảm ${item.discount}%</div>` : '';
        let oldPriceHTML = item.discount ? `<span class="old-price">${oldPriceStr} VNĐ</span>` : '';
        let promoHTML = item.promotion ? `<p class="promotion-text">${item.promotion}</p>` : '';

        
        relatedBox.innerHTML += `
        <a href="product-detail.html?id=${item._id}" class="related-card-link">
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

    // 5. THÊM VÀO GIỎ HÀNG
    document.getElementById("add-cart-btn").addEventListener("click", () => {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // kiểm tra sản phẩm đã có trong giỏ chưa
    const index = cart.findIndex(item => item.id === product._id);

    if(index !== -1){

        cart[index].quantity++;

    }else{

        cart.push({

            id: product._id,

            name: product.name,

            price: Number(product.price),

            quantity: 1,

            image: product.thumbnail

        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Đã thêm vào giỏ hàng!");

});
});
