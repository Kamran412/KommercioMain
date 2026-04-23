const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  images: [String],
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: 0 },
  discountPercent: { type: Number, default: 0 },
  category: { type: String, required: true },
  subcategory: { type: String, default: '' },
  brand: { type: String, default: '' },
  images: [{ url: String, public_id: String }],
  stock: { type: Number, required: true, default: 0 },
  sold: { type: Number, default: 0 },
  sku: { type: String, unique: true, sparse: true },
  tags: [String],
  specifications: [{
    key: String,
    value: String,
  }],
  variants: [{
    name: String,        // e.g. "Size", "Color"
    options: [String],   // e.g. ["S","M","L"] or ["Red","Blue"]
  }],
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  deliveryTime: { type: String, default: '3-5 days' },
  freeDelivery: { type: Boolean, default: false },
  returnPolicy: { type: String, default: '7 days return' },
  weight: { type: Number, default: 0 },
}, { timestamps: true });

// Calc avg rating on review add
productSchema.methods.calcRatings = function () {
  if (this.reviews.length === 0) {
    this.ratings = 0;
    this.numReviews = 0;
  } else {
    const total = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.ratings = (total / this.reviews.length).toFixed(1);
    this.numReviews = this.reviews.length;
  }
};

// Auto-calc discount
productSchema.pre('save', function (next) {
  if (this.originalPrice > 0 && this.price < this.originalPrice) {
    this.discountPercent = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
