const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview, getFeatured, getMyProducts } = require('../controllers/productController');
const { protect, sellerOnly, buyerOnly } = require('../middleware/authMiddleware');

router.get('/featured', getFeatured);
router.get('/my-products', protect, sellerOnly, getMyProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, sellerOnly, createProduct);
router.put('/:id', protect, sellerOnly, updateProduct);
router.delete('/:id', protect, sellerOnly, deleteProduct);
router.post('/:id/reviews', protect, buyerOnly, addReview);

module.exports = router;
