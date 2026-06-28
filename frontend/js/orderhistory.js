// orderhistory.js
const MOCK_ORDERS = [
    {
        id: 1,
        created_at: '2026-06-01T10:30:00',
        total_price: 25000000,
        status: 'completed',
        items: [
            { product_name: 'iPhone 15 Pro Max', quantity: 1, price: 22000000 },
            { product_name: 'Ốp lưng iPhone', quantity: 2, price: 1500000 }
        ],
        shipping_address: '123 Nguyễn Trãi, Quận 1, TP.HCM',
        payment_method: 'COD'
    },
    {
        id: 2,
        created_at: '2026-05-20T14:15:00',
        total_price: 8500000,
        status: 'processing',
        items: [
            { product_name: 'Samsung Galaxy S24', quantity: 1, price: 8500000 }
        ],
        shipping_address: '456 Lê Lợi, Quận 3, TP.HCM',
        payment_method: 'Bank Transfer'
    },
    {
        id: 3,
        created_at: '2026-05-10T09:00:00',
        total_price: 12000000,
        status: 'cancelled',
        items: [
            { product_name: 'MacBook Air M2', quantity: 1, price: 12000000 }
        ],
        shipping_address: '789 Võ Văn Tần, Quận 10, TP.HCM',
        payment_method: 'Credit Card'
    }
];

async function fetchOrders() {
    if (!requireAuth()) return [];
    return MOCK_ORDERS;
}

function renderOrders(orders) {
    const container = document.getElementById('order-list');
    if (!container) return;

    if (!orders || orders.length === 0) {
        container.innerHTML = `
            <div class="empty-orders">
                <p>Bạn chưa có đơn hàng nào.</p>
                <a href="index.html" class="btn btn-primary">Mua sắm ngay</a>
            </div>
        `;
        return;
    }

    orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const statusMap = {
        'pending': 'Đang xử lý',
        'processing': 'Đang giao',
        'completed': 'Hoàn thành',
        'cancelled': 'Đã hủy'
    };
    const statusClass = {
        'pending': 'status-pending',
        'processing': 'status-processing',
        'completed': 'status-completed',
        'cancelled': 'status-cancelled'
    };

    let html = '';
    orders.forEach(order => {
        const statusText = statusMap[order.status] || order.status;
        const cls = statusClass[order.status] || 'status-pending';
        html += `
            <div class="order-item">
                <div class="order-header">
                    <div>
                        <span class="order-id">#${order.id}</span>
                        <span class="order-date">${new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <span class="order-status ${cls}">${statusText}</span>
                </div>
                <div class="order-details">
                    <div><span class="label">Tổng tiền:</span> ${order.total_price.toLocaleString('vi-VN')} đ</div>
                    <div><span class="label">Phương thức:</span> ${order.payment_method}</div>
                    <div style="grid-column: 1 / -1;"><span class="label">Địa chỉ:</span> ${order.shipping_address}</div>
                </div>
                <div style="margin-top:10px;">
                    <button class="toggle-detail" data-id="${order.id}">Xem chi tiết</button>
                </div>
                <div id="order-items-${order.id}" class="order-items">
                    <ul>
                        ${order.items.map(item => `<li>${item.product_name} x ${item.quantity} - ${item.price.toLocaleString('vi-VN')} đ</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    document.querySelectorAll('.toggle-detail').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const itemsDiv = document.getElementById(`order-items-${id}`);
            if (itemsDiv) {
                itemsDiv.classList.toggle('show');
                this.textContent = itemsDiv.classList.contains('show') ? 'Thu gọn' : 'Xem chi tiết';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    if (!requireAuth()) return;
    const orders = await fetchOrders();
    renderOrders(orders);
});