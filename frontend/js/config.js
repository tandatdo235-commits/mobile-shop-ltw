const CONFIG = {
    API_BASE_URL: 'http://localhost:8000/api',
    TOKEN_KEY: 'access_token',
    USER_EMAIL_KEY: 'user_email',
    USER_DATA_KEY: 'user_data',
    // Chế độ mock để test khi backend chưa sẵn sàng
    USE_MOCK: true // Set false khi có backend thật
};

function getToken() {
    return localStorage.getItem(CONFIG.TOKEN_KEY);
}

function getUserEmail() {
    return localStorage.getItem(CONFIG.USER_EMAIL_KEY);
}

function isLoggedIn() {
    return !!getToken() && !!getUserEmail();
}

function setAuthData(token, email) {
    localStorage.setItem(CONFIG.TOKEN_KEY, token);
    localStorage.setItem(CONFIG.USER_EMAIL_KEY, email);
}

function clearAuthData() {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_EMAIL_KEY);
    localStorage.removeItem(CONFIG.USER_DATA_KEY);
}

function getUserData() {
    const data = localStorage.getItem(CONFIG.USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
}

function setUserData(user) {
    localStorage.setItem(CONFIG.USER_DATA_KEY, JSON.stringify(user));
}