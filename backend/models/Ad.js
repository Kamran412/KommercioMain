const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adTitle: { type: String, required: true },
    budget: { type: Number, required: true, min: 1 },
    remainingBudget: { type: Number, required: true },
    clicks: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    targetAudience: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ad", adSchema);
