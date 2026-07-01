var globalWs = null;
var wsListeners = [];

function showToast(message, type, duration) {
    type = type || 'info';
    duration = duration || 3000;
    
    var container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(function() { toast.remove(); }, 300);
    }, duration);
}

function initGlobalSocket() {
    var token = getToken();
    if (!token) {
        return null;
    }

    if (globalWs && globalWs.readyState === WebSocket.OPEN) {
        return globalWs;
    }

    if (globalWs) {
        try {
            globalWs.close();
        } catch(e) {}
        globalWs = null;
    }

    var wsUrl = CONFIG.WS_URL + '/?token=' + token;

    try {
        globalWs = new WebSocket(wsUrl);

        globalWs.onopen = function() {
            console.log('WebSocket đã kết nối');
        };

        globalWs.onmessage = function(event) {
            try {
                var data = JSON.parse(event.data);
                for (var i = 0; i < wsListeners.length; i++) {
                    try {
                        wsListeners[i](data);
                    } catch(e) {}
                }
            } catch(e) {}
        };

        globalWs.onclose = function(event) {
            globalWs = null;
            if (isLoggedIn() && event.code !== 1000) {
                setTimeout(function() {
                    initGlobalSocket();
                }, 3000);
            }
        };

        globalWs.onerror = function(error) {
            console.error('WebSocket lỗi:', error);
        };

        return globalWs;
    } catch(e) {
        return null;
    }
}

function sendWsMessage(message) {
    if (!globalWs || globalWs.readyState !== WebSocket.OPEN) {
        initGlobalSocket();
        if (!globalWs || globalWs.readyState !== WebSocket.OPEN) {
            showToast('Không thể kết nối đến máy chủ chat', 'error');
            return false;
        }
    }
    
    try {
        globalWs.send(JSON.stringify(message));
        return true;
    } catch(e) {
        return false;
    }
}

function addWsListener(callback) {
    if (typeof callback === 'function') {
        wsListeners.push(callback);
    }
}

function removeWsListener(callback) {
    var index = wsListeners.indexOf(callback);
    if (index > -1) {
        wsListeners.splice(index, 1);
    }
}

var MOCK_DB = {
    users: JSON.parse(localStorage.getItem('mock_users') || '[]')
};

function saveMockUsers() {
    localStorage.setItem('mock_users', JSON.stringify(MOCK_DB.users));
}

function findUserByEmail(email) {
    for (var i = 0; i < MOCK_DB.users.length; i++) {
        if (MOCK_DB.users[i].email === email) {
            return MOCK_DB.users[i];
        }
    }
    return null;
}

async function apiRequest(endpoint, method, body, requiresAuth) {
    method = method || 'GET';
    requiresAuth = (requiresAuth !== undefined) ? requiresAuth : true;

    if (CONFIG.USE_MOCK) {
        return mockApiRequest(endpoint, method, body, requiresAuth);
    }

    var url = CONFIG.API_BASE_URL + endpoint;
    var headers = { 'Content-Type': 'application/json' };

    if (requiresAuth) {
        var token = getToken();
        if (!token) {
            showToast('Bạn cần đăng nhập để thực hiện thao tác này', 'error');
            return null;
        }
        headers['Authorization'] = 'Bearer ' + token;
    }

    var options = { method: method, headers: headers };
    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        var response = await fetch(url, options);
        var data = await response.json();
        if (!response.ok) {
            if (response.status === 401) {
                clearAuthData();
                showToast('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', 'error');
                setTimeout(function() { window.location.href = 'login.html'; }, 1500);
            } else {
                showToast(data.message || data.detail || 'Có lỗi xảy ra', 'error');
            }
            return null;
        }
        return data;
    } catch(error) {
        showToast('Không thể kết nối đến máy chủ', 'error');
        return null;
    }
}

async function mockApiRequest(endpoint, method, body, requiresAuth) {
    if (endpoint === '/auth/register' && method === 'POST') {
        var full_name = body.full_name;
        var email = body.email;
        var password = body.password;
        var role = body.role || 'user';
        
        if (findUserByEmail(email)) {
            showToast('Email đã được đăng ký', 'error');
            return null;
        }

        var newUser = {
            id: MOCK_DB.users.length + 1,
            full_name: full_name,
            email: email,
            password: password,
            role: role,
            phone: '',
            address: '',
            avatar: 'assets/images/default-avatar.png',
            created_at: new Date().toISOString()
        };
        
        MOCK_DB.users.push(newUser);
        saveMockUsers();
        
        var userCopy = JSON.parse(JSON.stringify(newUser));
        delete userCopy.password;
        
        return { 
            message: 'Đăng ký thành công', 
            user: userCopy
        };
    }

    if (endpoint === '/auth/login' && method === 'POST') {
        var email = body.email;
        var password = body.password;
        var user = findUserByEmail(email);
        
        if (!user || user.password !== password) {
            showToast('Email hoặc mật khẩu không đúng', 'error');
            return null;
        }

        var token = 'mock_token_' + Date.now();
        var userCopy = JSON.parse(JSON.stringify(user));
        delete userCopy.password;
        
        return {
            token: token,
            user: userCopy
        };
    }

    if (endpoint === '/auth/profile' && method === 'GET') {
        var email = getUserEmail();
        if (!email) {
            showToast('Chưa đăng nhập', 'error');
            return null;
        }
        var user = findUserByEmail(email);
        if (!user) {
            showToast('Không tìm thấy người dùng', 'error');
            return null;
        }
        var userCopy = JSON.parse(JSON.stringify(user));
        delete userCopy.password;
        return userCopy;
    }

    if (endpoint === '/auth/profile' && method === 'PUT') {
        var email = getUserEmail();
        if (!email) {
            showToast('Chưa đăng nhập', 'error');
            return null;
        }
        var user = findUserByEmail(email);
        if (!user) {
            showToast('Không tìm thấy người dùng', 'error');
            return null;
        }
        
        for (var key in body) {
            if (body.hasOwnProperty(key)) {
                user[key] = body[key];
            }
        }
        saveMockUsers();
        
        var userCopy = JSON.parse(JSON.stringify(user));
        delete userCopy.password;
        return userCopy;
    }

    if (endpoint === '/auth/avatar' && method === 'POST') {
        var email = getUserEmail();
        if (!email) {
            showToast('Chưa đăng nhập', 'error');
            return null;
        }
        var user = findUserByEmail(email);
        if (!user) {
            showToast('Không tìm thấy người dùng', 'error');
            return null;
        }
        
        user.avatar = body.avatar;
        saveMockUsers();
        
        var userCopy = JSON.parse(JSON.stringify(user));
        delete userCopy.password;
        return userCopy;
    }

    if (endpoint === '/chat/admin' && method === 'GET') {
        return { admin_id: 1, admin_name: 'Admin' };
    }

    if (endpoint === '/chat/recent' && method === 'GET') {
        return [
            { id: 2, full_name: 'Nguyễn Văn B', last_message: 'Xin chào', last_time: '2024-05-24 10:30:00' },
            { id: 3, full_name: 'Trần Thị C', last_message: 'Cảm ơn bạn', last_time: '2024-05-24 09:15:00' },
            { id: 4, full_name: 'Lê Văn D', last_message: 'Ok', last_time: '2024-05-23 16:20:00' }
        ];
    }

    return null;
}

function getAdminId() {
    return 1;
}

var PRODUCT_DB = JSON.parse(localStorage.getItem('products') || '[]');
var ORDER_DB = JSON.parse(localStorage.getItem('orders') || '[]');
var CART_DB = JSON.parse(localStorage.getItem('cart') || '[]');

function saveProducts(data) {
    localStorage.setItem('products', JSON.stringify(data));
}

function saveOrders(data) {
    localStorage.setItem('orders', JSON.stringify(data));
}

function saveCart(data) {
    localStorage.setItem('cart', JSON.stringify(data));
}