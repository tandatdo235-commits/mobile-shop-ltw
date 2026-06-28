async function register(fullName, email, password, role = 'user') {
    if (!fullName || !email || !password) {
        showToast('Vui lòng điền đầy đủ thông tin');
        return false;
    }
    if (password.length < 6) {
        showToast('Mật khẩu phải có ít nhất 6 ký tự');
        return false;
    }

    const body = { full_name: fullName, email, password, role };
    const data = await apiRequest('/auth/register', 'POST', body, false);
    if (data) {
        showToast('Đăng ký thành công! Vui lòng đăng nhập.');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return true;
    }
    return false;
}

async function login(email, password) {
    if (!email || !password) {
        showToast('Vui lòng nhập email và mật khẩu');
        return false;
    }

    const body = { email, password };
    const data = await apiRequest('/auth/login', 'POST', body, false);
    if (data && data.access_token) {
        setAuthData(data.access_token, email);
        if (data.user) setUserData(data.user);
        showToast('Đăng nhập thành công!');
        setTimeout(() => window.location.href = 'profile.html', 1000);
        return true;
    }
    return false;
}

function logout() {
    clearAuthData();
    showToast('Đã đăng xuất', 'info');
    setTimeout(() => window.location.href = 'login.html', 500);
}

function requireAuth() {
    if (!isLoggedIn()) {
        showToast('Vui lòng đăng nhập để tiếp tục');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return false;
    }
    return true;
}

async function getProfile() {
    if (!requireAuth()) return null;
    const data = await apiRequest('/auth/profile', 'GET');
    if (data) {
        setUserData(data);
        return data;
    }
    return null;
}

//cập nhật avatar
async function updateAvatar(avatarData) {
    if (!requireAuth()) return false;
    const data = await apiRequest('/auth/avatar', 'POST', { avatar: avatarData });
    if (data) {
        setUserData(data);
        return data;
    }
    return null;
}