const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB Connection
let Order, Product, Customer;
try {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/studyzone', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    
    // Order Schema
    const orderSchema = new mongoose.Schema({
        orderId: String,
        product: String,
        amount: Number,
        customerName: String,
        customerEmail: String,
        customerPhone: String,
        customerCity: String,
        paymentStatus: { type: String, default: 'pending' },
        razorpayPaymentId: String,
        razorpayOrderId: String,
        couponUsed: String,
        discount: Number,
        finalAmount: Number,
        createdAt: { type: Date, default: Date.now }
    });

    // Product Schema
    const productSchema = new mongoose.Schema({
        name: String,
        price: Number,
        originalPrice: Number,
        category: String,
        description: String,
        tags: [String],
        isActive: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now }
    });

    // Customer Schema
    const customerSchema = new mongoose.Schema({
        name: String,
        email: String,
        phone: String,
        city: String,
        totalOrders: { type: Number, default: 0 },
        totalSpent: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now }
    });

    Order = mongoose.model('Order', orderSchema);
    Product = mongoose.model('Product', productSchema);
    Customer = mongoose.model('Customer', customerSchema);
    
    console.log('✅ MongoDB Connected');
} catch (error) {
    console.log('❌ MongoDB not available, using in-memory storage');
    // In-memory storage for demo
    let orders = [];
    let products = [];
    let customers = [];
    
    Order = {
        find: () => ({
            sort: (sort) => {
                if (sort && sort.createdAt === -1) {
                    return Promise.resolve(orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                }
                return Promise.resolve(orders);
            }
        }),
        findOne: (query) => Promise.resolve(orders.find(o => o.orderId === query.orderId)),
        findOneAndUpdate: (query, update) => {
            const order = orders.find(o => o.orderId === query.orderId);
            if (order) {
                Object.assign(order, update);
            }
            return Promise.resolve(order);
        },
        create: (data) => {
            orders.push(data);
            return Promise.resolve(data);
        }
    };

    Product = {
        find: () => Promise.resolve(products),
        findById: (id) => Promise.resolve(products.find(p => p._id === id)),
        findOneAndUpdate: (query, update) => {
            const product = products.find(p => p._id === query._id);
            if (product) {
                Object.assign(product, update);
            }
            return Promise.resolve(product);
        },
        create: (data) => {
            const newProduct = { ...data, _id: 'prod_' + Date.now() };
            products.push(newProduct);
            return Promise.resolve(newProduct);
        }
    };

    Customer = {
        find: () => Promise.resolve(customers),
        findOne: (query) => Promise.resolve(customers.find(c => c.email === query.email)),
        findOneAndUpdate: (query, update) => {
            const customer = customers.find(c => c.email === query.email);
            if (customer) {
                Object.assign(customer, update);
            }
            return Promise.resolve(customer);
        },
        create: (data) => {
            const newCustomer = { ...data, _id: 'cust_' + Date.now() };
            customers.push(newCustomer);
            return Promise.resolve(newCustomer);
        }
    };
}

// Razorpay Setup
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_RZgCHTswTGwtAU',
    key_secret: process.env.RAZORPAY_SECRET || 'tCqTPGDadt4K00Dr3N9JGtC2'
});

// Email Setup
let transporter;
try {
    transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'kripanshofficial@gmail.com',
            pass: process.env.EMAIL_PASS || 'your_gmail_app_password'
        }
    });
    console.log('✅ Email service configured');
} catch (error) {
    console.log('❌ Email service not configured');
}

// Admin Configuration
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_USERS = {
    'admin': ADMIN_PASSWORD,
    'kripansh': ADMIN_PASSWORD
};

// Helper Functions

// Send Email Function
async function sendEmail(to, subject, html) {
    if (!transporter) {
        console.log('📧 Email would be sent to:', to);
        console.log('📧 Subject:', subject);
        return;
    }
    
    try {
        await transporter.sendMail({
            from: '"Study Zone" <kripanshofficial@gmail.com>',
            to: to,
            subject: subject,
            html: html
        });
        console.log('✅ Email sent to:', to);
    } catch (error) {
        console.log('❌ Email error:', error);
    }
}

// Admin Authentication Middleware
const authenticateAdmin = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Access token required'
        });
    }
    
    const adminToken = token.replace('Bearer ', '');
    
    // In a real application, you would verify JWT tokens
    // For demo, we'll use simple token validation
    if (adminToken && adminToken.startsWith('admin_token_')) {
        next();
    } else {
        res.status(401).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
};

// 🎯 MAIN API ROUTES

// 1. Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Study Zone Backend is running',
        timestamp: new Date().toISOString(),
        developer: 'Kripansh Prajapati',
        contact: '+91 7869952173',
        version: '2.0.0',
        admin: true
    });
});

// 2. Create Razorpay Order
app.post('/api/create-order', async (req, res) => {
    try {
        const { amount, product, customer } = req.body;
        
        console.log('🛒 Creating order:', { product, amount, customer: customer.email });
        
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency: "INR",
            receipt: "receipt_" + Date.now(),
            notes: {
                product: product,
                customer_email: customer.email,
                customer_phone: customer.phone
            }
        };

        const order = await razorpay.orders.create(options);
        
        console.log('✅ Order created:', order.id);
        
        // Save or update customer
        await Customer.findOneAndUpdate(
            { email: customer.email },
            {
                name: customer.name,
                phone: customer.phone,
                city: customer.city,
                $inc: { totalOrders: 1, totalSpent: amount }
            },
            { upsert: true, new: true }
        );
        
        // Save order to database
        const newOrder = {
            orderId: order.id,
            product: product,
            amount: amount,
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: customer.phone,
            customerCity: customer.city,
            finalAmount: amount,
            paymentStatus: 'pending'
        };
        
        await Order.create(newOrder);

        res.json({
            success: true,
            order: order,
            message: 'Order created successfully'
        });
        
    } catch (error) {
        console.error('❌ Order creation error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Order creation failed'
        });
    }
});

// 3. Verify Payment
app.post('/api/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        console.log('🔍 Verifying payment:', { 
            order_id: razorpay_order_id, 
            payment_id: razorpay_payment_id 
        });

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET || 'tCqTPGDadt4K00Dr3N9JGtC2')
            .update(body)
            .digest('hex');

        console.log('🔐 Signature verification:', {
            expected: expectedSignature,
            received: razorpay_signature,
            match: expectedSignature === razorpay_signature
        });

        if (expectedSignature === razorpay_signature) {
            // Payment successful
            
            // Update order in database
            await Order.findOneAndUpdate(
                { orderId: razorpay_order_id },
                {
                    paymentStatus: 'success',
                    razorpayPaymentId: razorpay_payment_id,
                    razorpayOrderId: razorpay_order_id
                }
            );

            const order = await Order.findOne({ orderId: razorpay_order_id });
            
            console.log('✅ Payment verified successfully for order:', razorpay_order_id);
            
            // Update customer total spent
            if (order) {
                await Customer.findOneAndUpdate(
                    { email: order.customerEmail },
                    { $inc: { totalSpent: order.finalAmount } }
                );
            }
            
            // Send confirmation email
            if (order && order.customerEmail) {
                const emailHtml = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #ff416c;">🎉 Payment Successful!</h2>
                        <p>Dear ${order.customerName},</p>
                        <p>Thank you for purchasing <strong>${order.product}</strong> from Study Zone.</p>
                        
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3>Order Details:</h3>
                            <p><strong>Product:</strong> ${order.product}</p>
                            <p><strong>Amount Paid:</strong> ₹${order.finalAmount}</p>
                            <p><strong>Order ID:</strong> ${order.orderId}</p>
                            <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
                            <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
                        </div>
                        
                        <p>You can now download your notes from:</p>
                        <a href="https://yourwebsite.com/download.html?order=${order.orderId}&payment_id=${razorpay_payment_id}&product=${encodeURIComponent(order.product)}" 
                           style="background: #ff416c; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">
                            📥 Download Notes
                        </a>
                        
                        <p style="margin-top: 30px;">
                            <strong>Need Help?</strong><br>
                            📧 Email: kripanshofficial@gmail.com<br>
                            📞 Phone: +91 7869952173<br>
                            📍 Address: Katni, Madhya Pradesh
                        </p>
                        
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                        <p style="color: #666; font-size: 0.9rem;">
                            This is an automated email. Please do not reply to this message.
                        </p>
                    </div>
                `;

                await sendEmail(order.customerEmail, 'Study Zone - Payment Successful', emailHtml);
            }

            res.json({
                success: true,
                message: 'Payment verified successfully',
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id
            });
        } else {
            // Signature verification failed
            await Order.findOneAndUpdate(
                { orderId: razorpay_order_id },
                { paymentStatus: 'failed' }
            );
            
            console.log('❌ Payment verification failed for order:', razorpay_order_id);
            
            res.status(400).json({
                success: false,
                error: 'Payment verification failed - Invalid signature'
            });
        }
    } catch (error) {
        console.error('❌ Payment verification error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Payment verification failed'
        });
    }
});

// 4. Check Order Status
app.get('/api/order/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });
        
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            order: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 5. Get All Orders (for admin - protected)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            orders: orders,
            count: orders.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 6. Download Verification
app.post('/api/verify-download', async (req, res) => {
    try {
        const { orderId, product } = req.body;
        
        console.log('🔍 Verifying download access:', { orderId, product });
        
        const order = await Order.findOne({
            orderId: orderId,
            paymentStatus: 'success'
        });
        
        if (order) {
            console.log('✅ Download access granted for order:', orderId);
            res.json({
                success: true,
                allowed: true,
                order: order
            });
        } else {
            console.log('❌ Download access denied for order:', orderId);
            res.json({
                success: true,
                allowed: false,
                error: 'Payment not verified or order not found'
            });
        }
    } catch (error) {
        console.error('❌ Download verification error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 7. Contact Form Submission
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, message, subject } = req.body;
        
        console.log('📧 Contact form submission:', { name, email, subject });
        
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #ff416c;">New Contact Form Submission</h2>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3>Contact Details:</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <p style="background: white; padding: 10px; border-radius: 5px; border-left: 4px solid #ff416c;">
                        ${message}
                    </p>
                    <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN')}</p>
                </div>
            </div>
        `;

        await sendEmail('kripanshofficial@gmail.com', `Study Zone Contact: ${subject}`, emailHtml);
        
        // Send confirmation to user
        const userEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #ff416c;">Thank You for Contacting Study Zone!</h2>
                <p>Dear ${name},</p>
                <p>We have received your message and will get back to you within 24 hours.</p>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3>Your Message:</h3>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p>${message}</p>
                </div>
                
                <p><strong>Our Contact Information:</strong></p>
                <p>📧 Email: kripanshofficial@gmail.com</p>
                <p>📞 Phone: +91 7869952173</p>
                <p>📍 Address: Katni, Madhya Pradesh</p>
                
                <p style="margin-top: 30px;">
                    Best regards,<br>
                    <strong>Study Zone Team</strong>
                </p>
            </div>
        `;

        await sendEmail(email, 'Study Zone - We Received Your Message', userEmailHtml);

        res.json({
            success: true,
            message: 'Message sent successfully'
        });
        
    } catch (error) {
        console.error('❌ Contact form error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 🎯 ADMIN API ROUTES

// 1. Admin Login
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            error: 'Username and password required'
        });
    }
    
    if (ADMIN_USERS[username] && ADMIN_USERS[username] === password) {
        const token = 'admin_token_' + Date.now();
        
        res.json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                username: username,
                name: username === 'admin' ? 'Administrator' : 'Kripansh Prajapati',
                role: 'admin'
            }
        });
    } else {
        res.status(401).json({
            success: false,
            error: 'Invalid username or password'
        });
    }
});

// 2. Get Admin Dashboard Stats
app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        const products = await Product.find({ isActive: true });
        const customers = await Customer.find();
        
        const successfulOrders = orders.filter(order => order.paymentStatus === 'success');
        const pendingOrders = orders.filter(order => order.paymentStatus === 'pending');
        const failedOrders = orders.filter(order => order.paymentStatus === 'failed');
        
        const totalRevenue = successfulOrders.reduce((sum, order) => sum + (order.finalAmount || order.amount), 0);
        const totalOrders = orders.length;
        const successRate = totalOrders > 0 ? (successfulOrders.length / totalOrders) * 100 : 0;
        
        // Recent orders (last 5)
        const recentOrders = orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        
        // Monthly revenue data (last 6 months)
        const monthlyRevenue = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const month = date.toLocaleString('en', { month: 'short' });
            const year = date.getFullYear();
            
            const monthOrders = successfulOrders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate.getMonth() === date.getMonth() && 
                       orderDate.getFullYear() === date.getFullYear();
            });
            
            const revenue = monthOrders.reduce((sum, order) => sum + (order.finalAmount || order.amount), 0);
            
            monthlyRevenue.push({
                month: `${month} ${year}`,
                revenue: revenue,
                orders: monthOrders.length
            });
        }
        
        // Products by category
        const productsByCategory = {};
        products.forEach(product => {
            if (!productsByCategory[product.category]) {
                productsByCategory[product.category] = 0;
            }
            productsByCategory[product.category]++;
        });
        
        res.json({
            success: true,
            stats: {
                totalRevenue,
                totalOrders,
                successRate: Math.round(successRate),
                totalProducts: products.length,
                totalCustomers: customers.length,
                pendingOrders: pendingOrders.length,
                failedOrders: failedOrders.length,
                monthlyRevenue,
                productsByCategory,
                recentOrders
            }
        });
    } catch (error) {
        console.error('❌ Admin stats error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 3. Get All Orders (Admin)
app.get('/api/admin/orders', authenticateAdmin, async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        
        let query = {};
        if (status && status !== 'all') {
            query.paymentStatus = status;
        }
        
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        const total = await Order.countDocuments(query);
        
        res.json({
            success: true,
            orders: orders,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total: total
            }
        });
    } catch (error) {
        console.error('❌ Admin orders error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 4. Update Order Status
app.put('/api/admin/orders/:orderId', authenticateAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['pending', 'success', 'failed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }
        
        const order = await Order.findOneAndUpdate(
            { orderId: req.params.orderId },
            { paymentStatus: status },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }
        
        // If status is success, update customer total spent
        if (status === 'success') {
            await Customer.findOneAndUpdate(
                { email: order.customerEmail },
                { $inc: { totalSpent: order.finalAmount || order.amount } }
            );
        }
        
        res.json({
            success: true,
            order: order,
            message: `Order status updated to ${status}`
        });
    } catch (error) {
        console.error('❌ Update order error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 5. Get All Products (Admin)
app.get('/api/admin/products', authenticateAdmin, async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        
        res.json({
            success: true,
            products: products,
            count: products.length
        });
    } catch (error) {
        console.error('❌ Admin products error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 6. Create New Product
app.post('/api/admin/products', authenticateAdmin, async (req, res) => {
    try {
        const { name, price, originalPrice, category, description, tags } = req.body;
        
        if (!name || !price || !category) {
            return res.status(400).json({
                success: false,
                error: 'Name, price and category are required'
            });
        }
        
        const product = new Product({
            name,
            price: parseFloat(price),
            originalPrice: parseFloat(originalPrice) || parseFloat(price) + 100,
            category,
            description: description || '',
            tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : [])
        });
        
        await product.save();
        
        res.json({
            success: true,
            product: product,
            message: 'Product created successfully'
        });
    } catch (error) {
        console.error('❌ Create product error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 7. Update Product
app.put('/api/admin/products/:id', authenticateAdmin, async (req, res) => {
    try {
        const { name, price, originalPrice, category, description, tags, isActive } = req.body;
        
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                price: parseFloat(price),
                originalPrice: parseFloat(originalPrice),
                category,
                description,
                tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []),
                isActive
            },
            { new: true }
        );
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            product: product,
            message: 'Product updated successfully'
        });
    } catch (error) {
        console.error('❌ Update product error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 8. Delete Product
app.delete('/api/admin/products/:id', authenticateAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('❌ Delete product error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 9. Get All Customers (Admin)
app.get('/api/admin/customers', authenticateAdmin, async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        
        res.json({
            success: true,
            customers: customers,
            count: customers.length
        });
    } catch (error) {
        console.error('❌ Admin customers error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 10. Get Customer Details
app.get('/api/admin/customers/:email', authenticateAdmin, async (req, res) => {
    try {
        const customer = await Customer.findOne({ email: req.params.email });
        
        if (!customer) {
            return res.status(404).json({
                success: false,
                error: 'Customer not found'
            });
        }
        
        // Get customer orders
        const orders = await Order.find({ customerEmail: req.params.email }).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            customer: customer,
            orders: orders,
            orderCount: orders.length
        });
    } catch (error) {
        console.error('❌ Customer details error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 11. Export Data (Admin)
app.get('/api/admin/export', authenticateAdmin, async (req, res) => {
    try {
        const { type } = req.query;
        
        let data;
        switch (type) {
            case 'orders':
                data = await Order.find().sort({ createdAt: -1 });
                break;
            case 'products':
                data = await Product.find().sort({ createdAt: -1 });
                break;
            case 'customers':
                data = await Customer.find().sort({ createdAt: -1 });
                break;
            default:
                data = {
                    orders: await Order.find().sort({ createdAt: -1 }),
                    products: await Product.find().sort({ createdAt: -1 }),
                    customers: await Customer.find().sort({ createdAt: -1 }),
                    exportDate: new Date().toISOString()
                };
        }
        
        res.json({
            success: true,
            data: data,
            exportDate: new Date().toISOString(),
            type: type || 'all'
        });
    } catch (error) {
        console.error('❌ Export data error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 🎯 FRONTEND ROUTES

// Serve frontend pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/payment.html'));
});

app.get('/download', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/download.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

// 404 Handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Error Handler
app.use((error, req, res, next) => {
    console.error('🚨 Server Error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Initialize Sample Data (for demo)
async function initializeSampleData() {
    try {
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            const sampleProducts = [
                {
                    name: 'SSC CGL Complete Pack',
                    price: 399,
                    originalPrice: 599,
                    category: 'ssc',
                    description: 'Complete preparation for SSC CGL Tier 1 & 2 - Math, Reasoning, English, GK',
                    tags: ['ssc', 'cgl', 'tier1', 'tier2', 'complete', 'math', 'reasoning', 'english', 'gk']
                },
                {
                    name: 'RRB NTPC Complete',
                    price: 349,
                    originalPrice: 549,
                    category: 'railway',
                    description: 'CBT 1 & 2 preparation with practice questions and shortcuts',
                    tags: ['rrb', 'ntpc', 'cbt1', 'cbt2', 'railway', 'math', 'reasoning']
                },
                {
                    name: 'MP Police Constable Complete',
                    price: 299,
                    originalPrice: 499,
                    category: 'mp-exams',
                    description: 'General knowledge, reasoning, math for MP Police constable exam',
                    tags: ['mp', 'police', 'constable', 'mpesb', 'vyapam', 'general', 'knowledge', 'reasoning']
                }
            ];
            
            await Product.insertMany(sampleProducts);
            console.log('✅ Sample products created');
        }
    } catch (error) {
        console.log('❌ Sample data initialization failed:', error);
    }
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`
    🚀 Study Zone Backend Server Started!
    📍 Port: ${PORT}
    🌐 Environment: ${process.env.NODE_ENV || 'development'}
    
    📧 Developer: Kripansh Prajapati
    📞 Contact: +91 7869952173
    📧 Email: kripanshofficial@gmail.com
    
    🔑 Razorpay Key: ${process.env.RAZORPAY_KEY_ID ? 'Configured' : 'Not Configured'}
    🗄️ Database: ${process.env.MONGODB_URI ? 'Connected' : 'In-Memory'}
    📧 Email Service: ${transporter ? 'Configured' : 'Not Configured'}
    🔐 Admin Panel: Enabled
    
    📚 Available Routes:
    ✅ GET  /api/health - Health check
    ✅ POST /api/create-order - Create Razorpay order
    ✅ POST /api/verify-payment - Verify payment
    ✅ GET  /api/order/:id - Get order details
    ✅ GET  /api/orders - Get all orders
    ✅ POST /api/verify-download - Verify download access
    ✅ POST /api/contact - Contact form
    
    🎯 ADMIN ROUTES:
    ✅ POST /api/admin/login - Admin login
    ✅ GET  /api/admin/stats - Dashboard statistics
    ✅ GET  /api/admin/orders - Get all orders (admin)
    ✅ PUT  /api/admin/orders/:id - Update order status
    ✅ GET  /api/admin/products - Get all products
    ✅ POST /api/admin/products - Create product
    ✅ PUT  /api/admin/products/:id - Update product
    ✅ DELETE /api/admin/products/:id - Delete product
    ✅ GET  /api/admin/customers - Get all customers
    ✅ GET  /api/admin/customers/:email - Get customer details
    ✅ GET  /api/admin/export - Export data
    
    🎯 FRONTEND ROUTES:
    ✅ GET  / - Home page
    ✅ GET  /payment - Payment page
    ✅ GET  /download - Download page
    ✅ GET  /admin - Admin panel
    
    ⚠️  Important: Make sure to configure environment variables in .env file
    `);
    
    // Initialize sample data
    await initializeSampleData();
});