import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { Promo } from '../models/Promo.js';
import { PRODUCTS, PROMO_CODES } from '../../src/data/products.js';

dotenv.config();

export let isMongoConnected = false;

export const connectMongoDb = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aura_ecommerce';

  try {
    console.log(`🔌 [MongoDB] Attempting to connect to: ${uri.replace(/\/\/.*@/, '//<credentials>@')}...`);
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3500, // Fast 3.5s timeout for local check
      connectTimeoutMS: 3500
    });

    isMongoConnected = true;
    console.log('🌿 [MongoDB] Connected successfully to MongoDB Database!');

    // Seed database if empty
    await seedMongoDbIfEmpty();

    return true;
  } catch (err) {
    isMongoConnected = false;
    console.log('\n⚠️  -------------------------------------------------------------');
    console.log('⚠️  [MongoDB Notice]: MongoDB is not currently reachable at:');
    console.log(`    ${uri}`);
    console.log('    Reason:', err.message);
    console.log('');
    console.log('💡  To connect MongoDB:');
    console.log('    1. Start your local MongoDB server: `net start MongoDB` or `mongod`');
    console.log('    2. OR add your MongoDB Atlas Cloud URI in `.env`:');
    console.log('       MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/aura_ecommerce');
    console.log('');
    console.log('🛡️  AURA is running with high-performance Persistent JSON Database fallback.');
    console.log('    All features, catalog, cart, checkout & admin are 100% OPERATIONAL.');
    console.log('⚠️  -------------------------------------------------------------\n');
    return false;
  }
};

const seedMongoDbIfEmpty = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('🌱 [MongoDB] Initializing & seeding 24 luxury products into MongoDB...');
      await Product.insertMany(PRODUCTS);
      console.log('✅ [MongoDB] Products seeded successfully.');
    }

    const promoCount = await Promo.countDocuments();
    if (promoCount === 0) {
      console.log('🌱 [MongoDB] Seeding promo codes into MongoDB...');
      const promoArray = Object.entries(PROMO_CODES).map(([code, p]) => ({
        code,
        ...p
      }));
      await Promo.insertMany(promoArray);
      console.log('✅ [MongoDB] Promos seeded successfully.');
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 [MongoDB] Seeding demo users into MongoDB...');
      await User.insertMany([
        {
          id: 'usr-1',
          name: 'Ananya Sharma',
          email: 'ananya.sharma@aura.luxury',
          password: 'password123',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          tier: 'AURA Black VIP',
          points: 1450,
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
      ]);
      console.log('✅ [MongoDB] Users seeded successfully.');
    }
  } catch (seedErr) {
    console.error('⚠️ [MongoDB Seeding Error]:', seedErr.message);
  }
};
