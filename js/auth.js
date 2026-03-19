// ===== AUTHENTICATION SYSTEM =====

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in on login/register pages
    if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
        if (db.currentUser) {
            window.location.href = '../index.html';
            return;
        }
    }

    // ===== LOGIN FORM =====
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    // ===== REGISTER FORM =====
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }

    // ===== LOGOUT BUTTON =====
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Update user info in navbar
    updateUserInfo();
});

// ===== LOGIN HANDLER =====
function handleLogin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    const result = db.login(email, password);
    
    if (result.success) {
        showNotification('✅ Logged in successfully!', 'success');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    } else {
        showError(result.message);
    }
}

// ===== REGISTER HANDLER =====
function handleRegister() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const bio = document.getElementById('bio').value.trim();

    if (!name || !email || !password || !confirmPassword) {
        showError('Please fill in all required fields');
        return;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    const result = db.register(name, email, password, bio);

    if (result.success) {
        showNotification('✅ Account created successfully! Logging in...', 'success');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
    } else {
        showError(result.message);
    }
}

// ===== LOGOUT HANDLER =====
function handleLogout() {
    db.logout();
    showNotification('👋 Logged out successfully', 'info');
    setTimeout(() => {
        const path = window.location.pathname;
        if (path.includes('/pages/')) {
            window.location.href = 'login.html';
        } else {
            window.location.href = 'pages/login.html';
        }
    }, 800);
}

// ===== UPDATE USER INFO IN NAVBAR =====
function updateUserInfo() {
    const userNameEl = document.getElementById('userName');
    const userProfilePicEl = document.getElementById('userProfilePic');

    if (db.currentUser) {
        if (userNameEl) userNameEl.textContent = db.currentUser.name;
        if (userProfilePicEl) userProfilePicEl.src = db.currentUser.profilePic;
    }
}

// ===== ERROR MESSAGE =====
function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    if (errorEl) {
        errorEl.textContent = '❌ ' + message;
        errorEl.style.display = 'block';
        setTimeout(() => {
            errorEl.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

// ===== SUCCESS NOTIFICATION =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
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
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ===== PAGE PROTECTION =====
function checkAuthentication() {
    if (!db.currentUser) {
        const path = window.location.pathname;
        if (path.includes('index.html') || path.endsWith('/')) {
            if (path.includes('/pages/')) {
                window.location.href = 'login.html';
            } else {
                window.location.href = 'pages/login.html';
            }
        }
    }
}

// Check auth on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAuthentication);
} else {
    checkAuthentication();
}
