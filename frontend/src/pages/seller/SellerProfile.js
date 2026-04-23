import { useState } from 'react';
import { motion } from 'framer-motion';
import SellerSidebar from '../../components/seller/SellerSidebar';
import { useAuthStore } from '../../store';

export default function SellerProfile() {
  const { user, updateProfile } = useAuthStore();
  const [form, setForm] = useState({ shopName: user?.shopName || '', shopDescription: user?.shopDescription || '', shopCategory: user?.shopCategory || '', mobile: user?.mobile || '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateProfile(form);
    setSaving(false);
  };

  const inputStyle = { width: '100%', padding: '12px 14px', background: '#f8f8ff', border: '1.5px solid #e0e0f0', borderRadius: 10, color: '#1a1a3a', fontSize: 14, outline: 'none', fontFamily: 'DM Sans' };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f0f8', display: 'flex' }}>
      <SellerSidebar active="/seller/profile" />
      <div style={{ marginLeft: 240, flex: 1, padding: '32px', maxWidth: 800 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: '#1a1a3a', marginBottom: 28 }}>Shop Profile</h1>
        <div style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #6c63ff, #ff6b35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne'", fontWeight: 800, fontSize: 32, color: '#fff' }}>
              {user?.shopName?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: 22, color: '#1a1a3a' }}>{user?.shopName}</div>
              <div style={{ color: '#888', marginTop: 4 }}>Mobile: {user?.mobile}</div>
              {user?.isVerifiedSeller && <span style={{ display: 'inline-block', marginTop: 6, padding: '3px 12px', background: '#dcfce7', color: '#16a34a', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>✓ Verified Seller</span>}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              { k: 'shopName', l: 'Shop Name' },
              { k: 'mobile', l: 'Mobile Number' },
              { k: 'shopCategory', l: 'Shop Category' },
            ].map(f => (
              <div key={f.k}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#444', marginBottom: 6 }}>{f.l}</label>
                <input style={inputStyle} value={form[f.k]} onChange={e => setForm(v => ({ ...v, [f.k]: e.target.value }))} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#444', marginBottom: 6 }}>Shop Description</label>
              <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} value={form.shopDescription} onChange={e => setForm(v => ({ ...v, shopDescription: e.target.value }))} placeholder="Tell buyers about your shop..." />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving}
              style={{ padding: '14px', background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: "'Syne'" }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
