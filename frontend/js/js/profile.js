function displayProfile(user) {
    if (!user) {
        document.getElementById('profile-content').innerHTML = '<p style="color: var(--red);">Không thể tải thông tin.</p>';
        return;
    }

    document.getElementById('profile-name').textContent = user.full_name || user.name || 'Chưa cập nhật';
    document.getElementById('profile-email').textContent = user.email || '';
    document.getElementById('profile-phone').textContent = user.phone || 'Chưa cập nhật';
    document.getElementById('profile-address').textContent = user.address || 'Chưa cập nhật';
    
    document.getElementById('profile-avatar').src = user.avatar || '../assets/images/avatar.jpg';
    
    document.getElementById('profile-role').textContent = user.role === 'admin' ? 'Quản trị viên' : 'Thành viên';
    document.getElementById('profile-joined').textContent = user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'Chưa có';

    document.getElementById('info-fullname').textContent = user.full_name || user.name || '-';
    document.getElementById('info-email').textContent = user.email || '-';
    document.getElementById('info-phone').textContent = user.phone || 'Chưa cập nhật';
    document.getElementById('info-address').textContent = user.address || 'Chưa cập nhật';
    document.getElementById('info-joined').textContent = user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'Chưa có';
    document.getElementById('info-role').textContent = user.role === 'admin' ? 'Quản trị viên' : 'Thành viên';

    document.getElementById('stat-orders').textContent = user.total_orders || 0;
    document.getElementById('stat-reviews').textContent = user.total_reviews || 0;
    document.getElementById('stat-favorites').textContent = user.total_favorites || 0;
    document.getElementById('stat-points').textContent = user.loyalty_points || 0;
}

async function updateProfile(data) {
    if (!requireAuth()) return false;
    var result = await apiRequest('/auth/profile', 'PUT', data);
    if (result) {
        showToast('Cập nhật thành công!', 'success');
        setUserData(result);
        displayProfile(result);
        return true;
    }
    return false;
}

async function updateAvatar(avatarData) {
    if (!requireAuth()) return false;
    var result = await apiRequest('/auth/avatar', 'POST', { avatar: avatarData });
    if (result) {
        setUserData(result);
        return result;
    }
    return null;
}

function setupAvatarUpload() {
    var avatarInput = document.getElementById('avatar-input');
    var avatarImg = document.getElementById('profile-avatar');
    var avatarBtn = document.getElementById('change-avatar-btn');

    if (avatarBtn && avatarInput) {
        avatarBtn.addEventListener('click', function() {
            avatarInput.click();
        });
    }

    if (avatarInput) {
        avatarInput.addEventListener('change', async function(e) {
            var file = e.target.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                showToast('Vui lòng chọn file ảnh', 'error');
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                showToast('Ảnh không được vượt quá 2MB', 'error');
                return;
            }

            var reader = new FileReader();
            reader.onload = async function(event) {
                var avatarData = event.target.result;
                if (avatarImg) avatarImg.src = avatarData;

                var result = await updateAvatar(avatarData);
                if (result) {
                    showToast('Cập nhật avatar thành công!', 'success');
                    var updatedUser = await getProfile();
                    if (updatedUser) displayProfile(updatedUser);
                }
            };
            reader.readAsDataURL(file);
        });
    }
}

async function loadOrdersIntoProfile() {
    var orderContainer = document.getElementById('order-list');
    if (!orderContainer) return;

    try {
        if (typeof fetchOrders === 'function') {
            var orders = await fetchOrders();
            if (orders && orders.length > 0) {
                var html = '';
                for (var i = 0; i < Math.min(orders.length, 3); i++) {
                    var order = orders[i];
                    var statusMap = {
                        'pending': 'Đang xử lý',
                        'processing': 'Đang giao',
                        'completed': 'Hoàn thành',
                        'cancelled': 'Đã hủy'
                    };
                    var statusText = statusMap[order.status] || order.status;
                    var date = new Date(order.created_at).toLocaleDateString('vi-VN');
                    html += `
                        <div class="order-item" style="padding: 12px; margin-bottom: 8px; border-left: 3px solid var(--primary);">
                            <div style="display:flex; justify-content:space-between; flex-wrap:wrap;">
                                <strong>#${order.id}</strong>
                                <span>${date}</span>
                                <span class="order-status ${order.status}">${statusText}</span>
                            </div>
                            <div>Tổng: ${order.total_price.toLocaleString('vi-VN')} đ</div>
                        </div>
                    `;
                }
                html += '<a href="orderhistory.html" class="btn btn-primary btn-sm">Xem tất cả</a>';
                orderContainer.innerHTML = html;
            } else {
                orderContainer.innerHTML = '<p style="color: var(--gray-600);">Chưa có đơn hàng nào.</p>';
            }
        } else {
            orderContainer.innerHTML = '<p style="color: var(--gray-600);">Chưa có đơn hàng nào.</p>';
        }
    } catch (error) {
        orderContainer.innerHTML = '<p style="color: var(--gray-600);">Không thể tải đơn hàng.</p>';
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    if (!requireAuth()) return;

    var user = getUserData();
    if (user) displayProfile(user);

    var freshUser = await getProfile();
    if (freshUser) displayProfile(freshUser);

    setupAvatarUpload();
    await loadOrdersIntoProfile();

    var editBtn = document.getElementById('edit-profile-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            var form = document.getElementById('edit-form');
            if (form) {
                form.classList.toggle('show');
                if (form.classList.contains('show')) {
                    var userData = getUserData();
                    document.getElementById('edit-name').value = userData?.full_name || '';
                    document.getElementById('edit-phone').value = userData?.phone || '';
                    document.getElementById('edit-address').value = userData?.address || '';
                }
            }
        });
    }

    var updateBtn = document.getElementById('update-profile-btn');
    if (updateBtn) {
        updateBtn.addEventListener('click', async function() {
            var name = document.getElementById('edit-name').value.trim();
            var phone = document.getElementById('edit-phone').value.trim();
            var address = document.getElementById('edit-address').value.trim();

            if (!name) {
                showToast('Họ tên không được để trống');
                return;
            }

            await updateProfile({ full_name: name, phone: phone, address: address });
            document.getElementById('edit-form').classList.remove('show');
        });
    }
});