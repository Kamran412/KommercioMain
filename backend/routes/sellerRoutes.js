// sellerRoutes.js
const express = require('express');
const router = express.Router();
const { protect, sellerOnly } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Get seller public profile
router.get('/:id/profile', asyncHandler(async (req, res) => {
  const seller = await User.findOne({ _id: req.params.id, role: 'seller' })
    .select('shopName shopDescription shopLogo shopBanner shopRating totalSales isVerifiedSeller createdAt');
  if (!seller) { res.status(404); throw new Error('Seller not found'); }
  const productCount = await Product.countDocuments({ seller: seller._id, isActive: true });
  res.json({ success: true, seller: { ...seller.toObject(), productCount } });
}));

// Seller dashboard stats
router.get('/dashboard/stats', protect, sellerOnly, asyncHandler(async (req, res) => {
  const [products, orders, revenue] = await Promise.all([
    Product.countDocuments({ seller: req.user._id }),
    Order.countDocuments({ 'orderItems.seller': req.user._id }),
    Order.aggregate([
      { $match: { 'orderItems.seller': req.user._id, orderStatus: { $nin: ['cancelled'] } } },
      { $unwind: '$orderItems' },
      { $match: { 'orderItems.seller': req.user._id } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } } } },
    ]),
  ]);
  const monthlyRevenue = await Order.aggregate([
    { $match: { 'orderItems.seller': req.user._id, createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
    { $unwind: '$orderItems' },
    { $match: { 'orderItems.seller': req.user._id } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }, orders: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  res.json({
    success: true,
    stats: {
      totalProducts: products,
      totalOrders: orders,
      totalRevenue: revenue[0]?.total || 0,
      monthlyRevenue,
    },
  });
}));

module.exports = router;
