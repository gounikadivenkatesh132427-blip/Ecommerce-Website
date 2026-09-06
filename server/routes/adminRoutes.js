import express from 'express';
import { db } from '../data/db.js';

const router = express.Router();

// POST /api/admin/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    // Default master admin or credentials check
    if ((email === 'admin@aura.luxury' && password === 'admin123') || req.body.demoAdmin) {
      return res.json({
        success: true,
        message: 'Admin authentication successful',
        data: {
          id: 'admin-master',
          name: 'Master Atelier Director',
          email: 'admin@aura.luxury',
          role: 'SUPER_ADMIN',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
        }
      });
    }

    res.status(401).json({
      success: false,
      message: 'Invalid administrative credentials. Use admin@aura.luxury / admin123'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admin/stats
router.get('/stats', (req, res) => {
  try {
    const products = db.getProducts();
    const orders = db.getOrders();
    const users = db.getUsers();

    const grossRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalCustomers = users.length;
    const lowStockItems = products.filter((p) => Number(p.stock) < 10);

    // Sales by Category
    const categoryRevenue = {};
    orders.forEach((o) => {
      o.items?.forEach((item) => {
        const cat = item.product?.category || 'General';
        categoryRevenue[cat] = (categoryRevenue[cat] || 0) + (item.price * item.quantity);
      });
    });

    res.json({
      success: true,
      data: {
        grossRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        lowStockCount: lowStockItems.length,
        lowStockItems: lowStockItems.slice(0, 5),
        recentOrders: orders.slice(0, 6),
        categoryRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admin/customers
router.get('/customers', (req, res) => {
  try {
    const users = db.getUsers();
    const orders = db.getOrders();

    const enrichedCustomers = users.map((u) => {
      const userOrders = orders.filter((o) => o.userId === u.id || o.shippingAddress?.fullName?.toLowerCase() === u.name.toLowerCase());
      const totalSpent = userOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      const { password: _, ...safeUser } = u;
      return {
        ...safeUser,
        orderCount: userOrders.length,
        totalSpent
      };
    });

    res.json({
      success: true,
      total: enrichedCustomers.length,
      data: enrichedCustomers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
