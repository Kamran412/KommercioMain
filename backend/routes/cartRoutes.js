const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect, buyerOnly } = require('../middleware/authMiddleware');

router.get('/', protect, buyerOnly, getCart);
router.post('/add', protect, buyerOnly, addToCart);
router.put('/item/:itemId', protect, buyerOnly, updateCartItem);
router.delete('/item/:itemId', protect, buyerOnly, removeFromCart);
router.delete('/clear', protect, buyerOnly, clearCart);

module.exports = router;
