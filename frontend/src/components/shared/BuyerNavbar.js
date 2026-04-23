import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useCartStore } from '../../store';
import { FiShoppingCart, FiHeart, FiUser, FiLogOut, FiSearch, FiPackage, FiMenu, FiX, FiBell } from 'react-icons/fi';

export default function BuyerNavbar({ onSearch }) {
  const { user, logout } = useAuthStore();
  const { itemCount } = useCartStore();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(search);
    else navigate(`/shop?keyword=${search}`);
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: 'linear-gradient(90deg, #0a0a1f, #130d2e)',
      borderBottom: '1px solid rgba(108,99,255,0.2)',
      padding: '0 20px',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Logo */}
        <Link to="/shop" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #6c63ff, #ff6b35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne'", fontWeight: 800, fontSize: 16 }}>K</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: '#f0f0ff', letterSpacing: '-0.5px' }}>Komm<span style={{ color: '#ff6b35' }}>ercio</span></span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 600, position: 'relative' }}>
          <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--k-text-muted)' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products, brands, categories..."
            style={{
              width: '100%', padding: '10px 16px 10px 44px',
              background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(108,99,255,0.2)',
              borderRadius: 12, color: '#f0f0ff', fontSize: 14,
              fontFamily: "'DM Sans'", outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = '#6c63ff'}
            onBlur={e => e.target.style.borderColor = 'rgba(108,99,255,0.2)'}
          />
        </form>

        {/* Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          <NavIconBtn icon={<FiHeart />} to="/wishlist" label="Wishlist" />
          <NavIconBtn icon={<FiPackage />} to="/orders" label="Orders" />
          <NavIconBtn icon={<FiShoppingCart />} to="/cart" label="Cart" badge={itemCount} />

          {/* Profile */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px',
                background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)',
                borderRadius: 10, cursor: 'pointer', color: '#f0f0ff',
              }}
            >
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.username || 'User'}
              </span>
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    background: '#13132e', border: '1px solid rgba(108,99,255,0.2)',
                    borderRadius: 14, overflow: 'hidden', minWidth: 180, zIndex: 300,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  }}
                >
                  {[
                    { label: 'My Orders', icon: <FiPackage />, to: '/orders' },
                    { label: 'Wishlist', icon: <FiHeart />, to: '/wishlist' },
                    { label: 'Profile', icon: <FiUser />, to: '/profile' },
                  ].map(item => (
                    <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', color: '#f0f0ff', textDecoration: 'none', fontSize: 14, transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ color: 'var(--k-primary)' }}>{item.icon}</span> {item.label}
                    </Link>
                  ))}
                  <div style={{ height: 1, background: 'rgba(108,99,255,0.15)', margin: '4px 0' }} />
                  <button
                    onClick={() => { logout(); navigate('/'); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, textAlign: 'left' }}
                  >
                    <FiLogOut /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavIconBtn({ icon, to, label, badge }) {
  return (
    <Link to={to} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '8px 12px', color: 'var(--k-text-muted)', textDecoration: 'none', borderRadius: 10, transition: 'all 0.2s', fontSize: 20 }}
      onMouseEnter={e => { e.currentTarget.style.color = '#f0f0ff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--k-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
    >
      {icon}
      <span style={{ fontSize: 10 }}>{label}</span>
      {badge > 0 && (
        <span style={{ position: 'absolute', top: 4, right: 6, minWidth: 18, height: 18, borderRadius: '50%', background: '#ff6b35', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
}
