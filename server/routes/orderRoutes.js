import express from 'express';
import { db } from '../data/db.js';

const router = express.Router();

// GET /api/orders
router.get('/', (req, res) => {
  try {
    const { userId } = req.query;
    const orders = db.getOrders(userId);
    res.json({
      success: true,
      total: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/orders/:orderId
router.get('/:orderId', (req, res) => {
  try {
    const order = db.getOrderById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/orders
router.post('/', (req, res) => {
  try {
    const {
      userId,
      items,
      subtotal,
      discount,
      shippingCost,
      tax,
      total,
      shippingMethod,
      paymentMethod,
      shippingAddress,
      customerInfo
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    const orderId = 'AURA-' + Math.floor(10000 + Math.random() * 90000);
    const trackingNumber = `AU-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newOrder = {
      orderId,
      userId: userId || null,
      date: new Date().toISOString().split('T')[0],
      items,
      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      shipping: Number(shippingCost) || 0,
      tax: Number(tax) || 0,
      total: Number(total) || 0,
      status: 'Processing',
      shippingMethod: shippingMethod || 'Standard Carbon-Neutral Delivery',
      paymentMethod: paymentMethod || 'Credit Card',
      trackingNumber,
      shippingAddress,
      customerInfo,
      trackingSteps: [
        { label: 'Order Confirmed', date: 'Just now', completed: true },
        { label: 'Artisan Packaging', date: 'In Progress', completed: false },
        { label: 'Express Dispatch', date: 'Pending', completed: false },
        { label: 'Doorstep Delivery', date: 'Estimated in 2-3 days', completed: false }
      ]
    };

    const saved = db.saveOrder(newOrder);

    res.status(201).json({
      success: true,
      message: 'Order created and scheduled successfully',
      data: saved
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/orders/:orderId/status (Admin: Update Status)
router.put('/:orderId/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const orders = db.getOrders();
    const index = orders.findIndex((o) => o.orderId === req.params.orderId);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    orders[index].status = status;

    // Update tracking steps dynamically based on status
    if (status === 'Artisan Packaging') {
      orders[index].trackingSteps[0].completed = true;
      orders[index].trackingSteps[1].completed = true;
      orders[index].trackingSteps[1].date = 'Packaging Complete';
    } else if (status === 'Shipped' || status === 'Dispatched') {
      orders[index].trackingSteps[0].completed = true;
      orders[index].trackingSteps[1].completed = true;
      orders[index].trackingSteps[2].completed = true;
      orders[index].trackingSteps[2].date = 'Dispatched via Courier';
    } else if (status === 'Delivered') {
      orders[index].trackingSteps.forEach((s) => (s.completed = true));
      orders[index].trackingSteps[3].date = 'Delivered to Recipient';
    } else if (status === 'Cancelled') {
      orders[index].trackingSteps = [{ label: 'Order Cancelled', date: 'Cancelled by Store', completed: true }];
    }

    db.writeOrders?.(orders) || db.saveOrder?.(orders[index]);

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: orders[index]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
