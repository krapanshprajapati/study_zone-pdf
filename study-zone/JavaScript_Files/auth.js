// User Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('studyzone_users')) || [];
        this.init();
    }

    init() {
        this.checkLoginStatus();
        this.setupEventListeners();
    }

    // रजिस्ट्रेशन फंक्शन
    register(userData) {
        return new Promise((resolve, reject) => {
            // वैलिडेशन
            if (!userData.name || !userData.email || !userData.password) {
                reject('सभी फील्ड्स भरें');
                return;
            }

            if (this.users.find(u => u.email === userData.email)) {
                reject('यह ईमेल पहले से रजिस्टर्ड है');
                return;
            }

            if (userData.password.length < 6) {
                reject('पासवर्ड कम से कम 6 कैरेक्टर का होना चाहिए');
                return;
            }

            // नया यूजर बनाएं
            const newUser = {
                id: 'user_' + Date.now(),
                ...userData,
                createdAt: new Date().toISOString(),
                isActive: true,
                orders: [],
                downloads: [],
                profile: {
                    phone: '',
                    city: '',
                    education: '',
                    examTarget: ''
                }
            };

            this.users.push(newUser);
            localStorage.setItem('studyzone_users', JSON.stringify(this.users));
            
            this.currentUser = newUser;
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            resolve(newUser);
        });
    }

    // लॉगिन फंक्शन
    login(email, password) {
        return new Promise((resolve, reject) => {
            const user = this.users.find(u => 
                u.email === email && u.password === password && u.isActive
            );

            if (user) {
                this.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                resolve(user);
            } else {
                reject('ईमेल या पासवर्ड गलत है');
            }
        });
    }

    // लॉगआउट फंक्शन
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    // लॉगिन स्टेटस चेक करें
    checkLoginStatus() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    // प्रोफाइल अपडेट
    updateProfile(profileData) {
        return new Promise((resolve, reject) => {
            if (!this.currentUser) {
                reject('पहले लॉगिन करें');
                return;
            }

            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                this.users[userIndex].profile = { ...this.users[userIndex].profile, ...profileData };
                this.currentUser = this.users[userIndex];
                
                localStorage.setItem('studyzone_users', JSON.stringify(this.users));
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                
                resolve(this.currentUser);
            } else {
                reject('यूजर नहीं मिला');
            }
        });
    }

    // ऑर्डर हिस्ट्री एड करें
    addOrder(orderData) {
        if (!this.currentUser) return;

        const order = {
            id: 'order_' + Date.now(),
            ...orderData,
            date: new Date().toISOString(),
            status: 'success'
        };

        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            if (!this.users[userIndex].orders) {
                this.users[userIndex].orders = [];
            }
            this.users[userIndex].orders.unshift(order);
            
            if (!this.currentUser.orders) {
                this.currentUser.orders = [];
            }
            this.currentUser.orders.unshift(order);
            
            localStorage.setItem('studyzone_users', JSON.stringify(this.users));
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    // डाउनलोड हिस्ट्री एड करें
    addDownload(downloadData) {
        if (!this.currentUser) return;

        const download = {
            id: 'download_' + Date.now(),
            ...downloadData,
            date: new Date().toISOString()
        };

        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            if (!this.users[userIndex].downloads) {
                this.users[userIndex].downloads = [];
            }
            this.users[userIndex].downloads.unshift(download);
            
            if (!this.currentUser.downloads) {
                this.currentUser.downloads = [];
            }
            this.currentUser.downloads.unshift(download);
            
            localStorage.setItem('studyzone_users', JSON.stringify(this.users));
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    // इवेंट लिसनर्स सेटअप
    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.updateUI();
        });
    }

    // UI अपडेट करें
    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');

        if (this.currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (userMenu) userMenu.style.display = 'flex';
            if (userName) userName.textContent = this.currentUser.name;
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
        }
    }
}

// ग्लोबल ऑथ इंस्टेंस
const auth = new AuthSystem();