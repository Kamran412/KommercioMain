import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerNavbar from '../components/shared/BuyerNavbar';
import ProductCard from '../components/shared/ProductCard';
import { useAuthStore, useProductStore } from '../store';
import { FiArrowLeft } from 'react-icons/fi';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    if (user?.wishlist?.length) {
      // We'll just fetch all products for now; real implementation would filter by wishlist
      fetchProducts({});
    }
  }, [user]);

  const wishlistProducts = products.filter(p => user?.wishlist?.includes(p._id));

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5ff' }}>
      <BuyerNavbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <button onClick={() => navigate('/shop')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c63ff', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <FiArrowLeft /> Back
          </button>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: '#1a1a3a' }}>
            My Wishlist <span style={{ fontSize: 16, color: '#888', fontFamily: 'DM Sans', fontWeight: 400 }}>({wishlistProducts.length} items)</span>
          </span>
        </div>
        {wishlistProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, background: '#fff', borderRadius: 20 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>❤️</div>
            <div style={{ fontFamily: "'Syne'", fontSize: 22, fontWeight: 800, color: '#1a1a3a', marginBottom: 8 }}>Your wishlist is empty</div>
            <div style={{ color: '#888', marginBottom: 24 }}>Save items you love to buy them later</div>
            <button onClick={() => navigate('/shop')} className="btn btn-primary">Explore Products</button>
          </div>
        ) : (
          <div className="grid-products">
            {wishlistProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
