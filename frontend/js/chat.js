var chatMessages = [];
var chatListeners = [];

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderMessage(message) {
    var container = document.getElementById('chat-messages');
    if (!container) return;

    var existing = container.querySelectorAll('.message');
    for (var i = 0; i < existing.length; i++) {
        var textEl = existing[i].querySelector('p');
        var timeEl = existing[i].querySelector('.time');
        if (textEl && textEl.textContent === message.text && 
            timeEl && timeEl.textContent === message.time) {
            return;
        }
    }

    var isUser = message.sender === 'user';
    var div = document.createElement('div');
    div.className = 'message ' + (isUser ? 'message-user' : 'message-staff');
    div.innerHTML = `
        <p>${escapeHtml(message.text)}</p>
        <span class="time">${message.time || new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function sendChatMessage(text) {
    if (!text.trim()) return;

    var userData = getUserData();
    var message = {
        sender: 'user',
        sender_id: userData?.id || 'unknown',
        text: text.trim(),
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    chatMessages.push(message);
    renderMessage(message);

    var input = document.getElementById('chat-input');
    if (input) input.value = '';

    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
        chatSocket.send(JSON.stringify(message));
    } else {
        showTypingIndicator();
        setTimeout(function() {
            removeTypingIndicator();
            var reply = {
                sender: 'staff',
                text: getAutoReply(text.trim()),
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            };
            chatMessages.push(reply);
            renderMessage(reply);
        }, 1000 + Math.random() * 1500);
    }
}

function getAutoReply(userMessage) {
    var lower = userMessage.toLowerCase();
    if (lower.includes('đơn hàng') || lower.includes('order')) {
        return 'Đơn hàng của bạn đang được xử lý. Vui lòng kiểm tra lại trong 24h tới.';
    }
    if (lower.includes('giá') || lower.includes('price') || lower.includes('bao nhiêu')) {
        return 'Giá sản phẩm được cập nhật liên tục trên website. Bạn có thể xem chi tiết tại trang sản phẩm.';
    }
    if (lower.includes('cảm ơn') || lower.includes('thanks')) {
        return 'Cảm ơn bạn! Chúng tôi luôn sẵn sàng hỗ trợ bạn.';
    }
    if (lower.includes('bảo hành') || lower.includes('warranty')) {
        return 'Sản phẩm được bảo hành chính hãng 12 tháng. Vui lòng giữ hóa đơn để được hỗ trợ.';
    }
    if (lower.includes('giao hàng') || lower.includes('ship') || lower.includes('vận chuyển')) {
        return 'Thời gian giao hàng dự kiến 2-5 ngày làm việc. Miễn phí vận chuyển cho đơn hàng trên 5 triệu.';
    }
    if (lower.includes('đổi trả') || lower.includes('return')) {
        return 'Chính sách đổi trả trong vòng 7 ngày nếu sản phẩm lỗi hoặc không sử dụng được.';
    }
    if (lower.includes('chào') || lower.includes('xin chào') || lower.includes('hi')) {
        return 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?';
    }
    return 'Cảm ơn bạn đã liên hệ. Nhân viên hỗ trợ sẽ phản hồi sớm nhất có thể!';
}

function showTypingIndicator() {
    var container = document.getElementById('chat-messages');
    if (!container) return;
    var indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
    var indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function loadChatHistory() {
    var container = document.getElementById('chat-messages');
    if (!container) return;
    container.innerHTML = '';
    for (var i = 0; i < chatMessages.length; i++) {
        renderMessage(chatMessages[i]);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) {
        var userData = getUserData();
        if (!userData) {
            var tempUser = {
                id: 'guest_' + Date.now(),
                full_name: 'Khách',
                role: 'guest'
            };
            setUserData(tempUser);
        }
    }

    if (typeof connectChat === 'function') {
        var userData = getUserData();
        var socket = connectChat(userData?.id || 'guest');
        if (socket) {
            chatListeners.push(function(message) {
                chatMessages.push(message);
                renderMessage(message);
            });
        }
    }

    if (chatMessages.length === 0) {
        var welcomeMsg = {
            sender: 'staff',
            text: 'Xin chào! Tôi là nhân viên hỗ trợ. Tôi có thể giúp gì cho bạn hôm nay?',
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
        chatMessages.push(welcomeMsg);
    }
    loadChatHistory();

    var sendBtn = document.getElementById('send-btn');
    var input = document.getElementById('chat-input');

    if (sendBtn) {
        sendBtn.onclick = function() {
            sendChatMessage(input?.value || '');
        };
    }
    if (input) {
        input.onkeypress = function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (sendBtn) sendBtn.click();
            }
        };
        input.focus();
    }
});