const express = require("express");
const router = express.Router();
const {
  createAd,
  getActiveAds,
  trackClick,
  trackImpression,
  getSellerAds,
} = require("../controllers/adController");
const { protect, sellerOnly } = require("../middleware/authMiddleware");

// ✅ /my pehle hona chahiye — warna /:adId match karega
router.get("/my", protect, sellerOnly, getSellerAds);
router.get("/active", getActiveAds);
router.post("/", protect, sellerOnly, createAd);
router.post("/:adId/click", trackClick);
router.post("/:adId/impression", trackImpression);

module.exports = router;