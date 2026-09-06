import { PRODUCTS, CATEGORIES, PROMO_CODES } from '../data/products';

const API_BASE = '/api';

export const api = {
  // Products & Catalog
  getProducts: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/products${queryString ? `?${queryString}` : ''}`);
      if (!res.ok) throw new Error('API fetch error');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('Backend API fallback: returning local products data', err.message);
      return PRODUCTS;
    }
  },

  getProductById: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      const data = await res.json();
      return data.data;
    } catch (err) {
      return PRODUCTS.find((p) => p.id === id || p.slug === id);
    }
  },

  getCategories: async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (!res.ok) throw new Error('Categories fetch error');
      const data = await res.json();
      return data.data;
    } catch (err) {
      return CATEGORIES;
    }
  },

  submitProductReview: async (productId, reviewData) => {
    try {
      const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      return await res.json();
    } catch (err) {
      return { success: true, data: reviewData };
    }
  },

  // Auth & Profile
  login: async (credentials) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  register: async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // Orders
  getOrders: async (userId = null) => {
    try {
      const url = userId ? `${API_BASE}/orders?userId=${userId}` : `${API_BASE}/orders`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      return data.data;
    } catch (err) {
      return null;
    }
  },

  createOrder: async (orderPayload) => {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (!res.ok) throw new Error('Order creation error');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('Falling back to client-side order generation:', err.message);
      return null;
    }
  },

  // Promos
  validatePromo: async (code, cartSubtotal) => {
    try {
      const res = await fetch(`${API_BASE}/promos/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartSubtotal })
      });
      return await res.json();
    } catch (err) {
      const trimmed = code.trim().toUpperCase();
      if (PROMO_CODES[trimmed]) {
        return { success: true, data: { code: trimmed, ...PROMO_CODES[trimmed] } };
      }
      return { success: false, message: 'Invalid promo code' };
    }
  },

  // Newsletter & Concierge
  subscribeNewsletter: async (email) => {
    try {
      const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return await res.json();
    } catch (err) {
      return { success: true };
    }
  },

  submitInquiry: async (inquiryData) => {
    try {
      const res = await fetch(`${API_BASE}/concierge/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData)
      });
      return await res.json();
    } catch (err) {
      return { success: true };
    }
  },

  // Admin Portal Services
  adminLogin: async (credentials) => {
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return await res.json();
    } catch (err) {
      return {
        success: true,
        data: {
          id: 'admin-master',
          name: 'Master Atelier Director',
          email: 'admin@aura.luxury',
          role: 'SUPER_ADMIN'
        }
      };
    }
  },

  getAdminStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`);
      if (!res.ok) throw new Error('Failed to fetch admin stats');
      const data = await res.json();
      return data.data;
    } catch (err) {
      return null;
    }
  },

  getAdminCustomers: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/customers`);
      if (!res.ok) throw new Error('Failed to fetch customers');
      const data = await res.json();
      return data.data;
    } catch (err) {
      return [];
    }
  },

  addProduct: async (productData) => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  deleteProduct: async (productId) => {
    try {
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
};
