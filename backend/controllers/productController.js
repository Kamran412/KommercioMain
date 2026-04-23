const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc  Get all products (with filters, search, pagination)
// @route GET /api/products
exports.getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, minPrice, maxPrice, rating, sort, page = 1, limit = 20, seller } = req.query;

  const query = { isActive: true };
  if (keyword) query.name = { $regex: keyword, $options: 'i' };
  if (category) query.category = category;
  if (seller)   query.seller = seller;
  if (minPrice || maxPrice) query.price = {};
  if (minPrice) query.price.$gte = Number(minPrice);
  if (maxPrice) query.price.$lte = Number(maxPrice);
  if (rating)   query.ratings = { $gte: Number(rating) };

  const sortOptions = {
    newest:     { createdAt: -1 },
    oldest:     { createdAt: 1 },
    price_asc:  { price: 1 },
    price_desc: { price: -1 },
    rating:     { ratings: -1 },
    popular:    { sold: -1 },
  };
  const sortBy = sortOptions[sort] || { createdAt: -1 };

  const skip = (page - 1) * limit;
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('seller', 'shopName shopLogo isVerifiedSeller')
    .sort(sortBy).skip(skip).limit(Number(limit));

  res.json({
    success: true,
    count: products.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    products,
  });
});

// @desc  Get single product
// @route GET /api/products/:id
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('seller', 'shopName shopLogo shopRating isVerifiedSeller totalSales')
    .populate('reviews.user', 'username avatar');
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, product });
});

// @desc  Create product (Seller)
// @route POST /api/products
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.seller = req.user._id;
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// @desc  Update product (Seller)
// @route PUT /api/products/:id
exports.updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  if (product.seller.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized to update this product');
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ success: true, product });
});

// @desc  Delete product (Seller)
// @route DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  if (product.seller.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }
  await product.deleteOne();
  res.json({ success: true, message: 'Product removed' });
});

// @desc  Add review
// @route POST /api/products/:id/reviews
exports.addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const alreadyReviewed = product.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) { res.status(400); throw new Error('Product already reviewed'); }

  product.reviews.push({ user: req.user._id, name: req.user.username, rating, comment });
  product.calcRatings();
  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
});

// @desc  Get featured products
// @route GET /api/products/featured
exports.getFeatured = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .populate('seller', 'shopName').limit(12);
  res.json({ success: true, products });
});

// @desc  Get seller's own products
// @route GET /api/products/my-products
exports.getMyProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, keyword } = req.query;
  const query = { seller: req.user._id };
  if (keyword) query.name = { $regex: keyword, $options: 'i' };
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json({ success: true, products, total, pages: Math.ceil(total / limit) });
});
