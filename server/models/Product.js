import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    categorySlug: { type: String, required: true },
    brand: { type: String, required: true, default: 'Aura Atelier' },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
    reviewsCount: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 15 },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    shortDescription: { type: String },
    description: { type: String },
    images: [{ type: String }],
    colors: [
      {
        name: { type: String },
        hex: { type: String }
      }
    ],
    sizes: [{ type: String }],
    specs: { type: Map, of: String }
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true
  }
);

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
