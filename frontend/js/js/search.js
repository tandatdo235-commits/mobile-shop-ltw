var searchBtn = document.getElementById("search-btn");
var searchInput = document.getElementById("search-input");

if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", function() {
        var keyword = searchInput.value.trim();
        
        if (keyword !== "") {
            var currentPath = window.location.pathname;
            var targetUrl = "";

            if (currentPath.includes("/pages/")) {
                targetUrl = "products.html?search=" + encodeURIComponent(keyword);
            } else {
                targetUrl = "pages/products.html?search=" + encodeURIComponent(keyword);
            }

            window.location.href = targetUrl;
        }
    });

    searchInput.addEventListener("keyup", function(e) {
        if (e.key === "Enter") {
            searchBtn.click();
        }
    });
}