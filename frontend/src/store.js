import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({ baseURL: '/api' });

// Attach token automatically
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('k_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// ─── Auth Store ──────────────────────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,

      setAuth: (user, token) => {
        localStorage.setItem('k_token', token);
        set({ user, token });
      },

      logout: () => {
        localStorage.removeItem('k_token');
        set({ user: null, token: null });
        useCartStore.getState().clearLocalCart();
      },

      registerBuyer: async (data) => {
        set({ loading: true });
        try {
          const res = await API.post('/auth/register/buyer', data);
          get().setAuth(res.data.user, res.data.token);
          toast.success('Welcome to Kommercio! 🎉');
          return { success: true };
        } catch (e) {
          toast.error(e.response?.data?.message || 'Registration failed');
          return { success: false };
        } finally { set({ loading: false }); }
      },

      registerSeller: async (data) => {
        set({ loading: true });
        try {
          const res = await API.post('/auth/register/seller', data);
          get().setAuth(res.data.user, res.data.token);
          toast.success('Seller account created! 🏪');
          return { success: true };
        } catch (e) {
          toast.error(e.response?.data?.message || 'Registration failed');
          return { success: false };
        } finally { set({ loading: false }); }
      },

      login: async (credential, password, role) => {
        set({ loading: true });
        try {
          const res = await API.post('/auth/login', { credential, password, role });
          get().setAuth(res.data.user, res.data.token);
          toast.success(`Welcome back! 👋`);
          return { success: true, role: res.data.user.role };
        } catch (e) {
          toast.error(e.response?.data?.message || 'Invalid credentials');
          return { success: false };
        } finally { set({ loading: false }); }
      },

      fetchMe: async () => {
        try {
          const res = await API.get('/auth/me');
          set({ user: res.data.user });
        } catch { get().logout(); }
      },

      updateProfile: async (data) => {
        try {
          const res = await API.put('/auth/profile', data);
          set({ user: res.data.user });
          toast.success('Profile updated!');
        } catch (e) { toast.error(e.response?.data?.message || 'Update failed'); }
      },

      toggleWishlist: async (productId) => {
        try {
          const res = await API.post(`/auth/wishlist/${productId}`);
          set(s => ({ user: { ...s.user, wishlist: res.data.wishlist } }));
          toast.success(res.data.action === 'added' ? 'Added to wishlist ❤️' : 'Removed from wishlist');
        } catch {}
      },
    }),
    { name: 'kommercio-auth', partialize: s => ({ user: s.user, token: s.token }) }
  )
);

// ─── Cart Store ──────────────────────────────────────────────────────────────
export const useCartStore = create((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await API.get('/cart');
      set({ items: res.data.cart.items, total: res.data.total, itemCount: res.data.cart.items.length });
    } catch {} finally { set({ loading: false }); }
  },

  addToCart: async (productId, quantity = 1, variant = '') => {
    try {
      await API.post('/cart/add', { productId, quantity, variant });
      toast.success('Added to cart 🛒');
      get().fetchCart();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to add'); }
  },

  removeItem: async (itemId) => {
    try {
      await API.delete(`/cart/item/${itemId}`);
      get().fetchCart();
    } catch {}
  },

  updateQty: async (itemId, quantity) => {
    try {
      await API.put(`/cart/item/${itemId}`, { quantity });
      get().fetchCart();
    } catch {}
  },

  clearCart: async () => {
    try { await API.delete('/cart/clear'); set({ items: [], total: 0, itemCount: 0 }); } catch {}
  },
  clearLocalCart: () => set({ items: [], total: 0, itemCount: 0 }),
}));

// ─── Product Store ───────────────────────────────────────────────────────────
export const useProductStore = create((set) => ({
  products: [],
  product: null,
  featured: [],
  categories: [],
  total: 0,
  pages: 1,
  loading: false,

  fetchProducts: async (params = {}) => {
    set({ loading: true });
    try {
      const res = await API.get('/products', { params });
      set({ products: res.data.products, total: res.data.total, pages: res.data.pages });
    } catch {} finally { set({ loading: false }); }
  },

  fetchProduct: async (id) => {
    set({ loading: true, product: null });
    try {
      const res = await API.get(`/products/${id}`);
      set({ product: res.data.product });
    } catch {} finally { set({ loading: false }); }
  },

  fetchFeatured: async () => {
    try {
      const res = await API.get('/products/featured');
      set({ featured: res.data.products });
    } catch {}
  },

  fetchCategories: async () => {
    try {
      const res = await API.get('/categories');
      set({ categories: res.data.categories });
    } catch {}
  },

  // Seller actions
  createProduct: async (data) => {
    try {
      const res = await API.post('/products', data);
      toast.success('Product created! 🎉');
      return { success: true, product: res.data.product };
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); return { success: false }; }
  },

  updateProduct: async (id, data) => {
    try {
      const res = await API.put(`/products/${id}`, data);
      toast.success('Product updated!');
      return { success: true, product: res.data.product };
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); return { success: false }; }
  },

  deleteProduct: async (id) => {
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      return { success: true };
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); return { success: false }; }
  },
}));

// ─── Order Store ─────────────────────────────────────────────────────────────
export const useOrderStore = create((set) => ({
  orders: [],
  order: null,
  sellerOrders: [],
  analytics: null,
  loading: false,

  placeOrder: async (data) => {
    set({ loading: true });
    try {
      const res = await API.post('/orders', data);
      toast.success('Order placed successfully! 🎊');
      return { success: true, order: res.data.order };
    } catch (e) { toast.error(e.response?.data?.message || 'Order failed'); return { success: false }; }
    finally { set({ loading: false }); }
  },

  fetchMyOrders: async (params) => {
    set({ loading: true });
    try {
      const res = await API.get('/orders/my', { params });
      set({ orders: res.data.orders });
    } catch {} finally { set({ loading: false }); }
  },

  fetchSellerOrders: async (params) => {
    set({ loading: true });
    try {
      const res = await API.get('/orders/seller', { params });
      set({ sellerOrders: res.data.orders });
    } catch {} finally { set({ loading: false }); }
  },

  fetchAnalytics: async () => {
    try {
      const res = await API.get('/seller/dashboard/stats');
      set({ analytics: res.data.stats });
    } catch {}
  },

  updateStatus: async (id, status, trackingNumber) => {
    try {
      await API.put(`/orders/${id}/status`, { status, trackingNumber });
      toast.success('Order status updated!');
      return { success: true };
    } catch (e) { toast.error(e.response?.data?.message || 'Update failed'); return { success: false }; }
  },

  cancelOrder: async (id, reason) => {
    try {
      await API.put(`/orders/${id}/cancel`, { reason });
      toast.success('Order cancelled');
      return { success: true };
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); return { success: false }; }
  },
}));

export { API };
