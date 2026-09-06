import express from 'express';
import { db } from '../data/db.js';

const router = express.Router();

// POST /api/newsletter/subscribe
router.post('/newsletter/subscribe', (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email address is required' });
    }

    const result = db.saveNewsletter(email);
    res.json({
      success: true,
      message: 'Subscribed to AURA Privé Club successfully',
      data: {
        ...result,
        welcomePromo: 'AURA20',
        reward: '20% off your first acquisition'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/concierge/inquiry
router.post('/concierge/inquiry', (req, res) => {
  try {
    const { name, email, inquiryType, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }

    const record = db.saveInquiry({ name, email, inquiryType, message });
    res.status(201).json({
      success: true,
      message: 'Inquiry dispatched to the AURA personal concierge team',
      data: record
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
