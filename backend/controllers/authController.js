const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Cart = require('../models/Cart');

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  user.password = undefined;
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      role: user.role,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      shopName: user.shopName,
      avatar: user.avatar,
      shopLogo: user.shopLogo,
      isVerifiedSeller: user.isVerifiedSeller,
    },
  });
};

// @desc  Register Buyer
// @route POST /api/auth/register/buyer
exports.registerBuyer = asyncHandler(async (req, res) => {
  const { username, mobile, email, password } = req.body;
  if (!username || !password || (!mobile && !email)) {
    res.status(400); throw new Error('Username, password, and mobile/email are required');
  }
  const exists = await User.findOne({ $or: [{ email }, { mobile }] });
  if (exists) { res.status(400); throw new Error('User already exists with this email/mobile'); }

  const user = await User.create({ role: 'buyer', username, mobile, email, password });
  await Cart.create({ user: user._id, items: [] });
  sendToken(user, 201, res);
});

// @desc  Register Seller
// @route POST /api/auth/register/seller
exports.registerSeller = asyncHandler(async (req, res) => {
  const { shopName, mobile, password } = req.body;
  if (!shopName || !mobile || !password) {
    res.status(400); throw new Error('Shop name, mobile and password are required');
  }
  const exists = await User.findOne({ mobile, role: 'seller' });
  if (exists) { res.status(400); throw new Error('Seller already registered with this mobile'); }

  const user = await User.create({ role: 'seller', shopName, mobile, password });
  sendToken(user, 201, res);
});

// @desc  Login (Buyer or Seller)
// @route POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { credential, password, role } = req.body;
  if (!credential || !password || !role) {
    res.status(400); throw new Error('Please provide credentials and role');
  }

  const query = role === 'seller'
    ? { mobile: credential, role: 'seller' }
    : { $or: [{ email: credential }, { mobile: credential }], role: 'buyer' };

  const user = await User.findOne(query).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401); throw new Error('Invalid credentials');
  }
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });
  sendToken(user, 200, res);
});

// @desc  Get current user profile
// @route GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name images price');
  res.json({ success: true, user });
});

// @desc  Update profile
// @route PUT /api/auth/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const fields = ['username', 'email', 'mobile', 'avatar', 'shopName', 'shopDescription', 'shopCategory'];
  const updates = {};
  fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ success: true, user });
});

// @desc  Change password
// @route PUT /api/auth/password
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    res.status(400); throw new Error('Current password is incorrect');
  }
  user.password = newPassword;
  await user.save();
  sendToken(user, 200, res);
});

// @desc  Add address
// @route POST /api/auth/address
exports.addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { label, street, city, state, pincode, country, isDefault } = req.body;
  if (isDefault) user.address.forEach(a => a.isDefault = false);
  user.address.push({ label, street, city, state, pincode, country, isDefault });
  await user.save();
  res.json({ success: true, address: user.address });
});

// @desc  Toggle wishlist
// @route POST /api/auth/wishlist/:productId
exports.toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const pid = req.params.productId;
  const idx = user.wishlist.indexOf(pid);
  let action;
  if (idx === -1) { user.wishlist.push(pid); action = 'added'; }
  else            { user.wishlist.splice(idx, 1); action = 'removed'; }
  await user.save();
  res.json({ success: true, action, wishlist: user.wishlist });
});
