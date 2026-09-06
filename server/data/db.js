import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS, CATEGORIES, PROMO_CODES, REVIEWS } from '../../src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname);

// Initial demo users
const INITIAL_USERS = [
  {
    id: 'usr-1',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@aura.luxury',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    tier: 'AURA Black VIP',
    points: 1450,
    memberSince: '2023',
    savedAddresses: [
      {
        id: 'addr-1',
        title: 'Primary Residence',
        fullName: 'Ananya Sharma',
        street: 'Penthouse 12, Golf Links Enclave',
        city: 'New Delhi',
        state: 'Delhi',
        zip: '110003',
        country: 'India',
        phone: '+91 98101 23456',
        isDefault: true
      }
    ]
  },
  {
    id: 'usr-2',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@aura.luxury',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    tier: 'AURA Gold Member',
    points: 820,
    memberSince: '2024',
    savedAddresses: [
      {
        id: 'addr-2',
        title: 'Sea Face Penthouse',
        fullName: 'Rohan Mehta',
        street: '18B Altamount Road, Cumballa Hill',
        city: 'Mumbai',
        state: 'MH',
        zip: '400026',
        country: 'India',
        phone: '+91 98200 87654',
        isDefault: true
      }
    ]
  }
];

// Helper to read JSON file safely
const readJson = (filename, fallback = []) => {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
  }
  return fallback;
};

// Helper to write JSON file safely
const writeJson = (filename, data) => {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
  }
};

// Initialize default files if not present
export const initDb = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Products
  if (!fs.existsSync(path.join(DATA_DIR, 'products.json'))) {
    writeJson('products.json', PRODUCTS);
  }

  // Categories
  if (!fs.existsSync(path.join(DATA_DIR, 'categories.json'))) {
    writeJson('categories.json', CATEGORIES);
  }

  // Users
  if (!fs.existsSync(path.join(DATA_DIR, 'users.json'))) {
    writeJson('users.json', INITIAL_USERS);
  }

  // Promos
  if (!fs.existsSync(path.join(DATA_DIR, 'promos.json'))) {
    writeJson('promos.json', PROMO_CODES);
  }

  // Orders
  if (!fs.existsSync(path.join(DATA_DIR, 'orders.json'))) {
    writeJson('orders.json', [
      {
        orderId: 'AURA-98241',
        userId: 'usr-1',
        date: '2026-08-28',
        items: [
          {
            product: PRODUCTS[4],
            quantity: 1,
            selectedSize: '50ml / 1.7 fl oz',
            selectedColor: PRODUCTS[4].colors[0],
            price: PRODUCTS[4].price
          },
          {
            product: PRODUCTS[12],
            quantity: 1,
            selectedSize: 'Large (Fits 15" Laptop)',
            selectedColor: PRODUCTS[12].colors[0],
            price: PRODUCTS[12].price
          }
        ],
        subtotal: 40899,
        discount: 8180,
        shipping: 0,
        tax: 5889,
        total: 38608,
        status: 'Delivered',
        shippingMethod: 'Express Courier (Free VIP Tier)',
        trackingNumber: 'AU-EXP-88937190',
        shippingAddress: {
          fullName: 'Ananya Sharma',
          street: 'Penthouse 12, Golf Links Enclave',
          city: 'New Delhi',
          state: 'Delhi',
          zip: '110003',
          country: 'India',
          phone: '+91 98101 23456'
        },
        trackingSteps: [
          { label: 'Order Confirmed', date: 'Aug 28, 10:30 AM', completed: true },
          { label: 'Artisan Packaging', date: 'Aug 28, 03:45 PM', completed: true },
          { label: 'Shipped with Express', date: 'Aug 29, 08:15 AM', completed: true },
          { label: 'Delivered', date: 'Aug 30, 02:20 PM', completed: true }
        ]
      }
    ]);
  }

  // Inquiries
  if (!fs.existsSync(path.join(DATA_DIR, 'inquiries.json'))) {
    writeJson('inquiries.json', []);
  }

  // Newsletter
  if (!fs.existsSync(path.join(DATA_DIR, 'newsletter.json'))) {
    writeJson('newsletter.json', []);
  }

  console.log('✅ AURA Database initialized with persistent files in', DATA_DIR);
};

// Database methods
export const db = {
  // Products
  getProducts: () => readJson('products.json', PRODUCTS),
  saveProducts: (products) => writeJson('products.json', products),
  getProductById: (id) => {
    const products = readJson('products.json', PRODUCTS);
    return products.find((p) => p.id === id || p.slug === id);
  },

  // Categories
  getCategories: () => readJson('categories.json', CATEGORIES),

  // Users
  getUsers: () => readJson('users.json', INITIAL_USERS),
  getUserById: (id) => {
    const users = readJson('users.json', INITIAL_USERS);
    return users.find((u) => u.id === id);
  },
  getUserByEmail: (email) => {
    const users = readJson('users.json', INITIAL_USERS);
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  saveUsers: (users) => writeJson('users.json', users),

  // Orders
  getOrders: (userId = null) => {
    const orders = readJson('orders.json', []);
    if (userId) {
      return orders.filter((o) => o.userId === userId || !o.userId);
    }
    return orders;
  },
  getOrderById: (orderId) => {
    const orders = readJson('orders.json', []);
    return orders.find((o) => o.orderId === orderId);
  },
  saveOrder: (newOrder) => {
    const orders = readJson('orders.json', []);
    const existingIndex = orders.findIndex((o) => o.orderId === newOrder.orderId);
    if (existingIndex > -1) {
      orders[existingIndex] = newOrder;
      writeJson('orders.json', orders);
    } else {
      writeJson('orders.json', [newOrder, ...orders]);
    }
    return newOrder;
  },
  writeOrders: (ordersList) => writeJson('orders.json', ordersList),

  // Promos
  getPromos: () => readJson('promos.json', PROMO_CODES),

  // Inquiries
  saveInquiry: (inquiry) => {
    const list = readJson('inquiries.json', []);
    const record = { id: 'inq-' + Date.now(), date: new Date().toISOString(), ...inquiry };
    writeJson('inquiries.json', [record, ...list]);
    return record;
  },

  // Newsletter
  saveNewsletter: (email) => {
    const list = readJson('newsletter.json', []);
    if (!list.includes(email.toLowerCase())) {
      list.push(email.toLowerCase());
      writeJson('newsletter.json', list);
    }
    return { email, subscribed: true };
  }
};
