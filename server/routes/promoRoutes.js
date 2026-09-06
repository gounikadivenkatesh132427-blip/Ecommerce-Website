import express from 'express';
import { db } from '../data/db.js';

const router = express.Router();

// GET /api/promos
router.get('/', (req, res) => {
  try {
    const promos = db.getPromos();
    res.json({ success: true, data: promos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/promos/validate
router.post('/validate', (req, res) => {
  try {
    const { code, cartSubtotal = 0 } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Promo code is required' });
    }

    const trimmed = code.trim().toUpperCase();
    const promos = db.getPromos();
    const promo = promos[trimmed];

    if (!promo) {
      return res.status(404).json({
        success: false,
        message: 'Invalid promo code. Try AURA20, VIP500, or FIRST10.'
      });
    }

    // Check min spend
    if (promo.minSpend && cartSubtotal < promo.minSpend) {
      return res.status(400).json({
        success: false,
        message: `This code requires a minimum spend of ₹${promo.minSpend.toLocaleString('en-IN')}.`
      });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (promo.type === 'percentage') {
      discountAmount = (cartSubtotal * promo.value) / 100;
    } else if (promo.type === 'fixed') {
      discountAmount = promo.value;
    } else if (promo.type === 'shipping') {
      discountAmount = 350; // standard shipping value
    }

    res.json({
      success: true,
      message: `Coupon "${trimmed}" applied successfully!`,
      data: {
        code: trimmed,
        ...promo,
        calculatedDiscount: discountAmount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
