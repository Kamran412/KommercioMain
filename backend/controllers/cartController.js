const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc  Get cart
exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id })
    .populate({ path: 'items.product', select: 'name price images stock seller', populate: { path: 'seller', select: 'shopName' } });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const total = cart.items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
  res.json({ success: true, cart, total });
});

// @desc  Add to cart
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, variant = '' } = req.body;
  const product = await Product.findById(productId);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  if (product.stock < quantity) { res.status(400); throw new Error('Insufficient stock'); }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const idx = cart.items.findIndex(i => i.product.toString() === productId && i.variant === variant);
  if (idx > -1) {
    cart.items[idx].quantity = Math.min(cart.items[idx].quantity + quantity, product.stock);
  } else {
    cart.items.push({ product: productId, quantity, variant });
  }
  await cart.save();
  res.json({ success: true, message: 'Added to cart', itemCount: cart.items.length });
});

// @desc  Update quantity
exports.updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }
  const item = cart.items.id(req.params.itemId);
  if (!item) { res.status(404); throw new Error('Item not found'); }
  if (quantity < 1) { cart.items.pull(req.params.itemId); }
  else { item.quantity = quantity; }
  await cart.save();
  res.json({ success: true, cart });
});

// @desc  Remove from cart
exports.removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }
  cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
  await cart.save();
  res.json({ success: true, message: 'Item removed', itemCount: cart.items.length });
});

// @desc  Clear cart
exports.clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ success: true, message: 'Cart cleared' });
});
