const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getOrder, cancelOrder, getSellerOrders, updateOrderStatus, getSellerAnalytics } = require('../controllers/orderController');
const { protect, sellerOnly, buyerOnly } = require('../middleware/authMiddleware');

router.post('/', protect, placeOrder);
router.get('/my', protect, getMyOrders);
router.get('/seller', protect, sellerOnly, getSellerOrders);
router.get('/seller/analytics', protect, sellerOnly, getSellerAnalytics);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/status', protect, sellerOnly, updateOrderStatus);

module.exports = router;
