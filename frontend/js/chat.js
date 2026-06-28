const MOCK_MESSAGES = [
    { sender: 'staff', text: 'Xin chào! Tôi có thể giúp gì cho bạn?', time: '10:00' },
    { sender: 'user', text: 'Cho tôi hỏi về đơn hàng #123', time: '10:01' },
    { sender: 'staff', text: 'Đơn hàng của bạn đang được xử lý, dự kiến giao vào ngày mai.', time: '10:02' },
];

let chatMessages = [...MOCK_MESSAGES];

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderMessage(message) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const isUser = message.sender === 'user';
    const div = document.createElement('div');
    div.className = `message ${isUser ? 'message-user' : 'message-staff'}`;
    div.innerHTML = `
        <p>${escapeHtml(message.text)}</p>
        <span class="time">${message.time || new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

async function sendChatMessage(message) {
    if (!message.trim()) return;

    const userMsg = {
        sender: 'user',
        text: message.trim(),
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
    chatMessages.push(userMsg);
    renderMessage(userMsg);

    const input = document.getElementById('chat-input');
    if (input) input.value = '';

    showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        const staffReply = {
            sender: 'staff',
            text: getAutoReply(message.trim()),
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
        chatMessages.push(staffReply);
        renderMessage(staffReply);
    }, 1000 + Math.random() * 1000);
}

function getAutoReply(userMessage) {
    const lower = userMessage.toLowerCase();
    if (lower.includes('đơn hàng')) return 'Đơn hàng của bạn đang được xử lý. Vui lòng kiểm tra lại sau 24h.';
    if (lower.includes('giá') || lower.includes('price')) return 'Giá sản phẩm được cập nhật trên website.';
    if (lower.includes('cảm ơn')) return 'Cảm ơn bạn! Chúng tôi luôn sẵn sàng hỗ trợ.';
    return 'Cảm ơn bạn đã liên hệ. Nhân viên sẽ phản hồi sớm nhất có thể.';
}

function showTypingIndicator() {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = `<span></span><span></span><span></span>`;
    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function loadChatHistory() {
    chatMessages = [...MOCK_MESSAGES];
    const container = document.getElementById('chat-messages');
    if (container) {
        container.innerHTML = '';
        chatMessages.forEach(msg => renderMessage(msg));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) return;
    loadChatHistory();

    const sendBtn = document.getElementById('send-btn');
    const input = document.getElementById('chat-input');

    if (sendBtn) {
        sendBtn.addEventListener('click', function() {
            sendChatMessage(input.value);
        });
    }
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendBtn.click();
            }
        });
    }
});