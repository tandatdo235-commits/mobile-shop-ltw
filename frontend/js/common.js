function showToast(message, type = 'info', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

async function apiRequest(endpoint, method = 'GET', body = null, requiresAuth = true) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    const headers = { 'Content-Type': 'application/json' };

    if (requiresAuth) {
        const token = getToken();
        if (!token) {
            showToast('Bạn cần đăng nhập để thực hiện thao tác này', 'error');
            return null;
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers, body: body ? JSON.stringify(body) : null };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        if (!response.ok) {
            if (response.status === 401) {
                clearAuthData();
                showToast('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', 'error');
                setTimeout(() => window.location.href = 'login.html', 1500);
            } else {
                showToast(data.message || data.detail || 'Có lỗi xảy ra', 'error');
            }
            return null;
        }
        return data;
    } catch (error) {
        console.error('API error:', error);
        showToast('Không thể kết nối đến máy chủ', 'error');
        return null;
    }
}