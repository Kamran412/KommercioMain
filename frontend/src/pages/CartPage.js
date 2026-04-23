import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import BuyerNavbar from '../components/shared/BuyerNavbar';
import { useCartStore } from '../store';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, total, loading, fetchCart, removeItem, updateQty } = useCartStore();

  useEffect(() => { fetchCart(); }, []);

  const shipping = total >= 499 ? 0 : 40;
  const tax = Math.round(total * 0.05);
  const grandTotal = total + shipping + tax;

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f5f5ff' }}>
      <BuyerNavbar />
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner" style={{ borderTopColor: '#6c63ff', width: 50, height: 50 }} /></div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5ff' }}>
      <BuyerNavbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <button onClick={() => navigate('/shop')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c63ff', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <FiArrowLeft /> Continue Shopping
          </button>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: '#1a1a3a' }}>
            My Cart {items.length > 0 && <span style={{ fontSize: 16, color: '#888' }}>({items.length} items)</span>}
          </span>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: 20 }}>
            <div style={{ fontSize: 80, marginBottom: 16 }}>🛒</div>
            <div style={{ fontFamily: "'Syne'", fontSize: 24, fontWeight: 800, color: '#1a1a3a', marginBottom: 8 }}>Your cart is empty</div>
            <div style={{ color: '#888', marginBottom: 28 }}>Add items to get started</div>
            <button onClick={() => navigate('/shop')} className="btn btn-primary">Start Shopping</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map((item, i) => (
                <motion.div key={item._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  style={{ background: '#fff', borderRadius: 16, padding: 20, display: 'flex', gap: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <div style={{ width: 100, height: 100, borderRadius: 12, overflow: 'hidden', background: '#f8f8ff', flexShrink: 0 }}>
                    <img src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/100'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a3a', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product?.name}</div>
                    <div style={{ fontSize: 12, color: '#6c63ff', fontWeight: 600, marginBottom: 8 }}>{item.product?.seller?.shopName}</div>
                    {item.variant && <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{item.variant}</div>}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#1a1a3a' }}>₹{(item.product?.price * item.quantity)?.toLocaleString('en-IN')}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
                          <button onClick={() => updateQty(item._id, item.quantity - 1)} style={{ width: 34, height: 34, border: 'none', background: '#f5f5ff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiMinus size={12} /></button>
                          <span style={{ width: 38, textAlign: 'center', fontWeight: 700, fontSize: 15 }}>{item.quantity}</span>
                          <button onClick={() => updateQty(item._id, item.quantity + 1)} style={{ width: 34, height: 34, border: 'none', background: '#f5f5ff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiPlus size={12} /></button>
                        </div>
                        <button onClick={() => removeItem(item._id)} style={{ width: 34, height: 34, border: '1.5px solid #fee', background: '#fff', borderRadius: 8, cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ position: 'sticky', top: 80, height: 'fit-content' }}>
              <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: '#1a1a3a', marginBottom: 20 }}>Order Summary</div>

                {[
                  ['Subtotal', `₹${total.toLocaleString('en-IN')}`],
                  ['Shipping', shipping === 0 ? <span style={{ color: '#22c55e' }}>FREE</span> : `₹${shipping}`],
                  ['Tax (5%)', `₹${tax.toLocaleString('en-IN')}`],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 15, color: '#555' }}>
                    <span>{label}</span><span style={{ fontWeight: 600 }}>{value}</span>
                  </div>
                ))}

                {total < 499 && (
                  <div style={{ background: 'rgba(108,99,255,0.08)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#6c63ff', fontWeight: 600 }}>
                    Add ₹{(499 - total).toLocaleString('en-IN')} more for FREE shipping!
                  </div>
                )}

                <div style={{ height: 1, background: '#eee', margin: '16px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18 }}>Total</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, color: '#1a1a3a' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/checkout')}
                  style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 14, fontSize: 17, fontWeight: 800, cursor: 'pointer', fontFamily: "'Syne', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 30px rgba(108,99,255,0.4)' }}>
                  <FiShoppingBag /> Proceed to Checkout
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
