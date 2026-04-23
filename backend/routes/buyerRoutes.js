// buyerRoutes.js
const express = require('express');
const router = express.Router();
const { protect, buyerOnly } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Order = require('../models/Order');

router.get('/dashboard/stats', protect, buyerOnly, asyncHandler(async (req, res) => {
  const [totalOrders, delivered, wishlistCount] = await Promise.all([
    Order.countDocuments({ buyer: req.user._id }),
    Order.countDocuments({ buyer: req.user._id, orderStatus: 'delivered' }),
    User.findById(req.user._id).select('wishlist').then(u => u.wishlist.length),
  ]);
  res.json({ success: true, stats: { totalOrders, delivered, wishlistCount } });
}));

module.exports = router;
