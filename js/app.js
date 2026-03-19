// ===== MAIN APPLICATION LOGIC =====

document.addEventListener('DOMContentLoaded', function() {
    // Setup the application
    setupDashboard();
    loadPosts();
    loadFriendsUI();
    loadNotifications();

    // Setup event listeners
    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', handleCreatePost);
    }

    // Auto-refresh posts every 3 seconds for real-time feel
    setInterval(loadPosts, 3000);
});

// ===== SETUP DASHBOARD =====
function setupDashboard() {
    const userNameEl = document.getElementById('userName');
    const userBioEl = document.getElementById('userBio');
    const userPicEl = document.getElementById('userPic');
    const friendsCountEl = document.getElementById('friendsCount');

    if (db.currentUser) {
        if (userNameEl) userNameEl.textContent = db.currentUser.name;
        if (userBioEl) userBioEl.textContent = db.currentUser.bio || 'No bio yet';
        if (userPicEl) userPicEl.src = db.currentUser.profilePic;
        if (friendsCountEl) friendsCountEl.textContent = (db.currentUser.friends || []).length;
    }
}

// ===== CREATE POST =====
function handleCreatePost(e) {
    e.preventDefault();

    const postText = document.getElementById('postText');
    if (!postText.value.trim()) {
        showError('Please write something');
        return;
    }

    const post = db.createPost(db.currentUser.id, postText.value);
    postText.value = '';
    
    showNotification('📝 Post created successfully!', 'success');
    loadPosts();
}

// ===== LOAD AND DISPLAY POSTS =====
function loadPosts() {
    const feedEl = document.getElementById('feed');
    if (!feedEl) return;

    const posts = db.getPosts();
    feedEl.innerHTML = '';

    posts.forEach(post => {
        const author = db.getUserById(post.userId);
        if (!author) return;

        const isLiked = post.likes.includes(db.currentUser.id);
        const postHTML = `
            <div class="post-card">
                <div class="post-header">
                    <div class="post-author">
                        <img src="${author.profilePic}" alt="${author.name}" class="post-avatar">
                        <div>
                            <h3>${author.name}</h3>
                            <small>${formatDate(post.createdAt)}</small>
                        </div>
                    </div>
                </div>
                <div class="post-content">
                    ${post.content}
                </div>
                <div class="post-actions">
                    <button class="btn-action ${isLiked ? 'liked' : ''}" onclick="toggleLike('${post.id}')">
                        ${isLiked ? '❤️' : '🤍'} ${post.likes.length}
                    </button>
                    <button class="btn-action" onclick="toggleComments('${post.id}')">
                        💬 ${post.comments.length}
                    </button>
                </div>
                <div class="comments-section" id="comments-${post.id}" style="display: none;">
                    <div id="comments-list-${post.id}" class="comments-list">
                        ${renderComments(post.comments)}
                    </div>
                    <div class="comment-input-group">
                        <input type="text" id="comment-input-${post.id}" placeholder="Add a comment..." class="comment-input">
                        <button onclick="addComment('${post.id}')" class="btn-small">Post</button>
                    </div>
                </div>
            </div>
        `;

        feedEl.innerHTML += postHTML;
    });
}

// ===== RENDER COMMENTS =====
function renderComments(comments) {
    if (!comments || comments.length === 0) {
        return '<p style="text-align: center; color: #999;">No comments yet</p>';
    }

    return comments.map(comment => {
        const user = db.getUserById(comment.userId);
        return `
            <div class="comment">
                <strong>${user?.name || 'Unknown'}:</strong> ${comment.text}
            </div>
        `;
    }).join('');
}

// ===== TOGGLE LIKE =====
function toggleLike(postId) {
    db.likePost(postId, db.currentUser.id);
    loadPosts();
}

// ===== TOGGLE COMMENTS =====
function toggleComments(postId) {
    const commentsEl = document.getElementById(`comments-${postId}`);
    if (commentsEl) {
        commentsEl.style.display = commentsEl.style.display === 'none' ? 'block' : 'none';
    }
}

// ===== ADD COMMENT =====
function addComment(postId) {
    const inputEl = document.getElementById(`comment-input-${postId}`);
    if (!inputEl.value.trim()) {
        showError('Please write a comment');
        return;
    }

    db.addComment(postId, db.currentUser.id, inputEl.value);
    inputEl.value = '';
    loadPosts();
}

// ===== LOAD FRIENDS UI =====
function loadFriendsUI() {
    const friendsListEl = document.getElementById('friendsList');
    if (!friendsListEl) return;

    const friends = db.getFriends(db.currentUser.id);
    const suggestions = db.getUsers().filter(u => 
        u.id !== db.currentUser.id && 
        !db.currentUser.friends.includes(u.id)
    ).slice(0, 5);

    let html = '<h3>👥 Friends (' + friends.length + ')</h3>';
    html += '<div class="friends-grid">';

    friends.forEach(friend => {
        html += `
            <div class="friend-card">
                <img src="${friend.profilePic}" alt="${friend.name}">
                <h4>${friend.name}</h4>
                <small>${friend.bio}</small>
            </div>
        `;
    });

    html += '</div>';

    if (suggestions.length > 0) {
        html += '<h3>➕ Suggested Friends</h3>';
        html += '<div class="friends-grid">';
        suggestions.forEach(user => {
            html += `
                <div class="friend-card">
                    <img src="${user.profilePic}" alt="${user.name}">
                    <h4>${user.name}</h4>
                    <small>${user.bio}</small>
                    <button onclick="sendFriendRequest('${user.id}')" class="btn-small">Add Friend</button>
                </div>
            `;
        });
        html += '</div>';
    }

    friendsListEl.innerHTML = html;
}

// ===== SEND FRIEND REQUEST =====
function sendFriendRequest(userId) {
    db.sendFriendRequest(db.currentUser.id, userId);
    showNotification('✅ Friend request sent!', 'success');
    loadFriendsUI();
}

// ===== LOAD NOTIFICATIONS =====
function loadNotifications() {
    const notificationsEl = document.getElementById('notifications');
    if (!notificationsEl) return;

    const friendRequests = db.getFriendRequests(db.currentUser.id);
    
    if (friendRequests.length === 0) {
        notificationsEl.innerHTML = '<p>No new notifications</p>';
        return;
    }

    let html = '';
    friendRequests.forEach(req => {
        const sender = db.getUserById(req.from);
        html += `
            <div class="notification-item">
                <strong>${sender?.name}</strong> sent you a friend request
                <div class="notification-actions">
                    <button onclick="acceptFriendRequest('${req.id}')" class="btn-small" style="background: green;">Accept</button>
                    <button onclick="rejectFriendRequest('${req.id}')" class="btn-small" style="background: red;">Reject</button>
                </div>
            </div>
        `;
    });

    notificationsEl.innerHTML = html;
}

// ===== ACCEPT FRIEND REQUEST =====
function acceptFriendRequest(requestId) {
    db.acceptFriendRequest(requestId);
    showNotification('✅ Friend added!', 'success');
    loadNotifications();
    loadFriendsUI();
}

// ===== REJECT FRIEND REQUEST =====
function rejectFriendRequest(requestId) {
    const requests = JSON.parse(localStorage.getItem('friendRequestsDB')) || [];
    const idx = requests.findIndex(r => r.id === requestId);
    if (idx !== -1) {
        requests.splice(idx, 1);
        localStorage.setItem('friendRequestsDB', JSON.stringify(requests));
    }
    showNotification('Rejected', 'info');
    loadNotifications();
}

// ===== FORMAT DATE =====
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
}

// ===== ERROR MESSAGE =====
function showError(message) {
    alert('❌ ' + message);
}

// ===== SUCCESS NOTIFICATION =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        font-weight: bold;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

// Extra function for friend retrieval (if needed elsewhere)
function getUsers() {
    return db.getUsers();
}
