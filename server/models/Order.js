import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: Object, required: true },
  quantity: { type: Number, required: true, default: 1 },
  selectedSize: { type: String, default: 'Standard' },
  selectedColor: { type: Object },
  price: { type: Number, required: true }
});

const trackingStepSchema = new mongoose.Schema({
  label: { type: String, required: true },
  date: { type: String },
  completed: { type: Boolean, default: false }
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: String },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Processing', 'Artisan Packaging', 'Dispatched', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Processing'
    },
    shippingMethod: { type: String, default: 'Standard Carbon-Neutral Delivery' },
    paymentMethod: { type: String, default: 'Cash on Delivery (COD)' },
    trackingNumber: { type: String },
    shippingAddress: { type: Object, required: true },
    customerInfo: { type: Object },
    trackingSteps: [trackingStepSchema]
  },
  {
    timestamps: true
  }
);

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
