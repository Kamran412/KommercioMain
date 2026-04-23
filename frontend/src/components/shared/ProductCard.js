import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar, FiZap } from 'react-icons/fi';
import { useCartStore, useAuthStore } from '../../store';
import toast from 'react-hot-toast';

export default function ProductCard({ product, layout = 'grid' }) {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { toggleWishlist, user } = useAuthStore();
  const [wishlisted, setWishlisted] = useState(
    user?.wishlist?.includes(product._id)
  );
  const [adding, setAdding] = useState(false);

  const handleCart = async (e) => {
    e.stopPropagation();
    setAdding(true);
    await addToCart(product._id, 1);
    setTimeout(() => setAdding(false), 600);
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    setWishlisted(v => !v);
    await toggleWishlist(product._id);
  };

  const img = product.images?.[0]?.url || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400`;

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}
      transition={{ type: 'spring', stiffness: 300 }}
      onClick={() => navigate(`/product/${product._id}`)}
      style={{
        background: '#fff',
        borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        position: 'relative',
      }}
    >
      {/* Discount Badge */}
      {product.discountPercent > 0 && (
        <div style={{
          position: 'absolute', top: 10, left: 10, zIndex: 2,
          background: '#ff6b35', color: '#fff', borderRadius: 6, padding: '3px 8px',
          fontSize: 12, fontWeight: 700,
        }}>
          -{product.discountPercent}%
        </div>
      )}

      {/* Wishlist */}
      <button
        onClick={handleWishlist}
        style={{
          position: 'absolute', top: 10, right: 10, zIndex: 2,
          width: 34, height: 34, borderRadius: '50%', border: 'none',
          background: wishlisted ? '#ff6b35' : 'rgba(255,255,255,0.9)',
          color: wishlisted ? '#fff' : '#999',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', backdropFilter: 'blur(4px)',
          transition: 'all 0.2s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <FiHeart size={14} fill={wishlisted ? '#fff' : 'none'} />
      </button>

      {/* Image */}
      <div style={{ height: 200, overflow: 'hidden', background: '#f8f8ff' }}>
        <img
          src={img} alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          onError={e => e.target.src = 'https://via.placeholder.com/400x300?text=Product'}
        />
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px' }}>
        {/* Seller */}
        {product.seller?.shopName && (
          <div style={{ fontSize: 11, color: '#6c63ff', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {product.seller.shopName}
          </div>
        )}

        {/* Name */}
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a3a', lineHeight: 1.4, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.name}
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#22c55e', color: '#fff', borderRadius: 5, padding: '2px 7px', fontSize: 12, fontWeight: 700 }}>
            <FiStar size={10} fill="#fff" /> {product.ratings || '0'}
          </div>
          <span style={{ color: '#999', fontSize: 12 }}>({product.numReviews || 0})</span>
          {product.freeDelivery && <span style={{ color: '#6c63ff', fontSize: 11, fontWeight: 600, marginLeft: 4 }}>FREE Delivery</span>}
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: '#1a1a3a' }}>
            ₹{product.price?.toLocaleString('en-IN')}
          </span>
          {product.originalPrice > product.price && (
            <span style={{ color: '#999', textDecoration: 'line-through', fontSize: 13 }}>
              ₹{product.originalPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={handleCart} disabled={adding || product.stock === 0}
          style={{
            width: '100%', padding: '10px', border: 'none', borderRadius: 10,
            background: product.stock === 0 ? '#eee' : adding ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
            color: product.stock === 0 ? '#999' : '#fff',
            fontSize: 14, fontWeight: 700, cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            transition: 'all 0.2s',
          }}
        >
          {product.stock === 0 ? 'Out of Stock' : adding ? '✓ Added!' : <><FiShoppingCart size={14} /> Add to Cart</>}
        </motion.button>
      </div>
    </motion.div>
  );
}
