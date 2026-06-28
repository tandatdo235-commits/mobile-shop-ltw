const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");

if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => {
        const keyword = searchInput.value.trim();
        
        if (keyword !== "") {
            // Kiểm tra xem người dùng đang ở thư mục gốc (index) hay thư mục con (pages)
            const currentPath = window.location.pathname;
            let targetUrl = "";

            if (currentPath.includes("/pages/")) {
                targetUrl = `products.html?search=${encodeURIComponent(keyword)}`;
            } else {
                
                targetUrl = `pages/products.html?search=${encodeURIComponent(keyword)}`;
            }

            // Chuyển hướng sang trang danh sách sản phẩm cùng từ khóa
            window.location.href = targetUrl;
        }
    });

    // Hỗ trợ bấm phím Enter để tìm kiếm
    searchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            searchBtn.click();
        }
    });
}