// ─── Order Routes ───────────────────────────────────────────────────────────
const express = require('express');
module.exports.orderRouter = (() => {
  const router = express.Router();
  const { placeOrder, getMyOrders, getOrder, cancelOrder, getSellerOrders, updateOrderStatus, getSellerAnalytics } = require('../controllers/orderController');
  const { protect, sellerOnly, buyerOnly } = require('../middleware/authMiddleware');

  router.post('/', protect, buyerOnly, placeOrder);
  router.get('/my', protect, buyerOnly, getMyOrders);
  router.get('/seller', protect, sellerOnly, getSellerOrders);
  router.get('/seller/analytics', protect, sellerOnly, getSellerAnalytics);
  router.get('/:id', protect, getOrder);
  router.put('/:id/cancel', protect, buyerOnly, cancelOrder);
  router.put('/:id/status', protect, sellerOnly, updateOrderStatus);
  return router;
})();
