const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config({ path: '../.env' });

const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kommercio');

const PLACEHOLDER_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', public_id: 'watch1' },
  { url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400', public_id: 'camera1' },
  { url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400', public_id: 'beauty1' },
  { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', public_id: 'shoes1' },
  { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', public_id: 'headphones1' },
  { url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400', public_id: 'sport1' },
  { url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400', public_id: 'laptop1' },
  { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400', public_id: 'phone1' },
];

const seedDB = async () => {
  try {
    console.log('🗑️  Clearing existing data...');
    await Promise.all([User.deleteMany(), Product.deleteMany(), Cart.deleteMany(), Order.deleteMany()]);

    console.log('👤 Creating users...');
    const salt = await bcrypt.genSalt(12);

    // Admin
    const admin = await User.create({
      role: 'buyer', username: 'admin', email: 'admin@kommercio.com',
      mobile: '9000000000', password: 'Admin@123',
    });

    // Demo Buyer
    const buyer = await User.create({
      role: 'buyer', username: 'demo_buyer', email: 'buyer@kommercio.com',
      mobile: '9111111111', password: 'Buyer@123',
    });

    // Demo Sellers
    const seller1 = await User.create({
      role: 'seller', shopName: 'TechZone Store', mobile: '9222222222',
      password: 'Seller@123', shopDescription: 'Best electronics at best prices!',
      shopCategory: 'Electronics', isVerifiedSeller: true,
    });
    const seller2 = await User.create({
      role: 'seller', shopName: 'FashionHub', mobile: '9333333333',
      password: 'Seller@123', shopDescription: 'Trendy fashion for everyone',
      shopCategory: 'Fashion', isVerifiedSeller: true,
    });
    const seller3 = await User.create({
      role: 'seller', shopName: 'HomeEssentials', mobile: '9444444444',
      password: 'Seller@123', shopDescription: 'Everything for your home',
      shopCategory: 'Home & Kitchen',
    });

    // Create carts
    await Cart.create({ user: buyer._id, items: [] });
    await Cart.create({ user: admin._id, items: [] });

    console.log('📦 Creating products...');
    const products = [
      { seller: seller1._id, name: 'Premium Wireless Headphones', category: 'Electronics', subcategory: 'Audio', price: 2999, originalPrice: 5999, brand: 'SoundMax', stock: 50, isFeatured: true, images: [PLACEHOLDER_IMAGES[4]], description: 'Crystal clear sound with 40hr battery life. Noise cancelling technology for immersive experience.', tags: ['wireless', 'headphones', 'audio'], freeDelivery: true },
      { seller: seller1._id, name: 'Smartphone Pro Max 256GB', category: 'Electronics', subcategory: 'Mobile Phones', price: 45999, originalPrice: 54999, brand: 'TechBrand', stock: 25, isFeatured: true, images: [PLACEHOLDER_IMAGES[7]], description: '6.7" AMOLED display, 108MP camera, 5G enabled. The phone you always wanted.', tags: ['smartphone', '5g', 'mobile'], freeDelivery: true },
      { seller: seller1._id, name: 'Laptop Ultra Slim 16GB', category: 'Electronics', subcategory: 'Laptops', price: 58999, originalPrice: 69999, brand: 'UltraBook', stock: 15, isFeatured: true, images: [PLACEHOLDER_IMAGES[6]], description: 'Intel i7, 16GB RAM, 512GB SSD. Perfect for work and entertainment.', tags: ['laptop', 'slim', 'ultrabook'], freeDelivery: true },
      { seller: seller1._id, name: 'Digital Camera 24MP', category: 'Electronics', subcategory: 'Cameras', price: 18999, originalPrice: 24999, brand: 'SnapPro', stock: 20, images: [PLACEHOLDER_IMAGES[1]], description: '24MP sensor, 4K video recording, WiFi connectivity. Capture memories perfectly.', tags: ['camera', 'photography', 'dslr'] },
      { seller: seller1._id, name: 'Smart Watch Series 5', category: 'Electronics', subcategory: 'Wearables', price: 8999, originalPrice: 12999, brand: 'TimeX', stock: 40, isFeatured: true, images: [PLACEHOLDER_IMAGES[0]], description: 'Health tracking, GPS, 7-day battery. Your fitness companion.', tags: ['smartwatch', 'fitness', 'wearable'], freeDelivery: true },
      { seller: seller2._id, name: 'Running Shoes Pro', category: 'Fashion', subcategory: 'Footwear', price: 2499, originalPrice: 3999, brand: 'SpeedRun', stock: 100, isFeatured: true, images: [PLACEHOLDER_IMAGES[3]], description: 'Lightweight running shoes with superior cushioning. Available in multiple colors.', tags: ['shoes', 'running', 'sport'], variants: [{ name: 'Size', options: ['6', '7', '8', '9', '10', '11'] }, { name: 'Color', options: ['Black', 'White', 'Blue', 'Red'] }] },
      { seller: seller2._id, name: 'Premium Perfume Collection', category: 'Beauty', subcategory: 'Fragrances', price: 1499, originalPrice: 2499, brand: 'LuxScent', stock: 80, images: [PLACEHOLDER_IMAGES[2]], description: 'Long-lasting premium fragrance. 100ml bottle. Perfect gift.', tags: ['perfume', 'fragrance', 'gift'] },
      { seller: seller3._id, name: 'Sports Fitness Set', category: 'Sports', subcategory: 'Fitness', price: 3499, originalPrice: 4999, brand: 'FitPro', stock: 35, images: [PLACEHOLDER_IMAGES[5]], description: 'Complete home workout set. Resistance bands, dumbbells, yoga mat included.', tags: ['fitness', 'gym', 'workout'], freeDelivery: true },
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('\n🎉 Seed complete!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST CREDENTIALS:');
    console.log('  Buyer  → mobile: 9111111111 | pass: Buyer@123');
    console.log('  Seller1→ mobile: 9222222222 | pass: Seller@123  (TechZone Store)');
    console.log('  Seller2→ mobile: 9333333333 | pass: Seller@123  (FashionHub)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedDB();
