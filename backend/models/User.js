const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      required: true,
    },

    // ── Buyer fields
    username: {
      type: String,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    mobile: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    // ── Seller fields
    shopName: {
      type: String,
      trim: true,
    },
    shopDescription: { type: String, default: "" },
    shopLogo: { type: String, default: "" },
    shopBanner: { type: String, default: "" },
    shopCategory: { type: String, default: "General" },
    shopRating: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    isVerifiedSeller: { type: Boolean, default: false },

    // ── Common
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: { type: String, default: "" },
    address: [
      {
        label: String,
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: "India" },
        isDefault: { type: Boolean, default: false },
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// ── Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Compare password
userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

// ── Generate JWT
userSchema.methods.getSignedToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" } // ✅ Fixed: hardcoded string
  );
};

module.exports = mongoose.model("User", userSchema);
