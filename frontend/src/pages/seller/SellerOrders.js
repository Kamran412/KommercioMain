import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPackage } from 'react-icons/fi';
import SellerSidebar from '../../components/seller/SellerSidebar';
import { useOrderStore } from '../../store';

const STATUS_OPTIONS = ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
const STATUS_COLOR = { placed: '#f59e0b', confirmed: '#6c63ff', processing: '#0ea5e9', shipped: '#8b5cf6', out_for_delivery: '#f59e0b', delivered: '#22c55e', cancelled: '#ef4444' };

export default function SellerOrders() {
  const { sellerOrders, fetchSellerOrders, updateStatus, loading } = useOrderStore();
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  useEffect(() => { fetchSellerOrders({ limit: 50 }); }, []);

  const filtered = filter === 'all' ? sellerOrders : sellerOrders.filter(o => o.orderStatus === filter);

  const handleStatus = async (orderId, status) => {
    setUpdating(orderId);
    await updateStatus(orderId, status);
    await fetchSellerOrders({ limit: 50 });
    setUpdating(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f0f8', display: 'flex' }}>
      <SellerSidebar active="/seller/orders" />
      <div style={{ marginLeft: 240, flex: 1, padding: '32px' }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: '#1a1a3a', marginBottom: 24 }}>
          Orders <span style={{ color: '#888', fontFamily: 'DM Sans', fontWeight: 400, fontSize: 16 }}>({sellerOrders.length})</span>
        </h1>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {['all', 'placed', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '8px 18px', borderRadius: 99, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: filter === f ? '#6c63ff' : '#fff', color: filter === f ? '#fff' : '#555', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textTransform: 'capitalize' }}>
              {f === 'all' ? 'All' : f.replace(/_/g, ' ')}
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
            <div style={{ fontFamily: "'Syne'", fontSize: 20, fontWeight: 800, color: '#1a1a3a' }}>No orders found</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map((order, i) => (
              <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: 16, color: '#1a1a3a' }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </div>
                    <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 14, color: '#555' }}>
                      Buyer: <strong>{order.buyer?.username}</strong> · {order.buyer?.mobile}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Syne'", fontWeight: 900, fontSize: 22, color: '#1a1a3a' }}>₹{order.totalPrice?.toLocaleString('en-IN')}</div>
                    <span style={{ display: 'inline-block', marginTop: 6, padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: (STATUS_COLOR[order.orderStatus] || '#888') + '20', color: STATUS_COLOR[order.orderStatus] || '#888', textTransform: 'capitalize' }}>
                      {order.orderStatus?.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                  {order.orderItems?.map((item, j) => (
                    <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'center', background: '#f8f8ff', borderRadius: 10, padding: '8px 12px' }}>
                      <img src={item.product?.images?.[0]?.url || item.image || 'https://via.placeholder.com/40'} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>Qty: {item.quantity} · ₹{(item.price * item.quantity)?.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Address */}
                <div style={{ background: '#f8f8ff', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#555' }}>
                  📍 {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                </div>

                {/* Update Status */}
                {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Update Status:</span>
                    {STATUS_OPTIONS.filter(s => s !== order.orderStatus).slice(0, 3).map(s => (
                      <button key={s} onClick={() => handleStatus(order._id, s)} disabled={updating === order._id}
                        style={{ padding: '7px 16px', borderRadius: 8, border: `1.5px solid ${STATUS_COLOR[s] || '#ddd'}`, background: 'transparent', color: STATUS_COLOR[s] || '#555', cursor: 'pointer', fontSize: 13, fontWeight: 600, textTransform: 'capitalize', opacity: updating === order._id ? 0.6 : 1 }}>
                        {updating === order._id ? '...' : s.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
