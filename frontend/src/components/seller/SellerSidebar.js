import { Link, useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiPackage, FiShoppingBag, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '../../store';

const NAV = [
  { label: 'Dashboard', to: '/seller/dashboard', icon: <FiTrendingUp /> },
  { label: 'Products', to: '/seller/products', icon: <FiPackage /> },
  { label: 'Orders', to: '/seller/orders', icon: <FiShoppingBag /> },
  { label: 'Profile', to: '/seller/profile', icon: <FiSettings /> },
];

export default function SellerSidebar({ active }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div style={{ width: 240, background: 'linear-gradient(180deg, #0a0a1f 0%, #13132e 100%)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100, padding: '24px 0' }}>
      <div style={{ padding: '0 24px 24px', borderBottom: '1px solid rgba(108,99,255,0.2)' }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: '#f0f0ff' }}>
          Komm<span style={{ color: '#ff6b35' }}>ercio</span>
        </div>
        <div style={{ fontSize: 12, color: '#6c63ff', marginTop: 4, fontWeight: 600 }}>Seller Panel</div>
      </div>

      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(108,99,255,0.15)' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #6c63ff, #ff6b35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: '#fff', marginBottom: 8 }}>
          {user?.shopName?.[0]?.toUpperCase()}
        </div>
        <div style={{ fontWeight: 700, color: '#f0f0ff', fontSize: 14 }}>{user?.shopName}</div>
        <div style={{ color: '#8888aa', fontSize: 12 }}>{user?.mobile}</div>
      </div>

      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {NAV.map(item => (
          <Link key={item.to} to={item.to}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, color: active === item.to ? '#6c63ff' : '#8888aa', background: active === item.to ? 'rgba(108,99,255,0.12)' : 'transparent', textDecoration: 'none', fontSize: 14, fontWeight: 600, marginBottom: 4, transition: 'all 0.2s' }}
            onMouseEnter={e => { if (active !== item.to) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#f0f0ff'; }}}
            onMouseLeave={e => { if (active !== item.to) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8888aa'; }}}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>

      <button onClick={() => { logout(); navigate('/'); }}
        style={{ margin: '0 12px 16px', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', borderRadius: 10, fontSize: 14, fontWeight: 600 }}>
        <FiLogOut /> Logout
      </button>
    </div>
  );
}
