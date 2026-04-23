# 🛒 Kommercio — Full Stack MERN E-Commerce Platform

> A production-grade e-commerce marketplace like Flipkart/Amazon built with MongoDB, Express, React, Node.js.

---

## 📁 Project Structure

```
kommercio/
├── backend/          ← Express + MongoDB API
│   ├── controllers/  ← Route handlers
│   ├── models/       ← Mongoose schemas
│   ├── routes/       ← API routes
│   ├── middleware/   ← Auth, error handling
│   ├── utils/        ← Seeder, helpers
│   ├── .env          ← Environment variables
│   └── server.js     ← Entry point
│
├── frontend/         ← React app
│   └── src/
│       ├── pages/
│       │   ├── LandingPage.js     ← Home with login/register
│       │   ├── BuyerDashboard.js  ← Amazon/Flipkart-style shop
│       │   ├── ProductPage.js     ← Product detail
│       │   ├── CartPage.js        ← Shopping cart
│       │   ├── CheckoutPage.js    ← Multi-step checkout
│       │   ├── OrdersPage.js      ← Order history
│       │   ├── WishlistPage.js    ← Saved products
│       │   └── seller/
│       │       ├── SellerDashboard.js   ← Analytics + charts
│       │       ├── SellerProducts.js    ← Product management
│       │       ├── SellerAddProduct.js  ← Add/edit product
│       │       ├── SellerOrders.js      ← Order management
│       │       └── SellerProfile.js     ← Shop settings
│       ├── components/
│       │   ├── shared/
│       │   │   ├── BuyerNavbar.js  ← Top navigation
│       │   │   └── ProductCard.js  ← Reusable card
│       │   └── seller/
│       │       └── SellerSidebar.js
│       ├── store.js   ← Zustand global state + API
│       └── App.js     ← Routes
│
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Install Dependencies
```bash
# From root directory
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment
Edit `backend/.env`:
```
MONGO_URI=mongodb://localhost:27017/kommercio
JWT_SECRET=your_secret_key_here
PORT=5000
CLIENT_URL=http://localhost:3000
```

### 3. Seed the Database (optional but recommended)
```bash
cd backend
node utils/seeder.js
```
This creates demo buyers, sellers, and products.

**Demo Credentials:**
| Role | Mobile | Password |
|------|--------|----------|
| Buyer | 9111111111 | Buyer@123 |
| Seller (TechZone) | 9222222222 | Seller@123 |
| Seller (FashionHub) | 9333333333 | Seller@123 |

### 4. Run Development Servers
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start
```

App runs at: **http://localhost:3000**
API runs at: **http://localhost:5000**

---

## 🔌 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register/buyer` | Register buyer |
| POST | `/api/auth/register/seller` | Register seller |
| POST | `/api/auth/login` | Login (buyer or seller) |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| POST | `/api/auth/wishlist/:id` | Toggle wishlist |

### Products
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products` | Get all products (with filters) |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/products/featured` | Featured products |
| POST | `/api/products` | Create product (seller) |
| PUT | `/api/products/:id` | Update product (seller) |
| DELETE | `/api/products/:id` | Delete product (seller) |
| POST | `/api/products/:id/reviews` | Add review (buyer) |

### Orders
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/orders` | Place order |
| GET | `/api/orders/my` | Buyer's orders |
| GET | `/api/orders/seller` | Seller's orders |
| PUT | `/api/orders/:id/cancel` | Cancel order |
| PUT | `/api/orders/:id/status` | Update status (seller) |

### Cart
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/cart` | Get cart |
| POST | `/api/cart/add` | Add item |
| PUT | `/api/cart/item/:id` | Update quantity |
| DELETE | `/api/cart/item/:id` | Remove item |
| DELETE | `/api/cart/clear` | Clear cart |

---

## ✨ Features

### Buyer Features
- 🏠 Amazon/Flipkart-style homepage with banner carousel
- 🔍 Search with filters (category, price, rating, sort)
- 🛍️ Product detail page with reviews, variants
- 🛒 Shopping cart with quantity management
- 📦 Multi-step checkout (address → payment → confirm)
- 📋 Order history with status tracking
- ❤️ Wishlist
- 👤 Profile management

### Seller Features
- 📊 Dashboard with revenue charts (Recharts)
- ➕ Add/Edit products with full form
- 🔄 Toggle product active/inactive
- 📦 Order management with status updates
- 🏪 Shop profile settings
- 📈 Revenue analytics (last 30 days)

### Backend Features
- 🔐 JWT Authentication
- 🛡️ Rate limiting (express-rate-limit)
- 🔒 Helmet security headers
- 📄 Pagination on all list endpoints
- 🌱 Database seeder with demo data
- 💳 Stripe payment intent ready
- ⭐ Product ratings & reviews
- 📦 Stock management

---

## 🚀 Production Deployment

### Backend (Railway / Render / VPS)
1. Set environment variables in dashboard
2. `npm start`

### Frontend (Vercel / Netlify)
1. `npm run build`
2. Deploy `build/` folder
3. Set `REACT_APP_API_URL` to your backend URL

### Database
- MongoDB Atlas (free tier available): https://mongodb.com/atlas

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| State | Zustand |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | React Icons |
| HTTP | Axios |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Security | Helmet, CORS, Rate Limiting |
| Payments | Stripe (ready) |

---

Made with ❤️ — Kommercio 2024
