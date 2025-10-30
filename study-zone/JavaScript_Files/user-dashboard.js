// User Dashboard Functionality - Complete Version
class UserDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.loadUserData();
        this.setupEventListeners();
        this.hideLoadingScreen();
    }

    // ऑथेंटिकेशन चेक करें
    checkAuthentication() {
        if (!auth.currentUser) {
            window.location.href = 'login.html?redirect=user-dashboard.html';
            return;
        }
    }

    // यूजर डेटा लोड करें
    loadUserData() {
        this.updateStats();
        this.loadProfile();
        this.loadOrders();
        this.loadDownloads();
        this.loadProducts();
        this.loadRecentActivity();
        this.updateLearningProgress();
    }

    // स्टैट्स अपडेट करें
    updateStats() {
        const user = auth.currentUser;
        if (!user) return;

        const totalOrders = user.orders?.length || 0;
        const totalDownloads = user.downloads?.length || 0;
        const activeProducts = user.orders?.filter(order => order.status === 'success').length || 0;

        // मेंबर शिप ड्यूरेशन
        const joinDate = new Date(user.createdAt);
        const today = new Date();
        const daysSinceJoin = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24));

        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('totalDownloads').textContent = totalDownloads;
        document.getElementById('activeProducts').textContent = activeProducts;
        document.getElementById('memberSince').textContent = daysSinceJoin;
    }

    // प्रोफाइल लोड करें
    loadProfile() {
        const user = auth.currentUser;
        if (!user) return;

        document.getElementById('profileName').value = user.name;
        document.getElementById('profileEmail').value = user.email;
        document.getElementById('profilePhone').value = user.profile?.phone || '';
        document.getElementById('profileCity').value = user.profile?.city || '';
        document.getElementById('profileEducation').value = user.profile?.education || '';
        document.getElementById('profileExam').value = user.profile?.examTarget || '';
    }

    // ऑर्डर लोड करें
    loadOrders() {
        const user = auth.currentUser;
        const ordersList = document.getElementById('ordersList');
        
        if (!user || !user.orders || user.orders.length === 0) {
            ordersList.innerHTML = this.getEmptyStateHTML(
                'fas fa-shopping-bag',
                'अभी तक कोई ऑर्डर नहीं',
                'अपना पहला ऑर्डर करें और यहाँ देखें',
                'प्रोडक्ट्स देखें',
                () => window.location.href = 'index.html'
            );
            return;
        }

        // Sort orders by date (newest first)
        const sortedOrders = user.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        ordersList.innerHTML = sortedOrders.map(order => `
            <div class="order-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 5px 0; color: var(--dark);">${order.product}</h4>
                        <p style="margin: 0; color: var(--text-light); font-size: 0.9rem;">
                            ऑर्डर ID: ${order.id} | ${new Date(order.date).toLocaleDateString('hi-IN')}
                        </p>
                        ${order.paymentId ? `<p style="margin: 5px 0 0 0; color: var(--text-light); font-size: 0.8rem;">
                            Payment ID: ${order.paymentId}
                        </p>` : ''}
                    </div>
                    <div style="text-align: right;">
                        <span style="background: ${this.getStatusColor(order.status)}; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.8rem; display: inline-block; margin-bottom: 5px;">
                            ${this.getStatusText(order.status)}
                        </span>
                        <div style="font-weight: bold; color: var(--success);">₹${order.amount}</div>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                    <button class="offer-btn" onclick="viewOrderDetails('${order.id}')" style="padding: 8px 15px; font-size: 0.8rem;">
                        <i class="fas fa-eye"></i> डिटेल्स
                    </button>
                    <button class="offer-btn" onclick="downloadInvoice('${order.id}')" style="padding: 8px 15px; font-size: 0.8rem;">
                        <i class="fas fa-receipt"></i> इनवॉइस
                    </button>
                    ${order.status === 'success' ? `
                    <button class="offer-btn" onclick="accessProduct('${order.id}')" style="padding: 8px 15px; font-size: 0.8rem; background: var(--success);">
                        <i class="fas fa-external-link-alt"></i> एक्सेस करें
                    </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // डाउनलोड हिस्ट्री लोड करें
    loadDownloads() {
        const user = auth.currentUser;
        const downloadsList = document.getElementById('downloadsList');
        
        if (!user || !user.downloads || user.downloads.length === 0) {
            downloadsList.innerHTML = this.getEmptyStateHTML(
                'fas fa-download',
                'अभी तक कोई डाउनलोड नहीं',
                'प्रोडक्ट्स खरीदें और डाउनलोड करें',
                'प्रोडक्ट्स देखें',
                () => window.location.href = 'index.html'
            );
            return;
        }

        // Sort downloads by date (newest first)
        const sortedDownloads = user.downloads.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        downloadsList.innerHTML = sortedDownloads.map(download => `
            <div class="download-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 5px 0; color: var(--dark);">${download.chapter}</h4>
                        <p style="margin: 0; color: var(--text-light); font-size: 0.9rem;">
                            ${download.product} | ${new Date(download.date).toLocaleDateString('hi-IN')}
                        </p>
                        ${download.pages ? `<p style="margin: 5px 0 0 0; color: var(--text-light); font-size: 0.8rem;">
                            ${download.pages} pages | ${download.file}
                        </p>` : ''}
                    </div>
                    <div style="text-align: right;">
                        <span style="color: var(--success); font-size: 0.8rem;">
                            <i class="fas fa-check-circle"></i> सफल
                        </span>
                        <div style="margin-top: 5px;">
                            <button class="offer-btn" onclick="redownloadFile('${download.file}')" style="padding: 5px 10px; font-size: 0.7rem;">
                                <i class="fas fa-redo"></i> फिर से डाउनलोड
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // यूजर प्रोडक्ट्स लोड करें
    loadProducts() {
        const user = auth.currentUser;
        const userProducts = document.getElementById('userProducts');
        
        if (!user || !user.orders || user.orders.length === 0) {
            userProducts.innerHTML = this.getEmptyStateHTML(
                'fas fa-book',
                'कोई प्रोडक्ट्स नहीं',
                'अपना पहला प्रोडक्ट खरीदें',
                'प्रोडक्ट्स देखें',
                () => window.location.href = 'index.html'
            );
            return;
        }

        const successfulOrders = user.orders.filter(order => order.status === 'success');
        userProducts.innerHTML = successfulOrders.map(order => `
            <div class="folder">
                <div class="folder-icon">
                    <i class="fas fa-book"></i>
                </div>
                <h3>${order.product}</h3>
                <p>खरीदा गया: ${new Date(order.date).toLocaleDateString('hi-IN')}</p>
                <div class="price">₹${order.amount}</div>
                <button onclick="accessProduct('${order.id}')">
                    <i class="fas fa-external-link-alt"></i> एक्सेस करें
                </button>
            </div>
        `).join('');
    }

    // रीसेंट एक्टिविटी लोड करें
    loadRecentActivity() {
        const user = auth.currentUser;
        const recentActivity = document.getElementById('recentActivity');
        
        if (!user) return;

        const activities = [];
        
        // Add order activities
        if (user.orders) {
            user.orders.slice(0, 3).forEach(order => {
                activities.push({
                    type: 'order',
                    text: `You purchased ${order.product}`,
                    date: order.date,
                    icon: 'fas fa-shopping-cart',
                    color: 'var(--success)'
                });
            });
        }
        
        // Add download activities
        if (user.downloads) {
            user.downloads.slice(0, 2).forEach(download => {
                activities.push({
                    type: 'download',
                    text: `You downloaded ${download.chapter}`,
                    date: download.date,
                    icon: 'fas fa-download',
                    color: 'var(--primary)'
                });
            });
        }
        
        // Sort by date and take latest 5
        const sortedActivities = activities
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        if (sortedActivities.length === 0) {
            recentActivity.innerHTML = `
                <div style="text-align: center; padding: 20px; color: var(--text-light);">
                    <i class="fas fa-history" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <p>No recent activity</p>
                </div>
            `;
            return;
        }
        
        recentActivity.innerHTML = sortedActivities.map(activity => `
            <div style="display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid #eee;">
                <div style="width: 30px; height: 30px; border-radius: 50%; background: ${activity.color}; display: flex; align-items: center; justify-content: center;">
                    <i class="${activity.icon}" style="color: white; font-size: 0.8rem;"></i>
                </div>
                <div style="flex: 1;">
                    <p style="margin: 0; font-size: 0.9rem;">${activity.text}</p>
                    <p style="margin: 0; color: var(--text-light); font-size: 0.7rem;">
                        ${new Date(activity.date).toLocaleDateString('hi-IN')}
                    </p>
                </div>
            </div>
        `).join('');
    }

    // लर्निंग प्रोग्रेस अपडेट करें
    updateLearningProgress() {
        const user = auth.currentUser;
        if (!user || !user.downloads) return;

        const totalDownloads = user.downloads.length;
        // Simulate progress based on downloads
        const progressPercent = Math.min((totalDownloads / 10) * 100, 100);
        
        const progressFill = document.getElementById('learningProgress');
        const progressPercentText = document.getElementById('progressPercent');
        const progressChapters = document.getElementById('progressChapters');
        
        if (progressFill) progressFill.style.width = `${progressPercent}%`;
        if (progressPercentText) progressPercentText.textContent = `${Math.round(progressPercent)}% Complete`;
        if (progressChapters) progressChapters.textContent = `${totalDownloads} Chapters Downloaded`;
    }

    // इवेंट लिसनर्स सेटअप
    setupEventListeners() {
        // प्रोफाइल फॉर्म सबमिशन
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProfile();
            });
        }

        // टैब क्लिक इवेंट
        document.querySelectorAll('.dashboard-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.handleTabClick(e);
            });
        });
    }

    // टैब क्लिक हैंडल करें
    handleTabClick(event) {
        const tabName = event.currentTarget.getAttribute('onclick').match(/'([^']+)'/)[1];
        showTab(tabName);
    }

    // प्रोफाइल अपडेट
    async updateProfile() {
        const profileData = {
            name: document.getElementById('profileName').value,
            phone: document.getElementById('profilePhone').value,
            city: document.getElementById('profileCity').value,
            education: document.getElementById('profileEducation').value,
            examTarget: document.getElementById('profileExam').value
        };

        try {
            await auth.updateProfile(profileData);
            this.showNotification('प्रोफाइल सफलतापूर्वक अपडेट हो गई', 'success');
        } catch (error) {
            this.showNotification(error, 'error');
        }
    }

    // उटिलिटी फंक्शन्स
    getEmptyStateHTML(icon, title, description, buttonText, buttonClick) {
        return `
            <div style="text-align: center; padding: 40px; color: var(--text-light);">
                <i class="${icon}" style="font-size: 3rem; margin-bottom: 15px; color: var(--primary);"></i>
                <h3 style="color: var(--dark); margin-bottom: 10px;">${title}</h3>
                <p style="margin-bottom: 20px;">${description}</p>
                <button onclick="${buttonClick}" class="offer-btn">
                    <i class="fas fa-arrow-right"></i> ${buttonText}
                </button>
            </div>
        `;
    }

    getStatusText(status) {
        const statusMap = {
            'success': 'सफल',
            'pending': 'लंबित',
            'failed': 'असफल'
        };
        return statusMap[status] || status;
    }

    getStatusColor(status) {
        const colorMap = {
            'success': 'var(--success)',
            'pending': 'var(--secondary)',
            'failed': '#dc3545'
        };
        return colorMap[status] || 'var(--text-light)';
    }

    // नोटिफिकेशन शो करें
    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.user-notification').forEach(el => el.remove());
        
        const notification = document.createElement('div');
        notification.className = `user-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
            <span>${message}</span>
        `;

        // Add styles if not exists
        if (!document.querySelector('#userNotificationStyles')) {
            const style = document.createElement('style');
            style.id = 'userNotificationStyles';
            style.textContent = `
                .user-notification {
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
                    max-width: 300px;
                }
                .user-notification.success { background: var(--success); }
                .user-notification.error { background: var(--secondary); }
                .user-notification.info { background: var(--primary); }
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
function showTab(tabName) {
    // सभी टैब्स हाइड करें
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // सेलेक्टेड टैब शो करें
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

function goBack() {
    window.location.href = 'index.html';
}

function viewOrderDetails(orderId) {
    const user = auth.currentUser;
    const order = user.orders.find(o => o.id === orderId);
    
    if (order) {
        const modalHtml = `
            <div class="modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;">
                <div class="modal-content" style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h3 style="margin: 0; color: var(--dark);">ऑर्डर डिटेल्स</h3>
                        <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-light);">×</button>
                    </div>
                    <div style="line-height: 1.8;">
                        <p><strong>प्रोडक्ट:</strong> ${order.product}</p>
                        <p><strong>ऑर्डर ID:</strong> ${order.id}</p>
                        <p><strong>रकम:</strong> ₹${order.amount}</p>
                        <p><strong>स्टेटस:</strong> <span style="color: ${getStatusColor(order.status)}">${getStatusText(order.status)}</span></p>
                        <p><strong>तारीख:</strong> ${new Date(order.date).toLocaleDateString('hi-IN')}</p>
                        ${order.paymentId ? `<p><strong>पेमेंट ID:</strong> ${order.paymentId}</p>` : ''}
                        ${order.razorpayOrderId ? `<p><strong>Razorpay Order ID:</strong> ${order.razorpayOrderId}</p>` : ''}
                    </div>
                    <div style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="offer-btn" onclick="closeModal()">बंद करें</button>
                        ${order.status === 'success' ? `
                        <button class="offer-btn" onclick="accessProduct('${order.id}'); closeModal();" style="background: var(--success);">
                            <i class="fas fa-external-link-alt"></i> प्रोडक्ट एक्सेस करें
                        </button>
                        ` : ''}
                        <button class="offer-btn" onclick="downloadInvoice('${order.id}'); closeModal();">
                            <i class="fas fa-receipt"></i> इनवॉइस डाउनलोड करें
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHtml;
        document.body.appendChild(modalDiv);
    }
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function accessProduct(orderId) {
    const user = auth.currentUser;
    const order = user.orders.find(o => o.id === orderId);
    
    if (order && order.status === 'success') {
        window.location.href = `download.html?order=${orderId}&product=${encodeURIComponent(order.product)}`;
    } else {
        alert('This order is not completed yet or product is not accessible.');
    }
}

function downloadInvoice(orderId) {
    const user = auth.currentUser;
    const order = user.orders.find(o => o.id === orderId);
    
    if (order) {
        // Create simple invoice HTML
        const invoiceHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice - ${order.id}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .details { margin: 20px 0; }
                    .footer { margin-top: 30px; text-align: center; color: #666; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Study Zone</h1>
                    <h2>Invoice</h2>
                </div>
                <div class="details">
                    <p><strong>Invoice Number:</strong> ${order.id}</p>
                    <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                    <p><strong>Product:</strong> ${order.product}</p>
                    <p><strong>Amount:</strong> ₹${order.amount}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                    ${order.paymentId ? `<p><strong>Payment ID:</strong> ${order.paymentId}</p>` : ''}
                </div>
                <div class="footer">
                    <p>Thank you for your purchase!</p>
                    <p>Study Zone - Competitive Exam Preparation</p>
                </div>
            </body>
            </html>
        `;
        
        // Open invoice in new window for printing
        const win = window.open('', '_blank');
        win.document.write(invoiceHtml);
        win.document.close();
        win.print();
    }
}

function redownloadFile(filename) {
    // Simulate file download
    alert(`Downloading: ${filename}\n\nIn a real application, this would download the actual file.`);
}

function changePassword() {
    const newPassword = prompt('Enter new password:');
    if (newPassword && newPassword.length >= 6) {
        // In a real app, this would update the password securely
        alert('Password change feature will be available soon!');
    } else if (newPassword) {
        alert('Password must be at least 6 characters long.');
    }
}

function exportData() {
    const user = auth.currentUser;
    const dataStr = JSON.stringify(user, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `studyzone-data-${user.id}.json`;
    link.click();
    
    // Show notification
    const dashboard = new UserDashboard();
    dashboard.showNotification('Data exported successfully!', 'success');
}

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        if (confirm('All your data will be permanently lost. Type DELETE to confirm:')) {
            // Remove user from localStorage
            const users = JSON.parse(localStorage.getItem('studyzone_users')) || [];
            const updatedUsers = users.filter(u => u.id !== auth.currentUser.id);
            localStorage.setItem('studyzone_users', JSON.stringify(updatedUsers));
            localStorage.removeItem('currentUser');
            
            alert('Account deleted successfully');
            window.location.href = 'index.html';
        }
    }
}

// हेल्पर फंक्शन्स
function getStatusText(status) {
    const statusMap = {
        'success': 'सफल',
        'pending': 'लंबित',
        'failed': 'असफल'
    };
    return statusMap[status] || status;
}

function getStatusColor(status) {
    const colorMap = {
        'success': '#28a745',
        'pending': '#ffc107',
        'failed': '#dc3545'
    };
    return colorMap[status] || '#6c757d';
}

// डैशबोर्ड इनिशियलाइज करें
document.addEventListener('DOMContentLoaded', () => {
    new UserDashboard();
});