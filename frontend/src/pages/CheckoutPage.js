import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiCreditCard, FiCheck, FiArrowLeft } from 'react-icons/fi';
import BuyerNavbar from '../components/shared/BuyerNavbar';
import { useCartStore, useOrderStore, useAuthStore } from '../store';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, fetchCart } = useCartStore();
  const { placeOrder, loading } = useOrderStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [addr, setAddr] = useState({ street: '', city: '', state: '', pincode: '', mobile: user?.mobile || '' });
  const [payMethod, setPayMethod] = useState('cod');

  useEffect(() => { fetchCart(); }, []);

  const shipping = total >= 499 ? 0 : 40;
  const tax = Math.round(total * 0.05);
  const grandTotal = total + shipping + tax;

  const handleOrder = async () => {
    const res = await placeOrder({
      orderItems: items.map(i => ({ product: i.product._id, quantity: i.quantity, variant: i.variant })),
      shippingAddress: addr,
      paymentMethod: payMethod,
    });
    if (res.success) navigate('/orders');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5ff' }}>
      <BuyerNavbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <button onClick={() => navigate('/cart')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c63ff', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <FiArrowLeft /> Back to Cart
          </button>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: '#1a1a3a' }}>Checkout</span>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32, background: '#fff', borderRadius: 16, padding: '16px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {['Delivery Address', 'Payment Method', 'Order Summary'].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => i + 1 < step && setStep(i + 1)}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: step > i + 1 ? '#22c55e' : step === i + 1 ? '#6c63ff' : '#eee', color: step > i + 1 || step === i + 1 ? '#fff' : '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, transition: 'all 0.3s' }}>
                  {step > i + 1 ? <FiCheck size={14} /> : i + 1}
                </div>
                <span style={{ fontSize: 14, fontWeight: step === i + 1 ? 700 : 400, color: step === i + 1 ? '#1a1a3a' : '#888' }}>{s}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? '#22c55e' : '#eee', margin: '0 12px', transition: 'all 0.3s' }} />}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
          <div>
            {/* Step 1: Address */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <FiMapPin color="#6c63ff" size={20} />
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800 }}>Delivery Address</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { k: 'street', l: 'Street Address', col: 2 },
                    { k: 'city', l: 'City' },
                    { k: 'state', l: 'State' },
                    { k: 'pincode', l: 'Pincode' },
                    { k: 'mobile', l: 'Mobile Number' },
                  ].map(f => (
                    <div key={f.k} style={{ gridColumn: f.col === 2 ? '1 / -1' : 'auto' }}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>{f.l}</label>
                      <input className="input" style={{ background: '#f8f8ff', color: '#1a1a3a', border: '1.5px solid #e0e0f0' }}
                        value={addr[f.k]} onChange={e => setAddr(a => ({ ...a, [f.k]: e.target.value }))} placeholder={f.l} />
                    </div>
                  ))}
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(2)} disabled={!addr.street || !addr.city || !addr.pincode}
                  style={{ marginTop: 24, width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: "'Syne', sans-serif" }}>
                  Continue to Payment →
                </motion.button>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <FiCreditCard color="#6c63ff" size={20} />
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800 }}>Payment Method</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { value: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive your order' },
                    { value: 'upi', label: 'UPI / GPay / PhonePe', icon: '📱', desc: 'Pay instantly with UPI' },
                    { value: 'stripe', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay accepted' },
                  ].map(pm => (
                    <label key={pm.value} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', border: `2px solid ${payMethod === pm.value ? '#6c63ff' : '#eee'}`, borderRadius: 14, cursor: 'pointer', background: payMethod === pm.value ? 'rgba(108,99,255,0.04)' : '#fff', transition: 'all 0.2s' }}>
                      <input type="radio" name="payment" value={pm.value} checked={payMethod === pm.value} onChange={() => setPayMethod(pm.value)} style={{ display: 'none' }} />
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f5f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{pm.icon}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a3a' }}>{pm.label}</div>
                        <div style={{ fontSize: 13, color: '#888' }}>{pm.desc}</div>
                      </div>
                      {payMethod === pm.value && <div style={{ marginLeft: 'auto', width: 24, height: 24, borderRadius: '50%', background: '#6c63ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12 }}><FiCheck /></div>}
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button onClick={() => setStep(1)} style={{ flex: 1, padding: '14px', background: '#f5f5ff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>← Back</button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setStep(3)}
                    style={{ flex: 2, padding: '14px', background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: "'Syne'" }}>
                    Review Order →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Review Your Order</div>
                {items.map(item => (
                  <div key={item._id} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <img src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/60'} alt="" style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover', background: '#f8f8ff' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a3a' }}>{item.product?.name}</div>
                      <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>Qty: {item.quantity}</div>
                    </div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17 }}>₹{(item.product?.price * item.quantity)?.toLocaleString('en-IN')}</div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button onClick={() => setStep(2)} style={{ flex: 1, padding: '14px', background: '#f5f5ff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>← Back</button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleOrder} disabled={loading}
                    style={{ flex: 2, padding: '14px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Syne'", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {loading ? <div className="spinner" style={{ width: 20, height: 20 }} /> : '✓ Place Order'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Price Summary */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: 'fit-content', position: 'sticky', top: 80 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Price Details</div>
            {[['Items', `₹${total.toLocaleString('en-IN')}`], ['Shipping', shipping === 0 ? 'FREE ✓' : `₹${shipping}`], ['Tax', `₹${tax}`]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 15, color: '#555' }}>
                <span>{k}</span><span style={{ fontWeight: 600, color: v === 'FREE ✓' ? '#22c55e' : undefined }}>{v}</span>
              </div>
            ))}
            <div style={{ height: 1, background: '#eee', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17 }}>Total</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22 }}>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
