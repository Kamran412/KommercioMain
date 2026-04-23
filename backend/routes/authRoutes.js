// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerBuyer, registerSeller, login, getMe, updateProfile, changePassword, addAddress, toggleWishlist } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register/buyer', registerBuyer);
router.post('/register/seller', registerSeller);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/address', protect, addAddress);
router.post('/wishlist/:productId', protect, toggleWishlist);

module.exports = router;
