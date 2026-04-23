import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { useProductStore, useAuthStore } from '../../store';
import SellerSidebar from '../../components/seller/SellerSidebar';
import { API } from '../../store';

export default function SellerProducts() {
  const { fetchProducts, products, loading, deleteProduct, updateProduct } = useProductStore();
  const { user } = useAuthStore();
  const [keyword, setKeyword] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchProducts({ seller: user?._id, keyword, limit: 50 }); }, [keyword, user]);

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setConfirmDelete(null);
    fetchProducts({ seller: user?._id, limit: 50 });
  };

  const toggleActive = async (product) => {
    await API.put(`/products/${product._id}`, { isActive: !product.isActive });
    fetchProducts({ seller: user?._id, limit: 50 });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f0f8', display: 'flex' }}>
      <SellerSidebar active="/seller/products" />
      <div style={{ marginLeft: 240, flex: 1, padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: '#1a1a3a' }}>
            My Products <span style={{ color: '#888', fontFamily: 'DM Sans', fontWeight: 400, fontSize: 16 }}>({products.length})</span>
          </h1>
          <Link to="/seller/products/add">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              <FiPlus /> Add Product
            </motion.button>
          </Link>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 24, maxWidth: 400 }}>
          <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Search products..."
            style={{ width: '100%', padding: '11px 14px 11px 42px', background: '#fff', border: '1.5px solid #e0e0f0', borderRadius: 12, color: '#1a1a3a', fontSize: 14, outline: 'none', fontFamily: 'DM Sans' }} />
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <div className="spinner" style={{ borderTopColor: '#6c63ff', width: 50, height: 50 }} />
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, background: '#fff', borderRadius: 20 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
            <div style={{ fontFamily: "'Syne'", fontSize: 22, fontWeight: 800, color: '#1a1a3a', marginBottom: 8 }}>No products yet</div>
            <div style={{ color: '#888', marginBottom: 24 }}>Start selling by adding your first product</div>
            <Link to="/seller/products/add"><button className="btn btn-primary">Add First Product</button></Link>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f8ff' }}>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    style={{ borderTop: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={p.images?.[0]?.url || 'https://via.placeholder.com/48'} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', background: '#f8f8ff' }} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a3a', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                          <div style={{ color: '#888', fontSize: 12 }}>{p.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#555' }}>{p.category}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: 16, color: '#1a1a3a' }}>₹{p.price?.toLocaleString('en-IN')}</div>
                      {p.originalPrice > p.price && <div style={{ color: '#888', textDecoration: 'line-through', fontSize: 12 }}>₹{p.originalPrice?.toLocaleString('en-IN')}</div>}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: p.stock < 10 ? '#ef4444' : p.stock < 20 ? '#f59e0b' : '#22c55e' }}>{p.stock}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button onClick={() => toggleActive(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 22, color: p.isActive ? '#22c55e' : '#ccc' }}>
                        {p.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                        <span style={{ fontSize: 12, color: p.isActive ? '#22c55e' : '#999' }}>{p.isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => navigate(`/seller/products/edit/${p._id}`)}
                          style={{ width: 34, height: 34, borderRadius: 8, border: '1.5px solid #ddd', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c63ff' }}>
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => setConfirmDelete(p._id)}
                          style={{ width: 34, height: 34, borderRadius: 8, border: '1.5px solid #fee', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Confirm Delete Modal */}
        {confirmDelete && (
          <div className="modal-overlay">
            <div style={{ background: '#fff', borderRadius: 20, padding: 32, maxWidth: 380, width: '100%', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
              <div style={{ fontFamily: "'Syne'", fontSize: 20, fontWeight: 800, color: '#1a1a3a', marginBottom: 8 }}>Delete Product?</div>
              <div style={{ color: '#888', marginBottom: 24 }}>This action cannot be undone.</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: '12px', background: '#f5f5ff', border: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => handleDelete(confirmDelete)} style={{ flex: 1, padding: '12px', background: '#ef4444', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
