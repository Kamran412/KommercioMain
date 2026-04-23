import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';
import { FiShoppingBag, FiUser, FiLock, FiPhone, FiMail, FiEye, FiEyeOff, FiArrowRight, FiStar, FiTruck, FiShield, FiRefreshCw, FiPackage } from 'react-icons/fi';
// ── 3D Floating Cube ──────────────────────────────────────────────────────────
function Cube3D({ size = 60, color = '#6c63ff', style = {} }) {
  const [rot, setRot] = useState({ x: 20, y: 30 });
  const frame = useRef(0);
  const raf = useRef(null);
  useEffect(() => {
    const animate = () => {
      frame.current += 1;
      setRot({ x: 20 + frame.current * 0.2, y: 30 + frame.current * 0.35 });
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, []);
  const h = size / 2;
  const faceStyle = {
    position: 'absolute', width: size, height: size,
    border: `1.5px solid ${color}60`,
    background: `${color}12`,
    backdropFilter: 'blur(4px)',
  };
  return (
    <div style={{ ...style, width: size, height: size, position: 'absolute', perspective: 600 }}>
      <div style={{ width: size, height: size, transformStyle: 'preserve-3d', transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}>
        {[
          { transform: `translateZ(${h}px)` },
          { transform: `rotateY(180deg) translateZ(${h}px)` },
          { transform: `rotateY(90deg) translateZ(${h}px)` },
          { transform: `rotateY(-90deg) translateZ(${h}px)` },
          { transform: `rotateX(90deg) translateZ(${h}px)` },
          { transform: `rotateX(-90deg) translateZ(${h}px)` },
        ].map((f, i) => <div key={i} style={{ ...faceStyle, ...f }} />)}
      </div>
    </div>
  );
}

// ── Floating Particles ────────────────────────────────────────────────────────
function Particles() {
  const particles = useRef(
    Array.from({ length: 50 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 3 + 1, speed: Math.random() * 0.02 + 0.005,
      opacity: Math.random() * 0.5 + 0.1,
      color: ['#6c63ff', '#ff6b35', '#00d4c8', '#ffd700'][Math.floor(Math.random() * 4)],
    }))
  );
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {particles.current.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: `${((p.y + tick * p.speed) % 110) - 5}%`,
          width: p.size, height: p.size, borderRadius: '50%',
          background: p.color, opacity: p.opacity, filter: 'blur(0.5px)',
        }} />
      ))}
    </div>
  );
}

// ── Auth Modal ────────────────────────────────────────────────────────────────
function AuthModal({ type, onClose }) {
  const navigate = useNavigate();
  const { registerBuyer, registerSeller, login, loading } = useAuthStore();
  const [form, setForm] = useState({});
  const [showPw, setShowPw] = useState(false);

  const cfg = {
    buyerLogin:   { title: 'Buyer Login',          emoji: '🛍️', color: '#6c63ff', role: 'buyer' },
    sellerLogin:  { title: 'Seller Login',          emoji: '🏪', color: '#ff6b35', role: 'seller' },
    buyerReg:     { title: 'Join as Buyer',         emoji: '👤', color: '#6c63ff', role: 'buyer' },
    sellerReg:    { title: 'Open Your Shop',        emoji: '🏬', color: '#ff6b35', role: 'seller' },
  }[type];

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    let res;
    if (type === 'buyerLogin')  res = await login(form.credential, form.password, 'buyer');
    if (type === 'sellerLogin') res = await login(form.credential, form.password, 'seller');
    if (type === 'buyerReg')    res = await registerBuyer({ username: form.username, mobile: form.mobile, email: form.email, password: form.password });
    if (type === 'sellerReg')   res = await registerSeller({ shopName: form.shopName, mobile: form.mobile, password: form.password });

    if (res?.success) {
      onClose();
      if (type.includes('seller')) navigate('/seller/dashboard');
      else navigate('/shop');
    }
  };

  const fields = {
    buyerLogin:  [{ k: 'credential', l: 'Email or Mobile', icon: <FiMail />, type: 'text' }, { k: 'password', l: 'Password', icon: <FiLock />, type: showPw ? 'text' : 'password' }],
    sellerLogin: [{ k: 'credential', l: 'Registered Mobile', icon: <FiPhone />, type: 'text' }, { k: 'password', l: 'Password', icon: <FiLock />, type: showPw ? 'text' : 'password' }],
    buyerReg:    [{ k: 'username', l: 'Username', icon: <FiUser />, type: 'text' }, { k: 'mobile', l: 'Mobile Number', icon: <FiPhone />, type: 'tel' }, { k: 'email', l: 'Email (optional)', icon: <FiMail />, type: 'email' }, { k: 'password', l: 'Password', icon: <FiLock />, type: showPw ? 'text' : 'password' }],
    sellerReg:   [{ k: 'shopName', l: 'Shop Name', icon: <FiPackage />, type: 'text' }, { k: 'mobile', l: 'Mobile Number', icon: <FiPhone />, type: 'tel' }, { k: 'password', l: 'Password', icon: <FiLock />, type: showPw ? 'text' : 'password' }],
  }[type];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg, #0e0e2a, #13132e)',
          border: `1px solid ${cfg.color}40`,
          borderRadius: 24, padding: 40, width: '100%', maxWidth: 440,
          maxHeight: '90vh', overflowY: 'auto',
          boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 60px ${cfg.color}20`,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{cfg.emoji}</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, color: '#f0f0ff', marginBottom: 6 }}>{cfg.title}</h2>
          <div style={{ width: 50, height: 3, background: `linear-gradient(90deg, ${cfg.color}, transparent)`, borderRadius: 99, margin: '0 auto' }} />
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {fields.map(f => (
            <div key={f.k} style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: cfg.color, fontSize: 16 }}>{f.icon}</div>
              <input
                className="input"
                type={f.type}
                placeholder={f.l}
                value={form[f.k] || ''}
                onChange={e => update(f.k, e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{ paddingLeft: 48 }}
              />
              {f.k === 'password' && (
                <button onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--k-text-muted)' }}>
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSubmit} disabled={loading}
          style={{
            width: '100%', marginTop: 24, padding: '14px 28px',
            background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}99)`,
            color: '#fff', border: 'none', borderRadius: 12,
            fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: "'Syne', sans-serif",
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? <div className="spinner" style={{ width: 20, height: 20 }} /> : (
            <>{type.includes('Login') ? 'Login' : 'Create Account'} <FiArrowRight /></>
          )}
        </motion.button>

        <button onClick={onClose} style={{ width: '100%', marginTop: 12, padding: '10px', background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'var(--k-text-muted)', cursor: 'pointer', fontSize: 14 }}>
          Cancel
        </button>
      </motion.div>
    </div>
  );
}

// ── Landing Page ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [modal, setModal] = useState(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'buyer') navigate('/shop');
    if (user?.role === 'seller') navigate('/seller/dashboard');
  }, [user]);

  const stats = [
    { value: '2M+', label: 'Happy Buyers' },
    { value: '50K+', label: 'Sellers' },
    { value: '5M+', label: 'Products' },
    { value: '99.9%', label: 'Uptime' },
  ];

  const features = [
    { icon: <FiTruck size={22} />, title: 'Free Delivery', desc: 'On orders above ₹499 across India' },
    { icon: <FiShield size={22} />, title: 'Secure Payments', desc: 'Bank-grade encryption on all transactions' },
    { icon: <FiRefreshCw size={22} />, title: 'Easy Returns', desc: '7-day hassle-free return policy' },
    { icon: <FiStar size={22} />, title: 'Top Brands', desc: 'Verified sellers & authentic products' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--k-bg)', position: 'relative', overflow: 'hidden' }}>
      <Particles />

      {/* Background mesh */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 80% 60% at 20% 20%, rgba(108,99,255,0.15) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 80%, rgba(255,107,53,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 50% 50%, rgba(0,212,200,0.06) 0%, transparent 70%)
        `,
      }} />

      {/* 3D Cubes decoration */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <Cube3D size={80} color="#6c63ff" style={{ top: '10%', left: '5%', opacity: 0.6 }} />
        <Cube3D size={50} color="#ff6b35" style={{ top: '20%', right: '8%', opacity: 0.5 }} />
        <Cube3D size={100} color="#00d4c8" style={{ bottom: '15%', left: '3%', opacity: 0.3 }} />
        <Cube3D size={60} color="#ffd700" style={{ bottom: '25%', right: '5%', opacity: 0.4 }} />
        <Cube3D size={40} color="#6c63ff" style={{ top: '50%', right: '15%', opacity: 0.3 }} />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(7,7,26,0.7)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(108,99,255,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #6c63ff, #ff6b35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>K</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>
            Komm<span style={{ color: 'var(--k-accent)' }}>ercio</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setModal('buyerLogin')} className="btn btn-outline btn-sm">
            <FiShoppingBag size={14} /> Shop Login
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setModal('sellerLogin')} className="btn btn-accent btn-sm">
            <FiPackage size={14} /> Seller Login
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero */}
      <div style={{ position: 'relative', zIndex: 2, paddingTop: 120, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 20px 60px' }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 99, background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: 'var(--k-primary)', fontSize: 13, fontWeight: 600, marginBottom: 28 }}>
            🚀 India's Next-Gen Shopping Platform
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(40px, 7vw, 82px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 24, maxWidth: 900 }}
        >
          Welcome to{' '}
          <span style={{
            background: 'linear-gradient(135deg, #6c63ff 0%, #00d4c8 50%, #ff6b35 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Kommercio
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ fontSize: 18, color: 'var(--k-text-muted)', maxWidth: 600, lineHeight: 1.7, marginBottom: 48 }}
        >
          Shop millions of products. Sell to millions of buyers. The complete marketplace built for India's future.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 80 }}
        >
          {[
            { label: '🛍️ Login as Buyer', type: 'buyerLogin', primary: true },
            { label: '🏪 Login as Seller', type: 'sellerLogin', accent: true },
            { label: '👤 Register as Buyer', type: 'buyerReg', outline: true },
            { label: '🏬 Register as Seller', type: 'sellerReg', outline: true },
          ].map((btn, i) => (
            <motion.button
              key={btn.type}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}
              onClick={() => setModal(btn.type)}
              style={{
                padding: '14px 28px', borderRadius: 14, border: 'none', cursor: 'pointer',
                fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                display: 'flex', alignItems: 'center', gap: 8,
                ...(btn.primary && {
                  background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
                  color: '#fff', boxShadow: '0 8px 30px rgba(108,99,255,0.4)',
                }),
                ...(btn.accent && {
                  background: 'linear-gradient(135deg, #ff6b35, #ff8c55)',
                  color: '#fff', boxShadow: '0 8px 30px rgba(255,107,53,0.4)',
                }),
                ...(btn.outline && {
                  background: 'rgba(255,255,255,0.05)',
                  color: '#f0f0ff', border: '1.5px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                }),
              }}
            >
              {btn.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 80 }}
        >
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.7 + i * 0.1 }}
              style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg, #6c63ff, #00d4c8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {s.value}
              </div>
              <div style={{ color: 'var(--k-text-muted)', fontSize: 13, marginTop: 4 }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, maxWidth: 1000, width: '100%' }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.1 }}
              whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(108,99,255,0.2)' }}
              style={{
                background: 'linear-gradient(145deg, rgba(14,14,42,0.8), rgba(19,19,46,0.8))',
                border: '1px solid rgba(108,99,255,0.15)', borderRadius: 20, padding: 28,
                backdropFilter: 'blur(10px)', cursor: 'default',
              }}
            >
              <div style={{ width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(108,99,255,0.05))', border: '1px solid rgba(108,99,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--k-primary)', marginBottom: 16 }}>
                {f.icon}
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{f.title}</div>
              <div style={{ color: 'var(--k-text-muted)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 80, color: 'var(--k-text-muted)', fontSize: 13 }}>
          © 2024 Kommercio. Made with ❤️ in India
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && <AuthModal type={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  );
}
