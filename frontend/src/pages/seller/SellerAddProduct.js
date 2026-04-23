import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';
import SellerSidebar from '../../components/seller/SellerSidebar';
import { useProductStore } from '../../store';
import { API } from '../../store';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Sports', 'Beauty', 'Toys', 'Grocery', 'Automotive', 'Health'];

const Field = ({ label, children, required }) => (
  <div>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#444', marginBottom: 6 }}>
      {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    {children}
  </div>
);

export default function SellerAddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createProduct, updateProduct } = useProductStore();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', category: '', subcategory: '', brand: '',
    price: '', originalPrice: '', stock: '', sku: '', deliveryTime: '3-5 days',
    returnPolicy: '7 days return', freeDelivery: false, isFeatured: false, isActive: true,
    images: [],
    specifications: [{ key: '', value: '' }],
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isEdit) {
      API.get(`/products/${id}`).then(r => {
        const p = r.data.product;
        setForm({ ...p, price: p.price?.toString(), originalPrice: p.originalPrice?.toString(), stock: p.stock?.toString() });
      });
    }
  }, [id]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category || !form.stock) {
      toast.error('Please fill all required fields'); return;
    }
    setLoading(true);
    const data = { ...form, price: Number(form.price), originalPrice: Number(form.originalPrice || form.price), stock: Number(form.stock) };
    const res = isEdit ? await updateProduct(id, data) : await createProduct(data);
    setLoading(false);
    if (res.success) navigate('/seller/products');
  };

  const addSpec = () => update('specifications', [...(form.specifications || []), { key: '', value: '' }]);
  const removeSpec = (i) => update('specifications', form.specifications.filter((_, idx) => idx !== i));
  const updateSpec = (i, k, v) => update('specifications', form.specifications.map((s, idx) => idx === i ? { ...s, [k]: v } : s));
  const addTag = () => { if (tagInput.trim()) { update('tags', [...(form.tags || []), tagInput.trim()]); setTagInput(''); }};
  const removeTag = (i) => update('tags', form.tags.filter((_, idx) => idx !== i));
  const addImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url) update('images', [...(form.images || []), { url, public_id: Date.now().toString() }]);
  };

  const inputStyle = { width: '100%', padding: '11px 14px', background: '#f8f8ff', border: '1.5px solid #e0e0f0', borderRadius: 10, color: '#1a1a3a', fontSize: 14, outline: 'none', fontFamily: 'DM Sans' };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f0f8', display: 'flex' }}>
      <SellerSidebar active="/seller/products" />
      <div style={{ marginLeft: 240, flex: 1, padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <button onClick={() => navigate('/seller/products')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c63ff', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <FiArrowLeft /> Back
          </button>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: '#1a1a3a' }}>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          {/* Main form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Basic Info */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: 17, color: '#1a1a3a', marginBottom: 20 }}>Basic Information</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Field label="Product Name" required>
                  <input style={inputStyle} value={form.name} onChange={e => update('name', e.target.value)} placeholder="Enter product name" />
                </Field>
                <Field label="Description" required>
                  <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Describe your product..." />
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Category" required>
                    <select style={inputStyle} value={form.category} onChange={e => update('category', e.target.value)}>
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Brand">
                    <input style={inputStyle} value={form.brand} onChange={e => update('brand', e.target.value)} placeholder="Brand name" />
                  </Field>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: 17, color: '#1a1a3a', marginBottom: 20 }}>Pricing & Stock</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <Field label="Selling Price (₹)" required>
                  <input style={inputStyle} type="number" value={form.price} onChange={e => update('price', e.target.value)} placeholder="999" />
                </Field>
                <Field label="Original Price (₹)">
                  <input style={inputStyle} type="number" value={form.originalPrice} onChange={e => update('originalPrice', e.target.value)} placeholder="1499" />
                </Field>
                <Field label="Stock Quantity" required>
                  <input style={inputStyle} type="number" value={form.stock} onChange={e => update('stock', e.target.value)} placeholder="100" />
                </Field>
              </div>
              {form.price && form.originalPrice && Number(form.originalPrice) > Number(form.price) && (
                <div style={{ marginTop: 12, padding: '10px 14px', background: '#dcfce7', borderRadius: 10, color: '#16a34a', fontSize: 13, fontWeight: 600 }}>
                  ✓ Discount: {Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100)}% off
                </div>
              )}
            </div>

            {/* Specifications */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: 17, color: '#1a1a3a' }}>Specifications</div>
                <button onClick={addSpec} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(108,99,255,0.1)', border: 'none', borderRadius: 8, color: '#6c63ff', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                  <FiPlus size={12} /> Add
                </button>
              </div>
              {(form.specifications || []).map((spec, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, marginBottom: 10 }}>
                  <input style={inputStyle} value={spec.key} onChange={e => updateSpec(i, 'key', e.target.value)} placeholder="e.g. Weight" />
                  <input style={inputStyle} value={spec.value} onChange={e => updateSpec(i, 'value', e.target.value)} placeholder="e.g. 500g" />
                  <button onClick={() => removeSpec(i)} style={{ width: 40, height: 40, background: '#fee2e2', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiX size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Images */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: 17, color: '#1a1a3a', marginBottom: 16 }}>Product Images</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                {(form.images || []).map((img, i) => (
                  <div key={i} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '1', background: '#f8f8ff' }}>
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => update('images', form.images.filter((_, idx) => idx !== i))}
                      style={{ position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: '50%', background: '#ef4444', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                      <FiX size={10} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={addImageUrl} style={{ width: '100%', padding: '12px', border: '2px dashed #d0d0f0', borderRadius: 12, background: 'none', cursor: 'pointer', color: '#6c63ff', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <FiPlus /> Add Image URL
              </button>
            </div>

            {/* Tags */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: 17, color: '#1a1a3a', marginBottom: 16 }}>Tags</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input style={{ ...inputStyle, flex: 1 }} value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} placeholder="Add tag..." />
                <button onClick={addTag} style={{ padding: '0 16px', background: '#6c63ff', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontWeight: 700 }}>+</button>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(form.tags || []).map((tag, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(108,99,255,0.1)', borderRadius: 99, color: '#6c63ff', fontSize: 13, fontWeight: 600 }}>
                    {tag} <button onClick={() => removeTag(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c63ff', display: 'flex', alignItems: 'center', padding: 0 }}><FiX size={10} /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: 17, color: '#1a1a3a', marginBottom: 16 }}>Settings</div>
              {[['freeDelivery', 'Free Delivery'], ['isFeatured', 'Featured Product'], ['isActive', 'Active / Published']].map(([k, label]) => (
                <label key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{label}</span>
                  <div onClick={() => update(k, !form[k])} style={{ width: 44, height: 24, borderRadius: 99, background: form[k] ? '#6c63ff' : '#ddd', position: 'relative', transition: 'background 0.2s', cursor: 'pointer' }}>
                    <div style={{ position: 'absolute', top: 2, left: form[k] ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} />
                  </div>
                </label>
              ))}
              <Field label="Delivery Time">
                <input style={{ ...inputStyle, marginTop: 12 }} value={form.deliveryTime} onChange={e => update('deliveryTime', e.target.value)} placeholder="3-5 days" />
              </Field>
              <Field label="Return Policy">
                <input style={{ ...inputStyle, marginTop: 8 }} value={form.returnPolicy} onChange={e => update('returnPolicy', e.target.value)} placeholder="7 days return" />
              </Field>
            </div>

            {/* Submit */}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleSubmit} disabled={loading}
              style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Syne'", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: loading ? 0.7 : 1, boxShadow: '0 8px 30px rgba(108,99,255,0.4)' }}>
              {loading ? <div className="spinner" style={{ width: 20, height: 20 }} /> : (isEdit ? '✓ Update Product' : '+ Publish Product')}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
