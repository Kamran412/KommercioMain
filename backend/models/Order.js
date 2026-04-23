const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    image: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    variant: String,
  }],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    mobile: String,
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'stripe', 'razorpay', 'upi'],
    default: 'cod',
  },
  paymentResult: {
    id: String,
    status: String,
    updateTime: String,
    email: String,
  },
  itemsPrice: { type: Number, default: 0 },
  shippingPrice: { type: Number, default: 0 },
  taxPrice: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  orderStatus: {
    type: String,
    enum: ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'placed',
  },
  deliveredAt: Date,
  cancelledAt: Date,
  cancelReason: String,
  trackingNumber: String,
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
