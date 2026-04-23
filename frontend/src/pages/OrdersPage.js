import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiArrowLeft, FiTruck, FiCheck, FiX, FiClock } from 'react-icons/fi';
import BuyerNavbar from '../components/shared/BuyerNavbar';
import { useOrderStore } from '../store';

const STATUS_CONFIG = {
  placed:           { color: '#f59e0b', bg: '#fef3c7', icon: <FiClock />,   label: 'Order Placed' },
  confirmed:        { color: '#6c63ff', bg: '#ede9fe', icon: <FiCheck />,   label: 'Confirmed' },
  processing:       { color: '#0ea5e9', bg: '#e0f2fe', icon: <FiClock />,   label: 'Processing' },
  shipped:          { color: '#8b5cf6', bg: '#f5f3ff', icon: <FiTruck />,   label: 'Shipped' },
  out_for_delivery: { color: '#f59e0b', bg: '#fef3c7', icon: <FiTruck />,   label: 'Out for Delivery' },
  delivered:        { color: '#22c55e', bg: '#dcfce7', icon: <FiCheck />,   label: 'Delivered' },
  cancelled:        { color: '#ef4444', bg: '#fee2e2', icon: <FiX />,       label: 'Cancelled' },
  returned:         { color: '#6b7280', bg: '#f3f4f6', icon: <FiX />,       label: 'Returned' },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders, loading, fetchMyOrders, cancelOrder } = useOrderStore();
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchMyOrders(); }, []);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5ff' }}>
      <BuyerNavbar />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button onClick={() => navigate('/shop')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c63ff', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <FiArrowLeft /> Back
          </button>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: '#1a1a3a' }}>My Orders</span>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {['all', 'placed', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '8px 18px', borderRadius: 99, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: filter === f ? '#6c63ff' : '#fff', color: filter === f ? '#fff' : '#555', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textTransform: 'capitalize' }}>
              {f === 'all' ? 'All Orders' : STATUS_CONFIG[f]?.label || f}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <div className="spinner" style={{ borderTopColor: '#6c63ff', width: 50, height: 50 }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, background: '#fff', borderRadius: 20 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
            <div style={{ fontFamily: "'Syne'", fontSize: 22, fontWeight: 800, color: '#1a1a3a', marginBottom: 8 }}>No orders yet</div>
            <div style={{ color: '#888', marginBottom: 24 }}>Start shopping to see your orders here</div>
            <button onClick={() => navigate('/shop')} className="btn btn-primary">Shop Now</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map((order, i) => {
              const sc = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.placed;
              return (
                <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Order ID</div>
                      <div style={{ fontFamily: "'Syne'", fontWeight: 700, fontSize: 15, color: '#1a1a3a' }}>#{order._id.slice(-8).toUpperCase()}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, background: sc.bg, color: sc.color, fontSize: 13, fontWeight: 700 }}>
                        {sc.icon} {sc.label}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, color: '#888' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      <div style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: 18, color: '#1a1a3a' }}>₹{order.totalPrice?.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                    {order.orderItems?.slice(0, 3).map((item, j) => (
                      <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'center', background: '#f8f8ff', borderRadius: 10, padding: '8px 12px' }}>
                        <img src={item.product?.images?.[0]?.url || item.image || 'https://via.placeholder.com/40'} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a3a', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                          <div style={{ fontSize: 12, color: '#888' }}>Qty: {item.quantity}</div>
                        </div>
                      </div>
                    ))}
                    {order.orderItems?.length > 3 && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 60, height: 56, background: '#f0f0f8', borderRadius: 10, color: '#6c63ff', fontWeight: 700, fontSize: 13 }}>
                        +{order.orderItems.length - 3}
                      </div>
                    )}
                  </div>

                  {/* Payment */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: '#888' }}>
                      Payment: <strong style={{ color: '#333', textTransform: 'uppercase' }}>{order.paymentMethod}</strong>
                      {order.trackingNumber && <span style={{ marginLeft: 12 }}>Tracking: <strong>{order.trackingNumber}</strong></span>}
                    </span>
                    {['placed', 'confirmed'].includes(order.orderStatus) && (
                      <button onClick={() => cancelOrder(order._id, 'Cancelled by buyer').then(() => fetchMyOrders())}
                        style={{ padding: '7px 18px', background: '#fee2e2', border: 'none', borderRadius: 8, color: '#ef4444', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                        Cancel Order
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
