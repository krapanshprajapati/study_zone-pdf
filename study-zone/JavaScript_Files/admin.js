// Admin JavaScript for Study Zone - Complete Version

// Sample data (in real application, this would come from backend)
let orders = JSON.parse(localStorage.getItem('adminOrders')) || [];
let products = JSON.parse(localStorage.getItem('adminProducts')) || [];
let customers = JSON.parse(localStorage.getItem('adminCustomers')) || [];

// Razorpay Configuration
const RAZORPAY_CONFIG = {
    key_id: 'rzp_live_RZgCHTswTGwtAU',
    key_secret: 'tCqTPGDadt4K00Dr3N9JGtC2'
};

// Initialize admin panel
function initAdmin() {
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }, 1500);

    // Load sample data if empty
    if (orders.length === 0) {
        loadSampleData();
    }

    // Update stats
    updateStats();
    
    // Load recent orders
    loadRecentOrders();
    
    // Load all orders
    loadAllOrders();
    
    // Load products
    loadProducts();
    
    // Load customers
    loadCustomers();
    
    // Initialize charts
    initializeCharts();
    
    // Set current year in footer
    const footer = document.querySelector('.footer-bottom p');
    if (footer) {
        footer.innerHTML = `© ${new Date().getFullYear()} Study Zone - Admin Panel | सभी अधिकार सुरक्षित`;
    }
}

// Load sample data for demonstration
function loadSampleData() {
    // Sample orders
    orders = [
        {
            id: 'SZ001',
            product: 'SSC CGL Complete Pack',
            customer: 'Rahul Sharma',
            email: 'rahul@example.com',
            phone: '9876543210',
            city: 'Indore',
            amount: 399,
            status: 'success',
            date: '2024-01-15',
            paymentId: 'pay_001',
            razorpayOrderId: 'order_' + Date.now()
        },
        {
            id: 'SZ002',
            product: 'RRB NTPC Complete',
            customer: 'Priya Singh',
            email: 'priya@example.com',
            phone: '9876543211',
            city: 'Bhopal',
            amount: 349,
            status: 'success',
            date: '2024-01-14',
            paymentId: 'pay_002',
            razorpayOrderId: 'order_' + Date.now()
        },
        {
            id: 'SZ003',
            product: 'MP Police Constable Complete',
            customer: 'Amit Verma',
            email: 'amit@example.com',
            phone: '9876543212',
            city: 'Jabalpur',
            amount: 299,
            status: 'pending',
            date: '2024-01-13',
            paymentId: 'pay_003',
            razorpayOrderId: 'order_' + Date.now()
        },
        {
            id: 'SZ004',
            product: 'IBPS PO Complete Pack',
            customer: 'Neha Gupta',
            email: 'neha@example.com',
            phone: '9876543213',
            city: 'Gwalior',
            amount: 399,
            status: 'success',
            date: '2024-01-12',
            paymentId: 'pay_004',
            razorpayOrderId: 'order_' + Date.now()
        },
        {
            id: 'SZ005',
            product: 'SSC CHSL Complete',
            customer: 'Rajesh Kumar',
            email: 'rajesh@example.com',
            phone: '9876543214',
            city: 'Ujjain',
            amount: 299,
            status: 'failed',
            date: '2024-01-11',
            paymentId: 'pay_005',
            razorpayOrderId: 'order_' + Date.now()
        }
    ];

    // Sample products
    products = [
        {
            id: 1,
            name: 'SSC CGL Complete Pack',
            price: 399,
            originalPrice: 599,
            category: 'ssc',
            description: 'Complete preparation for SSC CGL Tier 1 & 2 - Math, Reasoning, English, GK',
            tags: 'ssc, cgl, tier1, tier2, complete, math, reasoning, english, gk',
            isActive: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            name: 'RRB NTPC Complete',
            price: 349,
            originalPrice: 549,
            category: 'railway',
            description: 'CBT 1 & 2 preparation with practice questions and shortcuts',
            tags: 'rrb, ntpc, cbt1, cbt2, railway, math, reasoning',
            isActive: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            name: 'MP Police Constable Complete',
            price: 299,
            originalPrice: 499,
            category: 'mp-exams',
            description: 'General knowledge, reasoning, math for MP Police constable exam',
            tags: 'mp, police, constable, mpesb, vyapam, general, knowledge, reasoning',
            isActive: true,
            createdAt: new Date().toISOString()
        }
    ];

    // Sample customers
    customers = [
        {
            id: 'CUST001',
            name: 'Rahul Sharma',
            email: 'rahul@example.com',
            phone: '9876543210',
            city: 'Indore',
            totalOrders: 2,
            totalSpent: 748,
            createdAt: '2024-01-01'
        },
        {
            id: 'CUST002',
            name: 'Priya Singh',
            email: 'priya@example.com',
            phone: '9876543211',
            city: 'Bhopal',
            totalOrders: 1,
            totalSpent: 349,
            createdAt: '2024-01-02'
        }
    ];

    // Save to localStorage
    localStorage.setItem('adminOrders', JSON.stringify(orders));
    localStorage.setItem('adminProducts', JSON.stringify(products));
    localStorage.setItem('adminCustomers', JSON.stringify(customers));
}

// Update statistics
function updateStats() {
    const totalRevenue = orders
        .filter(order => order.status === 'success')
        .reduce((sum, order) => sum + order.amount, 0);
    
    const totalOrders = orders.length;
    const successOrders = orders.filter(order => order.status === 'success').length;
    const successRate = totalOrders > 0 ? Math.round((successOrders / totalOrders) * 100) : 0;

    document.getElementById('totalRevenue').textContent = `₹${totalRevenue}`;
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('successRate').textContent = `${successRate}%`;
}

// Show tab content
function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.admin-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Update active nav
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => link.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    // Refresh data if needed
    if (tabName === 'analytics') {
        initializeCharts();
    }
}

// Load recent orders
function loadRecentOrders() {
    const recentOrdersContainer = document.getElementById('recentOrders');
    const recentOrders = orders.slice(0, 5); // Get last 5 orders
    
    recentOrdersContainer.innerHTML = '';
    
    recentOrders.forEach(order => {
        const statusClass = `status-${order.status}`;
        const statusText = getStatusText(order.status);
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <div>${order.id}</div>
            <div>${order.product}</div>
            <div>${order.customer}</div>
            <div>₹${order.amount}</div>
            <div><span class="status-badge ${statusClass}">${statusText}</span></div>
            <div>${formatDate(order.date)}</div>
        `;
        recentOrdersContainer.appendChild(row);
    });
}

// Load all orders
function loadAllOrders() {
    const allOrdersContainer = document.getElementById('allOrders');
    
    allOrdersContainer.innerHTML = '';
    
    orders.forEach(order => {
        const statusClass = `status-${order.status}`;
        const statusText = getStatusText(order.status);
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <div>${order.id}</div>
            <div>${order.product}</div>
            <div>
                <strong>${order.customer}</strong><br>
                <small>${order.email}</small><br>
                <small>${order.phone}</small>
            </div>
            <div>₹${order.amount}</div>
            <div><span class="status-badge ${statusClass}">${statusText}</span></div>
            <div>
                <button class="btn btn-primary" onclick="viewOrder('${order.id}')">View</button>
                <button class="btn btn-success" onclick="updateOrderStatus('${order.id}', 'success')">Approve</button>
                <button class="btn btn-danger" onclick="updateOrderStatus('${order.id}', 'failed')">Reject</button>
            </div>
        `;
        allOrdersContainer.appendChild(row);
    });
}

// Filter orders by status
function filterOrders(status) {
    const allOrdersContainer = document.getElementById('allOrders');
    let filteredOrders = orders;
    
    if (status !== 'all') {
        filteredOrders = orders.filter(order => order.status === status);
    }
    
    allOrdersContainer.innerHTML = '';
    
    filteredOrders.forEach(order => {
        const statusClass = `status-${order.status}`;
        const statusText = getStatusText(order.status);
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <div>${order.id}</div>
            <div>${order.product}</div>
            <div>
                <strong>${order.customer}</strong><br>
                <small>${order.email}</small><br>
                <small>${order.phone}</small>
            </div>
            <div>₹${order.amount}</div>
            <div><span class="status-badge ${statusClass}">${statusText}</span></div>
            <div>
                <button class="btn btn-primary" onclick="viewOrder('${order.id}')">View</button>
                <button class="btn btn-success" onclick="updateOrderStatus('${order.id}', 'success')">Approve</button>
                <button class="btn btn-danger" onclick="updateOrderStatus('${order.id}', 'failed')">Reject</button>
            </div>
        `;
        allOrdersContainer.appendChild(row);
    });
}

// View order details
function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        const modalHtml = `
            <div class="modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;">
                <div class="modal-content" style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
                    <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 20px;">
                        <h3 style="margin: 0;">Order Details</h3>
                        <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
                    </div>
                    <div style="line-height: 1.8;">
                        <p><strong>Order ID:</strong> ${order.id}</p>
                        <p><strong>Product:</strong> ${order.product}</p>
                        <p><strong>Customer:</strong> ${order.customer}</p>
                        <p><strong>Email:</strong> ${order.email}</p>
                        <p><strong>Phone:</strong> ${order.phone}</p>
                        <p><strong>City:</strong> ${order.city}</p>
                        <p><strong>Amount:</strong> ₹${order.amount}</p>
                        <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></p>
                        <p><strong>Date:</strong> ${formatDate(order.date)}</p>
                        <p><strong>Payment ID:</strong> ${order.paymentId || 'N/A'}</p>
                        ${order.razorpayOrderId ? `<p><strong>Razorpay Order ID:</strong> ${order.razorpayOrderId}</p>` : ''}
                    </div>
                    <div style="margin-top: 20px; display: flex; gap: 10px;">
                        <button class="btn btn-primary" onclick="closeModal()">Close</button>
                        ${order.status !== 'success' ? `<button class="btn btn-success" onclick="updateOrderStatus('${order.id}', 'success'); closeModal();">Mark as Success</button>` : ''}
                        ${order.status !== 'failed' ? `<button class="btn btn-danger" onclick="updateOrderStatus('${order.id}', 'failed'); closeModal();">Mark as Failed</button>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHtml;
        document.body.appendChild(modalDiv);
    }
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Update order status
function updateOrderStatus(orderId, status) {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        localStorage.setItem('adminOrders', JSON.stringify(orders));
        loadAllOrders();
        loadRecentOrders();
        updateStats();
        showNotification(`Order ${orderId} status updated to ${getStatusText(status)}`, 'success');
    }
}

// Load products
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-actions">
                <button class="btn btn-primary" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div style="display: flex; justify-content: space-between; margin: 15px 0;">
                <span style="color: var(--success); font-weight: bold;">₹${product.price}</span>
                <span style="text-decoration: line-through; color: var(--text-light);">₹${product.originalPrice}</span>
            </div>
            <div style="background: var(--light); padding: 10px; border-radius: 8px;">
                <strong>Category:</strong> ${getCategoryText(product.category)}<br>
                <strong>Tags:</strong> ${product.tags}<br>
                <strong>Status:</strong> <span style="color: ${product.isActive ? 'var(--success)' : 'var(--secondary)'}">${product.isActive ? 'Active' : 'Inactive'}</span>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Show product form
function showProductForm() {
    document.getElementById('productForm').style.display = 'block';
    // Reset form for new product
    resetProductForm();
    const saveBtn = document.querySelector('#productForm .pay-now-btn');
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Product';
    saveBtn.onclick = function() { saveProduct(); };
}

// Hide product form
function hideProductForm() {
    document.getElementById('productForm').style.display = 'none';
    resetProductForm();
}

// Reset product form
function resetProductForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productOriginalPrice').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productTags').value = '';
    document.getElementById('productCategory').value = 'ssc';
    document.getElementById('productStatus').checked = true;
}

// Save product
function saveProduct() {
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const originalPrice = document.getElementById('productOriginalPrice').value;
    const description = document.getElementById('productDescription').value;
    const tags = document.getElementById('productTags').value;
    const category = document.getElementById('productCategory').value;
    const isActive = document.getElementById('productStatus').checked;
    
    if (!name || !price) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name: name,
        price: parseInt(price),
        originalPrice: parseInt(originalPrice) || parseInt(price) + 100,
        category: category,
        description: description,
        tags: tags,
        isActive: isActive,
        createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    localStorage.setItem('adminProducts', JSON.stringify(products));
    
    loadProducts();
    hideProductForm();
    updateStats();
    
    showNotification('Product saved successfully!', 'success');
}

// Edit product
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productOriginalPrice').value = product.originalPrice;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productTags').value = product.tags;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productStatus').checked = product.isActive;
        
        showProductForm();
        
        // Change save button to update
        const saveBtn = document.querySelector('#productForm .pay-now-btn');
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Update Product';
        saveBtn.onclick = function() { updateProduct(productId); };
    }
}

// Update product
function updateProduct(productId) {
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        products[productIndex].name = document.getElementById('productName').value;
        products[productIndex].price = parseInt(document.getElementById('productPrice').value);
        products[productIndex].originalPrice = parseInt(document.getElementById('productOriginalPrice').value);
        products[productIndex].description = document.getElementById('productDescription').value;
        products[productIndex].tags = document.getElementById('productTags').value;
        products[productIndex].category = document.getElementById('productCategory').value;
        products[productIndex].isActive = document.getElementById('productStatus').checked;
        
        localStorage.setItem('adminProducts', JSON.stringify(products));
        loadProducts();
        hideProductForm();
        
        showNotification('Product updated successfully!', 'success');
    }
}

// Delete product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('adminProducts', JSON.stringify(products));
        loadProducts();
        updateStats();
        showNotification('Product deleted successfully!', 'success');
    }
}

// Load customers
function loadCustomers() {
    const customersList = document.getElementById('customersList');
    
    customersList.innerHTML = '';
    
    customers.forEach(customer => {
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <div>${customer.id}</div>
            <div>${customer.name}</div>
            <div>${customer.email}</div>
            <div>${customer.phone}</div>
            <div>${customer.city}</div>
            <div>${customer.totalOrders}</div>
        `;
        customersList.appendChild(row);
    });
}

// Initialize charts
function initializeCharts() {
    // Revenue chart data
    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Revenue (₹)',
            data: [25000, 32000, 28000, 45000, 38000, 52000],
            backgroundColor: 'rgba(255, 65, 108, 0.2)',
            borderColor: 'rgba(255, 65, 108, 1)',
            borderWidth: 2,
            fill: true
        }]
    };

    // Products chart data
    const productsData = {
        labels: ['SSC CGL', 'RRB NTPC', 'MP Police', 'IBPS PO', 'SSC CHSL'],
        datasets: [{
            data: [45, 30, 15, 25, 20],
            backgroundColor: [
                '#ff416c',
                '#667eea',
                '#764ba2',
                '#f093fb',
                '#4facfe'
            ]
        }]
    };

    // Orders chart data
    const ordersData = {
        labels: ['Successful', 'Pending', 'Failed'],
        datasets: [{
            data: [
                orders.filter(o => o.status === 'success').length,
                orders.filter(o => o.status === 'pending').length,
                orders.filter(o => o.status === 'failed').length
            ],
            backgroundColor: [
                '#28a745',
                '#ffc107',
                '#dc3545'
            ]
        }]
    };

    // Update chart containers with sample data
    document.getElementById('revenueChart').innerHTML = createChartHTML('Line Chart: Revenue Analytics', revenueData);
    document.getElementById('productsChart').innerHTML = createChartHTML('Doughnut Chart: Top Products', productsData);
    document.getElementById('ordersChart').innerHTML = createChartHTML('Pie Chart: Order Status', ordersData);
    document.getElementById('categoryChart').innerHTML = createChartHTML('Bar Chart: Sales by Category', productsData);
    document.getElementById('monthlyChart').innerHTML = createChartHTML('Line Chart: Monthly Revenue', revenueData);
    document.getElementById('downloadsChart').innerHTML = createChartHTML('Bar Chart: Download Statistics', revenueData);
}

// Create chart HTML (simplified for demo)
function createChartHTML(title, data) {
    return `
        <div style="text-align: center; padding: 20px;">
            <h4>${title}</h4>
            <div style="height: 200px; display: flex; align-items: center; justify-content: center; color: var(--text-light);">
                <div>
                    <i class="fas fa-chart-bar" style="font-size: 3rem; margin-bottom: 10px;"></i>
                    <p>Chart visualization would appear here</p>
                    <p style="font-size: 0.8rem;">Data: ${JSON.stringify(data.datasets[0].data)}</p>
                </div>
            </div>
        </div>
    `;
}

// Utility functions
function getStatusText(status) {
    const statusMap = {
        'success': 'Successful',
        'pending': 'Pending',
        'failed': 'Failed'
    };
    return statusMap[status] || status;
}

function getCategoryText(category) {
    const categoryMap = {
        'ssc': 'SSC Exams',
        'railway': 'Railway Exams',
        'mp-exams': 'MP Exams',
        'banking': 'Banking Exams',
        'other-exams': 'Other Exams'
    };
    return categoryMap[category] || category;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.admin-notification').forEach(el => el.remove());
    
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    if (!document.querySelector('#adminNotificationStyles')) {
        const style = document.createElement('style');
        style.id = 'adminNotificationStyles';
        style.textContent = `
            .admin-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 10px;
                color: white;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                display: flex;
                align-items: center;
                gap: 10px;
                max-width: 300px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            .admin-notification.success { background: var(--success); }
            .admin-notification.error { background: var(--secondary); }
            .admin-notification.info { background: var(--primary); }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
}

// Export data function
function exportData() {
    const data = {
        orders: orders,
        products: products,
        customers: customers,
        exportDate: new Date().toISOString(),
        exportedBy: 'Admin Panel'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `studyzone-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Data exported successfully!', 'success');
}

// Import data function
function importData(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (data.orders && data.products) {
                    if (confirm('This will replace all current data. Continue?')) {
                        orders = data.orders;
                        products = data.products;
                        customers = data.customers || [];
                        
                        localStorage.setItem('adminOrders', JSON.stringify(orders));
                        localStorage.setItem('adminProducts', JSON.stringify(products));
                        localStorage.setItem('adminCustomers', JSON.stringify(customers));
                        
                        updateStats();
                        loadRecentOrders();
                        loadAllOrders();
                        loadProducts();
                        loadCustomers();
                        
                        showNotification('Data imported successfully!', 'success');
                    }
                } else {
                    showNotification('Invalid data format', 'error');
                }
            } catch (error) {
                showNotification('Error parsing JSON file', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initAdmin);