import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String, default: 'Primary Residence' },
  fullName: { type: String },
  street: { type: String },
  city: { type: String },
  state: { type: String },
  zip: { type: String },
  country: { type: String, default: 'India' },
  phone: { type: String },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, default: 'password123' },
    avatar: { type: String },
    tier: { type: String, default: 'AURA Member' },
    points: { type: Number, default: 100 },
    memberSince: { type: String, default: () => new Date().getFullYear().toString() },
    savedAddresses: [addressSchema]
  },
  {
    timestamps: true
  }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
