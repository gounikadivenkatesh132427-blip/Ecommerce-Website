import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS, CATEGORIES, PROMO_CODES } from '../../src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 1. Write products.json
fs.writeFileSync(path.join(DATA_DIR, 'products.json'), JSON.stringify(PRODUCTS, null, 2), 'utf-8');
console.log('✅ products.json written with', PRODUCTS.length, 'INR products');

// 2. Write categories.json
fs.writeFileSync(path.join(DATA_DIR, 'categories.json'), JSON.stringify(CATEGORIES, null, 2), 'utf-8');
console.log('✅ categories.json written');

// 3. Write promos.json
fs.writeFileSync(path.join(DATA_DIR, 'promos.json'), JSON.stringify(PROMO_CODES, null, 2), 'utf-8');
console.log('✅ promos.json written with INR thresholds');

// 4. Write users.json
const users = [
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
fs.writeFileSync(path.join(DATA_DIR, 'users.json'), JSON.stringify(users, null, 2), 'utf-8');
console.log('✅ users.json written');

// 5. Write orders.json
const orders = [
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
    paymentMethod: 'Credit Card (•••• 8921)',
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
  },
  {
    orderId: 'AURA-61042',
    userId: 'usr-2',
    date: '2026-09-02',
    items: [
      {
        product: PRODUCTS[8], // Studio ANC Headphones (31999)
        quantity: 1,
        selectedSize: 'One Size',
        selectedColor: PRODUCTS[8].colors[0],
        price: PRODUCTS[8].price
      }
    ],
    subtotal: 31999,
    discount: 3200,
    shipping: 0,
    tax: 5183,
    total: 33982,
    status: 'Out for Delivery',
    shippingMethod: 'Express Priority Air',
    paymentMethod: 'UPI FastPay',
    trackingNumber: 'AU-EXP-44029188',
    shippingAddress: {
      fullName: 'Rohan Mehta',
      street: '18B Altamount Road, Cumballa Hill',
      city: 'Mumbai',
      state: 'MH',
      zip: '400026',
      country: 'India',
      phone: '+91 98200 87654'
    },
    trackingSteps: [
      { label: 'Order Confirmed', date: 'Sep 02, 09:15 AM', completed: true },
      { label: 'Artisan Packaging', date: 'Sep 02, 02:00 PM', completed: true },
      { label: 'Shipped with Express', date: 'Sep 03, 10:30 AM', completed: true },
      { label: 'Out for Delivery', date: 'Today, 08:00 AM', completed: true }
    ]
  }
];
fs.writeFileSync(path.join(DATA_DIR, 'orders.json'), JSON.stringify(orders, null, 2), 'utf-8');
console.log('✅ orders.json written with INR orders');
