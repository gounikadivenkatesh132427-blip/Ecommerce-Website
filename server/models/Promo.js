import mongoose from 'mongoose';

const promoSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ['percentage', 'fixed', 'shipping'], required: true },
    value: { type: Number, required: true },
    description: { type: String, required: true },
    minSpend: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

export const Promo = mongoose.models.Promo || mongoose.model('Promo', promoSchema);
