async function register(fullName, email, password, role) {
    role = role || 'user';
    if (!fullName || !email || !password) {
        showToast('Vui lòng điền đầy đủ thông tin', 'error');
        return false;
    }
    if (password.length < 6) {
        showToast('Mật khẩu phải có ít nhất 6 ký tự', 'error');
        return false;
    }

    var body = { full_name: fullName, email: email, password: password, role: role };
    var data = await apiRequest('/auth/register', 'POST', body, false);
    if (data) {
        showToast('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
        setTimeout(function() { window.location.href = 'login.html'; }, 1500);
        return true;
    }
    return false;
}

async function login(email, password) {
    if (!email || !password) {
        showToast('Vui lòng nhập email và mật khẩu', 'error');
        return false;
    }

    const body = { email, password };
    
    try {
        const data = await apiRequest('/auth/login', 'POST', body, false);
        
        // SỬA Ở ĐÂY: Đổi data.access_token thành data.token
        if (data && data.token) { 
            
            // SỬA Ở ĐÂY: Truyền data.token vào hàm
            setAuthData(data.token, email); 
            if (data.user) setUserData(data.user);
            
            showToast('Đăng nhập thành công!', 'success');
            
            // KIỂM TRA ROLE ĐỂ CHUYỂN HƯỚNG
            setTimeout(() => {
                if (data.user && data.user.role === 'admin') {
                    window.location.href = 'admin/dashboard.html'; 
                } else {
                    window.location.href = '../index.html'; 
                }
            }, 1000);
            
            return true;
        } else {
            showToast('Sai email hoặc mật khẩu. Vui lòng thử lại!', 'error');
            return false;
        }
    } catch (error) {
        showToast('Lỗi kết nối máy chủ! Hãy kiểm tra F12.', 'error');
        console.error("Lỗi đăng nhập:", error);
        return false;
    }
}

function logout() {
    if (typeof globalWs !== 'undefined' && globalWs) {
        try {
            globalWs.close(1000, 'Đăng xuất');
        } catch(e) {}
    }
    clearAuthData();
    showToast('Đã đăng xuất', 'info');
    updateAuthUI();
    setTimeout(function() { window.location.href = '../index.html'; }, 500);
}

window.handleLogout = function() {
    logout();
};

function requireAuth() {
    if (!isLoggedIn()) {
        showToast('Vui lòng đăng nhập để tiếp tục', 'error');
        setTimeout(function() { window.location.href = 'login.html'; }, 1000);
        return false;
    }
    return true;
}

function requireAdmin() {
    if (!isLoggedIn()) {
        showToast('Vui lòng đăng nhập để tiếp tục', 'error');
        setTimeout(function() { window.location.href = '../pages/login.html'; }, 1000);
        return false;
    }
    var userData = getUserData();
    if (!userData || userData.role !== 'admin') {
        showToast('Bạn không có quyền truy cập trang này', 'error');
        setTimeout(function() { window.location.href = '../index.html'; }, 1500);
        return false;
    }
    return true;
}

function checkTokenExpired() {
    var token = getToken();
    if (!token) return false;
    try {
        var parts = token.split('.');
        if (parts.length !== 3) return false;
        var payload = JSON.parse(atob(parts[1]));
        var exp = payload.exp || 0;
        var now = Math.floor(Date.now() / 1000);
        if (exp < now) {
            clearAuthData();
            showToast('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại', 'error');
            setTimeout(function() { window.location.href = 'login.html'; }, 1500);
            return true;
        }
        return false;
    } catch(e) {
        return false;
    }
}

async function getProfile() {
    if (!requireAuth()) return null;
    if (checkTokenExpired()) return null;
    var data = await apiRequest('/auth/profile', 'GET');
    if (data) {
        setUserData(data);
        return data;
    }
    return null;
}

async function updateAvatar(avatarData) {
    if (!requireAuth()) return false;
    if (checkTokenExpired()) return false;
    var data = await apiRequest('/auth/avatar', 'POST', { avatar: avatarData });
    if (data) {
        setUserData(data);
        return data;
    }
    return null;
}

function updateAuthUI() {
    var authButtons = document.getElementById('authButtons');
    var userInfo = document.getElementById('userInfo');
    var userNameDisplay = document.getElementById('userNameDisplay');
    var userAvatar = document.getElementById('userAvatar');
    var cartCount = document.getElementById('cart-count-header');

    if (cartCount) {
        var cart = JSON.parse(localStorage.getItem('cart')) || [];
        var total = 0;
        for (var i = 0; i < cart.length; i++) {
            total = total + (Number(cart[i].quantity) || 1);
        }
        cartCount.textContent = total;
    }

    if (isLoggedIn() && !checkTokenExpired()) {
        var userData = getUserData();
        var name = userData?.full_name || userData?.name || 'User';
        var isAdmin = userData?.role === 'admin';
        
        if (authButtons) {
            authButtons.style.display = 'none';
        }
        if (userInfo) {
            userInfo.style.display = 'flex';
            if (userNameDisplay) {
                userNameDisplay.textContent = name + (isAdmin ? ' (Admin)' : '');
            }
            if (userAvatar) {
                userAvatar.src = userData?.avatar || '../assets/images/avatar.jpg';
                userAvatar.onerror = function() { this.src = '../assets/images/default-avatar.png'; };
            }
        }
        
        var avatar = document.getElementById('userAvatar');
        var dropdown = document.getElementById('dropdownMenu');
        if (avatar && dropdown) {
            avatar.onclick = function(e) {
                e.stopPropagation();
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                } else {
                    dropdown.classList.add('show');
                }
            };
            document.onclick = function() {
                dropdown.classList.remove('show');
            };
        }
        
        var adminLink = document.querySelector('.dropdown-menu a[href="../admin/dashboard.html"]');
        if (adminLink) {
            if (isAdmin) {
                adminLink.style.display = 'block';
            } else {
                adminLink.style.display = 'none';
            }
        }
    } else {
        if (authButtons) {
            authButtons.style.display = 'flex';
        }
        if (userInfo) {
            userInfo.style.display = 'none';
        }
    }
}

function createChatBubble() {
    if (document.getElementById('chat-bubble')) return;

    var bubble = document.createElement('div');
    bubble.id = 'chat-bubble';
    bubble.innerHTML = `
        <div class="chat-bubble-icon">
            <i class="fa-solid fa-comment-dots"></i>
        </div>
    `;
    
    var style = document.createElement('style');
    style.textContent = `
        #chat-bubble {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: #1f4ea3;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(31, 78, 163, 0.4);
            z-index: 9999;
            transition: all 0.3s ease;
            border: 3px solid rgba(255, 255, 255, 0.2);
        }
        #chat-bubble:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 30px rgba(31, 78, 163, 0.5);
        }
        #chat-bubble .chat-bubble-icon i {
            font-size: 28px;
            color: white;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }
        #chat-bubble .chat-bubble-ripple {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid rgba(31, 78, 163, 0.3);
            animation: ripple 2s infinite;
        }
        @keyframes ripple {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
        }
        @media (max-width: 768px) {
            #chat-bubble {
                width: 50px;
                height: 50px;
                bottom: 20px;
                right: 20px;
            }
            #chat-bubble .chat-bubble-icon i {
                font-size: 22px;
            }
        }
    `;
    document.head.appendChild(style);

    var ripple = document.createElement('div');
    ripple.className = 'chat-bubble-ripple';
    bubble.prepend(ripple);

    bubble.onclick = function() {
        window.location.href = '../pages/chat.html';
    };

    document.body.appendChild(bubble);
}

document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
    if (!window.location.pathname.includes('admin')) {
        createChatBubble();
    }
    if (isLoggedIn() && typeof initGlobalSocket === 'function') {
        initGlobalSocket();
    }
});

window.addEventListener('storage', function(e) {
    if (e.key === 'cart' || e.key === 'user_data' || e.key === 'token') {
        updateAuthUI();
    }
});

window.updateCartCount = function() {
    updateAuthUI();
};
