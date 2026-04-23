const Ad = require("../models/Ad");
const Product = require("../models/Product");

// Create Ad
exports.createAd = async (req, res) => {
  try {
    const { productId, adTitle, budget, duration, targetAudience } = req.body;
    if (!productId || !adTitle || !budget || !duration) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }
    if (budget <= 0) {
      return res.status(400).json({ success: false, message: "Budget must be greater than 0" });
    }
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + Number(duration));
    const ad = await Ad.create({
      productId,
      sellerId: req.user._id,
      adTitle,
      budget,
      remainingBudget: budget,
      startDate,
      endDate,
      targetAudience,
    });
    res.status(201).json({ success: true, ad });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Active Ads (for homepage)
exports.getActiveAds = async (req, res) => {
  try {
    const now = new Date();
    const ads = await Ad.find({
      isActive: true,
      remainingBudget: { $gt: 0 },
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).populate("productId");
    res.json({ success: true, ads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Track Click
exports.trackClick = async (req, res) => {
  try {
    const { adId } = req.params;
    const ad = await Ad.findById(adId);
    if (!ad || !ad.isActive)
      return res.status(404).json({ success: false, message: "Ad not found" });
    ad.clicks += 1;
    ad.remainingBudget -= 1; // ₹1 per click
    if (ad.remainingBudget <= 0) {
      ad.isActive = false;
      ad.remainingBudget = 0;
    }
    await ad.save();
    res.json({ success: true, clicks: ad.clicks, remainingBudget: ad.remainingBudget });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Track Impression
exports.trackImpression = async (req, res) => {
  try {
    const { adId } = req.params;
    const ad = await Ad.findById(adId);
    if (!ad || !ad.isActive)
      return res.status(404).json({ success: false, message: "Ad not found" });
    ad.impressions += 1;
    await ad.save();
    res.json({ success: true, impressions: ad.impressions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Seller's Ads — /api/ads/my
exports.getSellerAds = async (req, res) => {
  try {
    console.log("req.user:", req.user);        // ✅ Debug log
    console.log("sellerId:", req.user?._id);   // ✅ Debug log
    const ads = await Ad.find({ sellerId: req.user._id }).populate("productId");
    console.log("ads found:", ads.length);     // ✅ Debug log
    res.json({ success: true, ads });
  } catch (err) {
    console.error("getSellerAds error:", err); // ✅ Debug log
    res.status(500).json({ success: false, message: err.message });
  }
};