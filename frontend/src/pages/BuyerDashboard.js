import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BuyerNavbar from '../components/shared/BuyerNavbar';
import ProductCard from '../components/shared/ProductCard';
import { useProductStore, useCartStore } from '../store';
import { FiFilter, FiGrid, FiList, FiChevronRight, FiSliders } from 'react-icons/fi';

const CATEGORIES = [
  { name: 'All', icon: '🏠' },
  { name: 'Electronics', icon: '📱' },
  { name: 'Fashion', icon: '👗' },
  { name: 'Home & Kitchen', icon: '🏠' },
  { name: 'Books', icon: '📚' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Beauty', icon: '💄' },
  { name: 'Toys', icon: '🧸' },
  { name: 'Grocery', icon: '🛒' },
  { name: 'Automotive', icon: '🚗' },
  { name: 'Health', icon: '💊' },
];

const BANNERS = [
  { bg: 'linear-gradient(135deg, #6c63ff, #a855f7)', title: 'Mega Electronics Sale', sub: 'Up to 60% off on phones & laptops', icon: '📱' },
  { bg: 'linear-gradient(135deg, #ff6b35, #f59e0b)', title: 'Fashion Week', sub: 'New arrivals from top brands', icon: '👗' },
  { bg: 'linear-gradient(135deg, #00d4c8, #0ea5e9)', title: 'Home Makeover', sub: 'Everything for your home', icon: '🏠' },
];

export default function BuyerDashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products, featured, loading, fetchProducts, fetchFeatured } = useProductStore();
  const { fetchCart } = useCartStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [page, setPage] = useState(1);

  useEffect(() => { fetchCart(); fetchFeatured(); }, []);

  useEffect(() => {
    const params = {
      page, sort: sortBy,
      ...(activeCategory !== 'All' && { category: activeCategory }),
      ...(keyword && { keyword }),
      ...(priceRange[0] > 0 && { minPrice: priceRange[0] }),
      ...(priceRange[1] < 100000 && { maxPrice: priceRange[1] }),
    };
    fetchProducts(params);
  }, [activeCategory, sortBy, keyword, page, priceRange]);

  // Banner auto-rotate
  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (q) => { setKeyword(q); setPage(1); };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5ff' }}>
      <BuyerNavbar onSearch={handleSearch} />

      {/* Hero Banner */}
      <div style={{ position: 'relative', height: 260, overflow: 'hidden', marginBottom: 0 }}>
        {BANNERS.map((b, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: i === bannerIdx ? 1 : 0, x: i === bannerIdx ? 0 : i < bannerIdx ? -100 : 100 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute', inset: 0, background: b.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 8%',
            }}
          >
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{b.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 17, marginBottom: 20 }}>{b.sub}</div>
              <button onClick={() => setActiveCategory(b.title.split(' ')[0])}
                style={{ padding: '12px 28px', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
                Shop Now →
              </button>
            </div>
            <div style={{ fontSize: 100, opacity: 0.3 }}>{b.icon}</div>
          </motion.div>
        ))}
        {/* Dots */}
        <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
          {BANNERS.map((_, i) => (
            <button key={i} onClick={() => setBannerIdx(i)}
              style={{ width: i === bannerIdx ? 24 : 8, height: 8, borderRadius: 99, border: 'none', cursor: 'pointer', background: i === bannerIdx ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.3s' }} />
          ))}
        </div>
      </div>

      {/* Category Bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eee', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 0, maxWidth: 1400, margin: '0 auto', padding: '0 20px' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.name} onClick={() => { setActiveCategory(cat.name); setPage(1); }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer',
                borderBottom: activeCategory === cat.name ? '3px solid #6c63ff' : '3px solid transparent',
                color: activeCategory === cat.name ? '#6c63ff' : '#555',
                fontWeight: activeCategory === cat.name ? 700 : 400,
                fontSize: 13, whiteSpace: 'nowrap', transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 22 }}>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ display: 'flex', gap: 24 }}>

          {/* Sidebar Filter */}
          <div style={{ width: 240, flexShrink: 0, display: 'block' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #eee', position: 'sticky', top: 80 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiSliders color="#6c63ff" /> Filters
              </div>

              {/* Sort */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sort By</div>
                {[['newest', 'Newest First'], ['popular', 'Popularity'], ['price_asc', 'Price: Low to High'], ['price_desc', 'Price: High to Low'], ['rating', 'Top Rated']].map(([val, label]) => (
                  <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', cursor: 'pointer', fontSize: 14, color: sortBy === val ? '#6c63ff' : '#444' }}>
                    <input type="radio" name="sort" value={val} checked={sortBy === val} onChange={() => setSortBy(val)} style={{ accentColor: '#6c63ff' }} />
                    {label}
                  </label>
                ))}
              </div>

              {/* Price Range */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price Range</div>
                <div style={{ fontSize: 14, color: '#6c63ff', fontWeight: 600, marginBottom: 8 }}>
                  ₹{priceRange[0].toLocaleString()} – ₹{priceRange[1].toLocaleString()}
                </div>
                <input type="range" min={0} max={100000} step={500} value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                  style={{ width: '100%', accentColor: '#6c63ff' }}
                />
              </div>

              {/* Clear */}
              <button onClick={() => { setActiveCategory('All'); setSortBy('newest'); setPriceRange([0, 100000]); setKeyword(''); }}
                style={{ width: '100%', marginTop: 20, padding: '10px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 10, color: '#6c63ff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products */}
          <div style={{ flex: 1 }}>
            {/* Results header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: '#1a1a3a' }}>
                {keyword ? `Results for "${keyword}"` : activeCategory === 'All' ? 'All Products' : activeCategory}
                <span style={{ fontSize: 14, color: '#888', fontFamily: 'DM Sans', fontWeight: 400, marginLeft: 8 }}>
                  ({products.length} items)
                </span>
              </div>
            </div>

            {/* Featured Row (only on home) */}
            {!keyword && activeCategory === 'All' && featured.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: '#1a1a3a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  ⚡ Featured Deals
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                  {featured.slice(0, 4).map((p, i) => (
                    <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </div>
                <div style={{ height: 1, background: '#eee', margin: '28px 0' }} />
              </div>
            )}

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
                <div className="spinner" style={{ borderTopColor: '#6c63ff' }} />
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 80, color: '#888' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
                <div style={{ fontFamily: "'Syne'", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No products found</div>
                <div style={{ fontSize: 15 }}>Try different keywords or filters</div>
              </div>
            ) : (
              <div className="grid-products">
                {products.map((p, i) => (
                  <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {useProductStore.getState().pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                {Array.from({ length: useProductStore.getState().pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid', borderColor: p === page ? '#6c63ff' : '#ddd', background: p === page ? '#6c63ff' : '#fff', color: p === page ? '#fff' : '#333', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
