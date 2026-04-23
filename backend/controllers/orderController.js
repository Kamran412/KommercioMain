const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc  Place order
// @route POST /api/orders
exports.placeOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;
  if (!orderItems?.length) { res.status(400); throw new Error('No order items'); }

  // Verify products and build items
  let itemsPrice = 0;
  const enrichedItems = await Promise.all(orderItems.map(async (item) => {
    const product = await Product.findById(item.product).populate('seller', '_id');
    if (!product || product.stock < item.quantity) {
      throw new Error(`Product ${product?.name || item.product} out of stock`);
    }
    itemsPrice += product.price * item.quantity;
    return {
      product: product._id,
      seller: product.seller._id,
      name: product.name,
      image: product.images[0]?.url || '',
      price: product.price,
      quantity: item.quantity,
      variant: item.variant || '',
    };
  }));

  const shippingPrice = itemsPrice >= 499 ? 0 : 40;
  const taxPrice = Math.round(itemsPrice * 0.05);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    buyer: req.user._id,
    orderItems: enrichedItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  // Decrement stock
  await Promise.all(enrichedItems.map(item =>
    Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, sold: item.quantity }
    })
  ));

  // Clear cart
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  res.status(201).json({ success: true, order });
});

// @desc  Get buyer's orders
// @route GET /api/orders/my
exports.getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const query = { buyer: req.user._id };
  if (status) query.orderStatus = status;
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('orderItems.product', 'name images')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json({ success: true, orders, total, pages: Math.ceil(total / limit) });
});

// @desc  Get single order
// @route GET /api/orders/:id
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('buyer', 'username email mobile')
    .populate('orderItems.product', 'name images')
    .populate('orderItems.seller', 'shopName');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  const isBuyer = order.buyer._id.toString() === req.user._id.toString();
  const isSeller = order.orderItems.some(i => i.seller._id?.toString() === req.user._id.toString());
  if (!isBuyer && !isSeller && req.user.role !== 'admin') {
    res.status(403); throw new Error('Access denied');
  }
  res.json({ success: true, order });
});

// @desc  Cancel order (Buyer)
// @route PUT /api/orders/:id/cancel
exports.cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.buyer.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }
  if (!['placed', 'confirmed'].includes(order.orderStatus)) {
    res.status(400); throw new Error('Cannot cancel this order');
  }
  order.orderStatus = 'cancelled';
  order.cancelledAt = new Date();
  order.cancelReason = req.body.reason || 'Cancelled by buyer';
  // Restore stock
  await Promise.all(order.orderItems.map(item =>
    Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity, sold: -item.quantity } })
  ));
  await order.save();
  res.json({ success: true, order });
});

// @desc  Get seller orders
// @route GET /api/orders/seller
exports.getSellerOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = { 'orderItems.seller': req.user._id };
  if (status) query.orderStatus = status;
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('buyer', 'username mobile')
    .populate('orderItems.product', 'name images')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json({ success: true, orders, total, pages: Math.ceil(total / limit) });
});

// @desc  Update order status (Seller)
// @route PUT /api/orders/:id/status
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  const isSeller = order.orderItems.some(i => i.seller.toString() === req.user._id.toString());
  if (!isSeller) { res.status(403); throw new Error('Not authorized'); }
  order.orderStatus = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (status === 'delivered') order.deliveredAt = new Date();
  await order.save();
  res.json({ success: true, order });
});

// @desc  Seller analytics
// @route GET /api/orders/seller/analytics
exports.getSellerAnalytics = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const [totalRevenue, totalOrders, recentOrders] = await Promise.all([
    Order.aggregate([
      { $match: { 'orderItems.seller': sellerId, orderStatus: { $ne: 'cancelled' } } },
      { $unwind: '$orderItems' },
      { $match: { 'orderItems.seller': sellerId } },
      { $group: { _id: null, revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } } } },
    ]),
    Order.countDocuments({ 'orderItems.seller': sellerId }),
    Order.find({ 'orderItems.seller': sellerId }).sort({ createdAt: -1 }).limit(5)
      .populate('buyer', 'username').populate('orderItems.product', 'name'),
  ]);
  res.json({
    success: true,
    analytics: {
      totalRevenue: totalRevenue[0]?.revenue || 0,
      totalOrders,
      recentOrders,
    },
  });
});
