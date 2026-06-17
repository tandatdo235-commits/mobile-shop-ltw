function displayProfile(user) {
    if (!user) {
        document.getElementById('profile-content').innerHTML = '<p style="color: var(--red); font-family: Arial, sans-serif;">Không thể tải thông tin.</p>';
        return;
    }

    document.getElementById('profile-name').textContent = user.full_name || user.name || 'Chưa cập nhật';
    document.getElementById('profile-email').textContent = user.email || '';
    document.getElementById('profile-phone').textContent = user.phone || 'Chưa cập nhật';
    document.getElementById('profile-address').textContent = user.address || 'Chưa cập nhật';
    document.getElementById('profile-avatar').src = user.avatar || 'assets/images/default-avatar.png';
    document.getElementById('profile-role').textContent = user.role || 'user';
    document.getElementById('profile-joined').textContent = user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'Chưa có';
}

async function updateProfile(data) {
    if (!requireAuth()) return false;
    const result = await apiRequest('/auth/profile', 'PUT', data);
    if (result) {
        showToast('Cập nhật thành công!', 'success');
        setUserData(result);
        displayProfile(result);
        return true;
    }
    return false;
}

document.addEventListener('DOMContentLoaded', async function() {
    if (!requireAuth()) return;

    let user = getUserData();
    if (user) displayProfile(user);

    const freshUser = await getProfile();
    if (freshUser) displayProfile(freshUser);

    const editBtn = document.getElementById('edit-profile-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            const form = document.getElementById('edit-form');
            if (form) {
                form.classList.toggle('show');
                if (form.classList.contains('show')) {
                    document.getElementById('edit-name').value = user?.full_name || '';
                    document.getElementById('edit-phone').value = user?.phone || '';
                    document.getElementById('edit-address').value = user?.address || '';
                }
            }
        });
    }

    const updateBtn = document.getElementById('update-profile-btn');
    if (updateBtn) {
        updateBtn.addEventListener('click', async function() {
            const name = document.getElementById('edit-name').value.trim();
            const phone = document.getElementById('edit-phone').value.trim();
            const address = document.getElementById('edit-address').value.trim();

            if (!name) {
                showToast('Họ tên không được để trống', 'error');
                return;
            }

            await updateProfile({ full_name: name, phone, address });
            document.getElementById('edit-form').classList.remove('show');
        });
    }
});