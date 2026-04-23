import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BuyerNavbar from '../components/shared/BuyerNavbar';
import ProductCard from '../components/shared/ProductCard';
import { useProductStore } from '../store';
import { API } from '../store';

export default function ShopPage() {
  const { id } = useParams();
  const { products, fetchProducts } = useProductStore();
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    fetchProducts({ seller: id });
    API.get(`/seller/${id}/profile`).then(r => setSeller(r.data.seller)).catch(() => {});
  }, [id]);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5ff' }}>
      <BuyerNavbar />
      {seller && (
        <div style={{ background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)', padding: '40px 20px', textAlign: 'center', color: '#fff' }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, marginBottom: 8 }}>{seller.shopName}</div>
          {seller.shopDescription && <div style={{ opacity: 0.85, fontSize: 16 }}>{seller.shopDescription}</div>}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 20 }}>
            <div><div style={{ fontWeight: 800, fontSize: 20 }}>{seller.productCount}</div><div style={{ fontSize: 13, opacity: 0.8 }}>Products</div></div>
            <div><div style={{ fontWeight: 800, fontSize: 20 }}>{seller.totalSales || 0}</div><div style={{ fontSize: 13, opacity: 0.8 }}>Sales</div></div>
          </div>
        </div>
      )}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
        <div className="grid-products">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
