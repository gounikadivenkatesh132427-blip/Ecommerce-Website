import express from 'express';
import { db } from '../data/db.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password, demoKey } = req.body;

    const users = db.getUsers();

    // Demo quick login
    if (demoKey) {
      const user = demoKey === 'alex' ? users.find((u) => u.id === 'usr-2') : users.find((u) => u.id === 'usr-1');
      if (user) {
        const { password: _, ...safeUser } = user;
        return res.json({ success: true, message: 'Logged in as Demo User', data: safeUser });
      }
    }

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    let user = db.getUserByEmail(email);
    if (!user) {
      // Auto-register or create clean demo user session
      user = {
        id: 'usr-' + Date.now(),
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email: email.toLowerCase(),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        tier: 'AURA Gold Member',
        points: 250,
        memberSince: new Date().getFullYear().toString(),
        savedAddresses: []
      };
      users.push(user);
      db.saveUsers(users);
    }

    const { password: _, ...safeUser } = user;
    res.json({
      success: true,
      message: 'Authentication successful',
      data: safeUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!email || !firstName) {
      return res.status(400).json({ success: false, message: 'First name and email are required' });
    }

    const users = db.getUsers();
    const existing = db.getUserByEmail(email);
    if (existing) {
      const { password: _, ...safeUser } = existing;
      return res.json({ success: true, message: 'Account already exists', data: safeUser });
    }

    const newUser = {
      id: 'usr-' + Date.now(),
      name: `${firstName} ${lastName || ''}`.trim(),
      email: email.toLowerCase(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      tier: 'AURA Privé Member',
      points: 100,
      memberSince: new Date().getFullYear().toString(),
      savedAddresses: []
    };

    users.push(newUser);
    db.saveUsers(users);

    const { password: _, ...safeUser } = newUser;
    res.status(201).json({
      success: true,
      message: 'Privé membership created successfully',
      data: safeUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/me/:id
router.get('/me/:id', (req, res) => {
  try {
    const user = db.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { password: _, ...safeUser } = user;
    res.json({ success: true, data: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/addresses
router.post('/addresses', (req, res) => {
  try {
    const { userId, address } = req.body;
    if (!userId || !address) {
      return res.status(400).json({ success: false, message: 'User ID and address are required' });
    }

    const users = db.getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newAddress = {
      id: 'addr-' + Date.now(),
      ...address,
      isDefault: address.isDefault ?? true
    };

    if (!users[userIndex].savedAddresses) {
      users[userIndex].savedAddresses = [];
    }
    users[userIndex].savedAddresses.unshift(newAddress);
    db.saveUsers(users);

    res.json({
      success: true,
      message: 'Address saved successfully',
      data: users[userIndex].savedAddresses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
