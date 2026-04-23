const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user || !req.user.isActive) {
      res.status(401);
      throw new Error('Account not found or deactivated');
    }
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

const sellerOnly = (req, res, next) => {
  if (req.user?.role !== 'seller' && req.user?.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied: Sellers only');
  }
  next();
};

const buyerOnly = (req, res, next) => {
  if (req.user?.role !== 'buyer' && req.user?.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied: Buyers only');
  }
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied: Admins only');
  }
  next();
};

module.exports = { protect, sellerOnly, buyerOnly, adminOnly };
