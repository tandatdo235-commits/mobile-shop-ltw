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

// Mock database
const MOCK_DB = {
    users: JSON.parse(localStorage.getItem('mock_users') || '[]')
};

function saveMockUsers() {
    localStorage.setItem('mock_users', JSON.stringify(MOCK_DB.users));
}

function findUserByEmail(email) {
    return MOCK_DB.users.find(u => u.email === email);
}

async function apiRequest(endpoint, method = 'GET', body = null, requiresAuth = true) {
    if (CONFIG.USE_MOCK) {
        return mockApiRequest(endpoint, method, body, requiresAuth);
    }

    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    const headers = { 'Content-Type': 'application/json' };

    if (requiresAuth) {
        const token = getToken();
        if (!token) {
            showToast('Bạn cần đăng nhập để thực hiện thao tác này');
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
                showToast('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
                setTimeout(() => window.location.href = 'login.html', 1500);
            } else {
                showToast(data.message || data.detail || 'Có lỗi xảy ra');
            }
            return null;
        }
        return data;
    } catch (error) {
        console.error('API error:');
        showToast('Không thể kết nối đến máy chủ');
        return null;
    }
}

async function mockApiRequest(endpoint, method = 'GET', body = null, requiresAuth = true) {
    // Đăng ký
    if (endpoint === '/auth/register' && method === 'POST') {
        const { full_name, email, password, role } = body;
        
        if (findUserByEmail(email)) {
            showToast('Email đã được đăng ký', 'error');
            return null;
        }

        const newUser = {
            id: MOCK_DB.users.length + 1,
            full_name,
            email,
            password,
            role: role || 'user',
            phone: '',
            address: '',
            avatar: 'assets/images/default-avatar.png',
            created_at: new Date().toISOString()
        };
        
        MOCK_DB.users.push(newUser);
        saveMockUsers();
        
        return { 
            message: 'Đăng ký thành công', 
            user: { ...newUser, password: undefined } 
        };
    }

    // Đăng nhập
    if (endpoint === '/auth/login' && method === 'POST') {
        const { email, password } = body;
        const user = findUserByEmail(email);
        
        if (!user || user.password !== password) {
            showToast('Email hoặc mật khẩu không đúng');
            return null;
        }

        const token = 'mock_token_' + Date.now();
        return {
            access_token: token,
            user: { ...user, password: undefined }
        };
    }
    if (endpoint === '/auth/profile' && method === 'GET') {
        const email = getUserEmail();
        if (!email) {
            showToast('Chưa đăng nhập');
            return null;
        }
        const user = findUserByEmail(email);
        if (!user) {
            showToast('Không tìm thấy người dùng');
            return null;
        }
        return { ...user, password: undefined };
    }

    // Cập nhật profile
    if (endpoint === '/auth/profile' && method === 'PUT') {
        const email = getUserEmail();
        if (!email) {
            showToast('Chưa đăng nhập', 'error');
            return null;
        }
        const user = findUserByEmail(email);
        if (!user) {
            showToast('Không tìm thấy người dùng');
            return null;
        }
        
        // Cập nhật thông tin
        Object.assign(user, body);
        saveMockUsers();
        
        return { ...user, password: undefined };
    }

    // Cập nhật avatar
    if (endpoint === '/auth/avatar' && method === 'POST') {
        const email = getUserEmail();
        if (!email) {
            showToast('Chưa đăng nhập', 'error');
            return null;
        }
        const user = findUserByEmail(email);
        if (!user) {
            showToast('Không tìm thấy người dùng');
            return null;
        }
        
        user.avatar = body.avatar;
        saveMockUsers();
        
        return { ...user, password: undefined };
    }

    showToast(`API ${endpoint} chưa được hỗ trợ trong chế độ mock`);
    return null;
}