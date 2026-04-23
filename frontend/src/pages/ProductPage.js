import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart, FiHeart, FiTruck, FiShield, FiRefreshCw, FiArrowLeft, FiMinus, FiPlus } from 'react-icons/fi';
import BuyerNavbar from '../components/shared/BuyerNavbar';
import { useProductStore, useCartStore, useAuthStore } from '../store';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, fetchProduct } = useProductStore();
  const { addToCart } = useCartStore();
  const { toggleWishlist, user } = useAuthStore();
  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [wishlisted, setWishlisted] = useState(false);
  const [tab, setTab] = useState('description');

  useEffect(() => { fetchProduct(id); }, [id]);
  useEffect(() => { if (product && user) setWishlisted(user?.wishlist?.includes(product._id)); }, [product, user]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f5f5ff' }}>
      <BuyerNavbar />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner" style={{ borderTopColor: '#6c63ff', width: 50, height: 50 }} />
      </div>
    </div>
  );

  if (!product) return null;

  const img = product.images?.[selectedImg]?.url || 'https://via.placeholder.com/500';

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5ff' }}>
      <BuyerNavbar />

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '24px 20px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 14, color: '#888' }}>
          <button onClick={() => navigate('/shop')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#6c63ff', fontWeight: 600 }}>
            <FiArrowLeft size={14} /> Back to Shop
          </button>
          <span>/</span><span>{product.category}</span>
          <span>/</span><span style={{ color: '#333' }}>{product.name?.slice(0, 30)}...</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          {/* Images */}
          <div>
            <motion.div whileHover={{ scale: 1.02 }} style={{ borderRadius: 16, overflow: 'hidden', background: '#f8f8ff', marginBottom: 16, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 20 }} />
            </motion.div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {product.images?.map((img, i) => (
                <button key={i} onClick={() => setSelectedImg(i)}
                  style={{ width: 70, height: 70, borderRadius: 10, overflow: 'hidden', border: `2px solid ${selectedImg === i ? '#6c63ff' : '#eee'}`, cursor: 'pointer', background: '#f8f8ff', padding: 0 }}>
                  <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            {/* Seller + Sponsored Badge */}
            {product.seller && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: '#6c63ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {product.seller.shopName}
                </span>
                {product.seller.isVerifiedSeller && (
                  <span style={{ background: '#22c55e', color: '#fff', borderRadius: 99, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>
                    ✓ Verified
                  </span>
                )}
                {/* ✅ Sponsored badge */}
                {product.isSponsored && (
                  <span style={{ background: '#fff7ed', color: '#c2410c', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, border: '1px solid #fed7aa' }}>
                    ⚡ Sponsored
                  </span>
                )}
              </div>
            )}

            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: '#1a1a3a', lineHeight: 1.3, marginBottom: 16 }}>{product.name}</h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#22c55e', color: '#fff', padding: '5px 12px', borderRadius: 8, fontSize: 15, fontWeight: 700 }}>
                <FiStar size={14} fill="#fff" /> {product.ratings || '0'}
              </div>
              <span style={{ color: '#888', fontSize: 14 }}>{product.numReviews} ratings</span>
              <span style={{ color: '#888', fontSize: 14 }}>|</span>
              <span style={{ color: '#22c55e', fontSize: 14, fontWeight: 600 }}>{product.sold || 0} sold</span>
            </div>

            {/* Price */}
            <div style={{ background: '#f8f8ff', borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 900, color: '#1a1a3a' }}>₹{product.price?.toLocaleString('en-IN')}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span style={{ color: '#999', textDecoration: 'line-through', fontSize: 18 }}>₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                    <span style={{ color: '#ff6b35', fontWeight: 700, fontSize: 16 }}>{product.discountPercent}% off</span>
                  </>
                )}
              </div>
              {product.freeDelivery && <div style={{ color: '#6c63ff', fontSize: 13, fontWeight: 600, marginTop: 6 }}>🚚 FREE Delivery</div>}
            </div>

            {/* Variants */}
            {product.variants?.map(v => (
              <div key={v.name} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#333', marginBottom: 8 }}>{v.name}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {v.options.map(opt => (
                    <button key={opt} onClick={() => setSelectedVariants(sv => ({ ...sv, [v.name]: opt }))}
                      style={{
                        padding: '7px 16px', borderRadius: 8, border: `1.5px solid`,
                        borderColor: selectedVariants[v.name] === opt ? '#6c63ff' : '#ddd',
                        background: selectedVariants[v.name] === opt ? 'rgba(108,99,255,0.08)' : '#fff',
                        color: selectedVariants[v.name] === opt ? '#6c63ff' : '#555',
                        cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Qty */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>Quantity:</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #ddd', borderRadius: 10, overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 38, height: 38, border: 'none', background: '#f5f5ff', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiMinus /></button>
                <span style={{ width: 44, textAlign: 'center', fontWeight: 700, fontSize: 16 }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ width: 38, height: 38, border: 'none', background: '#f5f5ff', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiPlus /></button>
              </div>
              <span style={{ fontSize: 13, color: product.stock < 10 ? '#ef4444' : '#22c55e', fontWeight: 600 }}>
                {product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? `Only ${product.stock} left` : 'In Stock'}
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => addToCart(product._id, qty)} disabled={product.stock === 0}
                style={{ flex: 1, padding: '14px', border: 'none', borderRadius: 12, background: 'linear-gradient(135deg, #ff9900, #ffb733)', color: '#333', fontSize: 16, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <FiShoppingCart /> Add to Cart
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => { addToCart(product._id, qty); navigate('/checkout'); }}
                disabled={product.stock === 0}
                style={{ flex: 1, padding: '14px', border: 'none', borderRadius: 12, background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)', color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>
                Buy Now
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={async () => { setWishlisted(v => !v); await toggleWishlist(product._id); }}
                style={{ width: 52, height: 52, border: `2px solid ${wishlisted ? '#ff6b35' : '#ddd'}`, borderRadius: 12, background: wishlisted ? 'rgba(255,107,53,0.08)' : '#fff', color: wishlisted ? '#ff6b35' : '#999', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                <FiHeart fill={wishlisted ? '#ff6b35' : 'none'} />
              </motion.button>
            </div>

            {/* Guarantees */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { icon: <FiTruck />, text: product.freeDelivery ? 'Free Delivery' : 'Fast Delivery' },
                { icon: <FiShield />, text: 'Secure Payment' },
                { icon: <FiRefreshCw />, text: product.returnPolicy || '7 Day Return' },
              ].map((g, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#f8f8ff', borderRadius: 10, fontSize: 12, color: '#555', fontWeight: 600 }}>
                  <span style={{ color: '#6c63ff' }}>{g.icon}</span> {g.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 32, marginTop: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #eee', marginBottom: 24 }}>
            {['description', 'specifications', 'reviews'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding: '12px 24px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: tab === t ? '#6c63ff' : '#888', borderBottom: `2px solid ${tab === t ? '#6c63ff' : 'transparent'}`, marginBottom: -2, textTransform: 'capitalize' }}>
                {t}
              </button>
            ))}
          </div>

          {tab === 'description' && <div style={{ color: '#444', lineHeight: 1.8, fontSize: 15 }}>{product.description}</div>}

          {tab === 'specifications' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {product.specifications?.map((s, i) => (
                <div key={i} style={{ display: 'flex', background: i % 2 === 0 ? '#f8f8ff' : '#fff', padding: '12px 16px', borderRadius: 8 }}>
                  <span style={{ fontWeight: 700, color: '#333', minWidth: 140 }}>{s.key}</span>
                  <span style={{ color: '#555' }}>{s.value}</span>
                </div>
              ))}
              {(!product.specifications || product.specifications.length === 0) && <div style={{ color: '#888' }}>No specifications added yet.</div>}
            </div>
          )}

          {tab === 'reviews' && (
            <div>
              {product.reviews?.length === 0 && <div style={{ color: '#888', textAlign: 'center', padding: 40 }}>No reviews yet. Be the first to review!</div>}
              {product.reviews?.map((r, i) => (
                <div key={i} style={{ padding: '20px 0', borderBottom: i < product.reviews.length - 1 ? '1px solid #eee' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>{r.name?.[0]?.toUpperCase()}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {[1,2,3,4,5].map(s => <FiStar key={s} size={12} fill={s <= r.rating ? '#ffd700' : 'none'} color={s <= r.rating ? '#ffd700' : '#ddd'} />)}
                      </div>
                    </div>
                  </div>
                  <div style={{ color: '#555', fontSize: 14, lineHeight: 1.6 }}>{r.comment}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}