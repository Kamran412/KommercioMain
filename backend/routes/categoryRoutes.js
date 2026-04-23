const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

const CATEGORIES = [
  { name: 'Electronics', icon: '📱', sub: ['Mobile Phones', 'Laptops', 'Tablets', 'Cameras', 'Audio', 'TVs'] },
  { name: 'Fashion', icon: '👗', sub: ["Men's Clothing", "Women's Clothing", 'Kids', 'Footwear', 'Accessories'] },
  { name: 'Home & Kitchen', icon: '🏠', sub: ['Furniture', 'Appliances', 'Decor', 'Bedding', 'Kitchen'] },
  { name: 'Books', icon: '📚', sub: ['Fiction', 'Non-Fiction', 'Academic', 'Comics', 'Magazines'] },
  { name: 'Sports', icon: '⚽', sub: ['Fitness', 'Outdoor', 'Team Sports', 'Water Sports', 'Cycling'] },
  { name: 'Beauty', icon: '💄', sub: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Personal Care'] },
  { name: 'Toys', icon: '🧸', sub: ['Action Figures', 'Board Games', 'Educational', 'Outdoor', 'Baby Toys'] },
  { name: 'Grocery', icon: '🛒', sub: ['Fruits & Vegetables', 'Dairy', 'Snacks', 'Beverages', 'Staples'] },
  { name: 'Automotive', icon: '🚗', sub: ['Car Accessories', 'Bike Accessories', 'Tools', 'Parts'] },
  { name: 'Health', icon: '💊', sub: ['Supplements', 'Medical Devices', 'Wellness', 'Baby Care'] },
];

router.get('/', asyncHandler(async (req, res) => {
  const counts = await Promise.all(
    CATEGORIES.map(cat => Product.countDocuments({ category: cat.name, isActive: true }))
  );
  const categories = CATEGORIES.map((cat, i) => ({ ...cat, productCount: counts[i] }));
  res.json({ success: true, categories });
}));

module.exports = router;
