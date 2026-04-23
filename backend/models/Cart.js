const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1, min: 1 },
    variant: { type: String, default: '' },
    addedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

cartSchema.methods.calcTotal = async function () {
  await this.populate('items.product');
  return this.items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
};

module.exports = mongoose.model('Cart', cartSchema);
