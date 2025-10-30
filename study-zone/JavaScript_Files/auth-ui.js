// Authentication UI Management
class AuthUI {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkRedirect();
        this.hideLoadingScreen();
    }

    setupEventListeners() {
        // लॉगिन फॉर्म
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // रजिस्ट्रेशन फॉर्म
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
    }

    // लॉगिन हैंडल करें
    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            await auth.login(email, password);
            this.showNotification('सफलतापूर्वक लॉगिन हो गए!', 'success');
            
            // रीडायरेक्ट
            setTimeout(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const redirectUrl = urlParams.get('redirect') || 'user-dashboard.html';
                window.location.href = redirectUrl;
            }, 1000);
            
        } catch (error) {
            this.showNotification(error, 'error');
        }
    }

    // रजिस्ट्रेशन हैंडल करें
    async handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        if (password !== confirmPassword) {
            this.showNotification('पासवर्ड मेल नहीं खा रहे', 'error');
            return;
        }

        try {
            await auth.register({ name, email, password });
            this.showNotification('अकाउंट सफलतापूर्वक बन गया!', 'success');
            
            // रीडायरेक्ट
            setTimeout(() => {
                window.location.href = 'user-dashboard.html';
            }, 1000);
            
        } catch (error) {
            this.showNotification(error, 'error');
        }
    }

    // ऑथ फॉर्म शो करें
    showAuthForm(formType) {
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        document.getElementById(formType + 'Form').classList.add('active');
        event.currentTarget.classList.add('active');
    }

    // नोटिफिकेशन शो करें
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
            <span>${message}</span>
        `;

        // स्टाइल्स एड करें (अगर पहले से नहीं हैं)
        if (!document.querySelector('#notificationStyles')) {
            const style = document.createElement('style');
            style.id = 'notificationStyles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 10px;
                    color: white;
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .notification.success { background: var(--success); }
                .notification.error { background: var(--secondary); }
                .notification.info { background: var(--primary); }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    // रीडायरेक्ट चेक करें
    checkRedirect() {
        if (auth.currentUser && window.location.pathname.includes('login.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const redirectUrl = urlParams.get('redirect') || 'user-dashboard.html';
            window.location.href = redirectUrl;
        }
    }

    // लोडिंग स्क्रीन हाइड करें
    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        }, 1000);
    }
}

// ग्लोबल फंक्शन्स
function showAuthForm(formType) {
    new AuthUI().showAuthForm(formType);
}

// ऑथ UI इनिशियलाइज करें
document.addEventListener('DOMContentLoaded', () => {
    new AuthUI();
});