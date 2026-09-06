import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';
import { CATEGORIES, PRODUCTS } from '../data/products';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  PlusCircle,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  ArrowRight,
  LogOut,
  ShieldCheck,
  Tag,
  Sparkles,
  Layers,
  ChevronDown,
  X,
  Plus,
  Minus,
  Truck,
  CreditCard,
  MapPin,
  Lock,
  Mail
} from 'lucide-react';

export const AdminPage = () => {
  const { navigateTo, formatPrice, addToast } = useShop();

  // Admin Auth state
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_admin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [adminEmail, setAdminEmail] = useState('admin@aura.luxury');
  const [adminPassword, setAdminPassword] = useState('admin123');

  // Active Admin Sub-page / Tab: 'dashboard' | 'add-product' | 'products' | 'orders' | 'customers'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Stats & Dynamic Data
  const [stats, setStats] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Add Product Form State
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Fashion',
    brand: 'Aura Atelier',
    price: '',
    originalPrice: '',
    stock: '15',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=900&auto=format&fit=crop',
    sizes: 'XS, S, M, L, XL',
    colors: 'Onyx Black:#18181B, Camel Tan:#C29B70'
  });

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);

  // Load Admin Data on mount or tab change
  const loadAdminData = async () => {
    const s = await api.getAdminStats();
    const p = await api.getProducts();
    const o = await api.getOrders();
    const c = await api.getAdminCustomers();

    if (s) setStats(s);
    if (p) setProductsList(p);
    if (o) setOrdersList(o);
    if (c) setCustomersList(c);
  };

  useEffect(() => {
    if (adminUser) {
      loadAdminData();
    }
  }, [adminUser, activeTab]);

  const handleAdminLogin = async (e) => {
    e?.preventDefault();
    const res = await api.adminLogin({ email: adminEmail, password: adminPassword });
    if (res && res.success) {
      setAdminUser(res.data);
      localStorage.setItem('aura_admin', JSON.stringify(res.data));
      addToast({
        type: 'success',
        title: 'Admin Access Granted',
        message: 'Welcome to the AURA Master Management Console.'
      });
      loadAdminData();
    } else {
      addToast({
        type: 'error',
        title: 'Authentication Failed',
        message: 'Invalid credentials. Use admin@aura.luxury / admin123'
      });
    }
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('aura_admin');
    addToast({
      type: 'info',
      title: 'Admin Session Ended',
      message: 'You have exited the administrative dashboard.'
    });
  };

  // Add Product Submit
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) {
      addToast({ type: 'error', title: 'Missing Info', message: 'Name and price are required.' });
      return;
    }

    const sizesArr = newProd.sizes ? newProd.sizes.split(',').map((s) => s.trim()) : ['Standard'];
    const colorsArr = newProd.colors
      ? newProd.colors.split(',').map((c) => {
          const [name, hex] = c.split(':');
          return { name: name?.trim() || 'Default', hex: hex?.trim() || '#000000' };
        })
      : [{ name: 'Default', hex: '#18181B' }];

    const payload = {
      name: newProd.name,
      category: newProd.category,
      brand: newProd.brand,
      price: Number(newProd.price),
      originalPrice: newProd.originalPrice ? Number(newProd.originalPrice) : Math.round(Number(newProd.price) * 1.25),
      stock: Number(newProd.stock) || 10,
      description: newProd.description || 'Artisanal luxury creation by AURA.',
      images: [newProd.imageUrl],
      sizes: sizesArr,
      colors: colorsArr
    };

    const res = await api.addProduct(payload);
    if (res && res.success) {
      addToast({
        type: 'success',
        title: 'Product Published!',
        message: `${newProd.name} is now live in the AURA catalog.`
      });
      setNewProd({
        name: '',
        category: 'Fashion',
        brand: 'Aura Atelier',
        price: '',
        originalPrice: '',
        stock: '15',
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=900&auto=format&fit=crop',
        sizes: 'XS, S, M, L, XL',
        colors: 'Onyx Black:#18181B, Camel Tan:#C29B70'
      });
      loadAdminData();
      setActiveTab('products');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the catalog?`)) {
      const res = await api.deleteProduct(productId);
      if (res && res.success) {
        addToast({ type: 'info', title: 'Product Deleted', message: `${name} has been removed.` });
        loadAdminData();
      }
    }
  };

  // Update Product Stock or Price
  const handleUpdateProductSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const res = await api.updateProduct(editingProduct.id, {
      name: editingProduct.name,
      price: editingProduct.price,
      stock: editingProduct.stock,
      description: editingProduct.description
    });

    if (res && res.success) {
      addToast({ type: 'success', title: 'Product Updated', message: `${editingProduct.name} updated.` });
      setEditingProduct(null);
      loadAdminData();
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const res = await api.updateOrderStatus(orderId, newStatus);
    if (res && res.success) {
      addToast({
        type: 'success',
        title: 'Order Status Updated',
        message: `Order #${orderId} changed to ${newStatus}. Client tracking updated.`
      });
      loadAdminData();
    }
  };

  // ---------------- VIEW 1: ADMIN LOGIN ----------------
  if (!adminUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 animate-fade-in">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-onyx-950 text-gold flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-onyx-950">
              AURA Master Console
            </h1>
            <p className="text-xs text-slate-500">
              Enter authorized administrator credentials to manage products, orders, and clients.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-onyx-950 hover:bg-aura-800 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md mt-2"
            >
              Authenticate & Enter Console
            </button>
          </form>

          {/* 1-Click Demo Admin Trigger */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-2">
            <button
              onClick={() => handleAdminLogin()}
              className="w-full py-2.5 rounded-xl bg-aura-50 hover:bg-aura-100 text-aura-900 text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-aura-200"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span>1-Click Sign In as Store Director (Demo)</span>
            </button>
            <p className="text-[11px] text-slate-400">Default: admin@aura.luxury / admin123</p>
          </div>

        </div>
      </div>
    );
  }

  // ---------------- VIEW 2: AUTHENTICATED ADMIN DASHBOARD ----------------
  const filteredProducts = productsList.filter((p) =>
    searchFilter ? p.name.toLowerCase().includes(searchFilter.toLowerCase()) || p.brand.toLowerCase().includes(searchFilter.toLowerCase()) : true
  );

  const filteredOrders = ordersList.filter((o) => {
    if (statusFilter !== 'all' && o.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      return (
        o.orderId.toLowerCase().includes(q) ||
        o.shippingAddress?.fullName?.toLowerCase().includes(q) ||
        o.customerInfo?.email?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const grossRevenue = ordersList.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Admin Header Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-onyx-950 text-white shadow-luxury flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold text-onyx-950 flex items-center justify-center font-serif text-xl font-extrabold shadow-sm">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold">AURA Executive Portal</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                System Live
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Logged in as <strong className="text-white">{adminUser.name}</strong> ({adminUser.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors flex items-center gap-1.5"
          >
            <span>View Storefront</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleAdminLogout}
            className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Admin Tab Navigation Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Overview & KPIs', icon: LayoutDashboard },
          { id: 'add-product', label: 'Add Product', icon: PlusCircle },
          { id: 'products', label: `Products (${productsList.length})`, icon: Layers },
          { id: 'orders', label: `Orders (${ordersList.length})`, icon: ShoppingBag },
          { id: 'customers', label: `Customers (${customersList.length})`, icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchFilter('');
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-onyx-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-onyx-950 hover:bg-white/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------- TAB 1: EXECUTIVE DASHBOARD OVERVIEW ---------------- */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Gross Revenue</span>
                <div className="w-8 h-8 rounded-xl bg-gold/15 text-gold flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="font-serif text-3xl font-bold text-onyx-950">
                {formatPrice(grossRevenue)}
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+24.5% compared to previous cycle</span>
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <p className="font-serif text-3xl font-bold text-onyx-950">
                {ordersList.length}
              </p>
              <p className="text-[11px] text-slate-500">
                {ordersList.filter((o) => o.status === 'Processing').length} pending dispatch
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Catalog Items</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <p className="font-serif text-3xl font-bold text-onyx-950">
                {productsList.length}
              </p>
              <p className="text-[11px] text-slate-500">Across 6 Luxury Universes</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">VIP Clients</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="font-serif text-3xl font-bold text-onyx-950">
                {customersList.length}
              </p>
              <p className="text-[11px] text-slate-500">Registered Privé Members</p>
            </div>

          </div>

          {/* Quick Actions & Recent Orders Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Recent Orders Overview */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-serif text-lg font-bold text-onyx-950">
                  Recent Atelier Transactions
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-aura-800 hover:text-aura-950 underline"
                >
                  View All Orders &rarr;
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {ordersList.slice(0, 5).map((order) => (
                  <div key={order.orderId} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Order #{order.orderId} • <span className="text-slate-500 font-normal">{order.shippingAddress?.fullName}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {order.date} • {order.items?.length || 1} items • {order.paymentMethod}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-900">{formatPrice(order.total)}</span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Management Shortcuts */}
            <div className="lg:col-span-4 bg-[#FAF8F5] p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-serif text-base font-bold text-onyx-950">
                Quick Actions
              </h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('add-product')}
                  className="w-full p-3.5 rounded-2xl bg-white hover:bg-aura-50 border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <PlusCircle className="w-4 h-4 text-gold" />
                    <span>Publish New Creation</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className="w-full p-3.5 rounded-2xl bg-white hover:bg-aura-50 border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-gold" />
                    <span>Fulfill Pending Orders</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab('customers')}
                  className="w-full p-3.5 rounded-2xl bg-white hover:bg-aura-50 border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-gold" />
                    <span>Inspect Client Accounts</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* Low Stock Warning Alert */}
              {productsList.filter((p) => p.stock < 10).length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-900 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Low Stock Advisory</span>
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    {productsList.filter((p) => p.stock < 10).length} creations currently have inventory below 10 units.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ---------------- TAB 2: ADD NEW PRODUCT PAGE ---------------- */}
      {activeTab === 'add-product' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
          
          {/* Add Product Form */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-aura-800">
                Inventory Addition
              </span>
              <h2 className="font-serif text-2xl font-bold text-onyx-950 mt-1">
                Add New Luxury Product
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill in the creation details below to immediately publish to the live store.
              </p>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  placeholder="e.g. Silk Charmeuse Gown, Wool Blazer, Ultrasonic Diffuser..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Category *
                  </label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600 bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Brand / Atelier *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProd.brand}
                    onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Sale Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    placeholder="e.g. 24900"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Original Price (₹ INR) (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newProd.originalPrice}
                    onChange={(e) => setNewProd({ ...newProd, originalPrice: e.target.value })}
                    placeholder="e.g. 32000"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Product Image URL (High-Res)
                </label>
                <input
                  type="url"
                  value={newProd.imageUrl}
                  onChange={(e) => setNewProd({ ...newProd, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Sizes (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={newProd.sizes}
                    onChange={(e) => setNewProd({ ...newProd, sizes: e.target.value })}
                    placeholder="XS, S, M, L, XL"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Colors (Name:Hex, separated by comma)
                  </label>
                  <input
                    type="text"
                    value={newProd.colors}
                    onChange={(e) => setNewProd({ ...newProd, colors: e.target.value })}
                    placeholder="Onyx:#18181B, Gold:#D4AF37"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Editorial Description & Craftsmanship Details
                </label>
                <textarea
                  rows={3}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  placeholder="Explain the silhouette, materials, and tactile experience..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-onyx-950 hover:bg-aura-800 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-gold" />
                <span>Publish Product to Store</span>
              </button>
            </form>
          </div>

          {/* Live Preview Card */}
          <div className="lg:col-span-4 bg-[#FAF8F5] p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 sticky top-24">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Live Store Preview
            </span>

            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
              <img
                src={newProd.imageUrl || 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=900&auto=format&fit=crop'}
                alt="preview"
                className="w-full aspect-[3/4] object-cover"
              />
              <div className="p-4 space-y-1.5">
                <div className="flex justify-between text-[10px] text-aura-800 font-bold uppercase">
                  <span>{newProd.brand || 'Aura Atelier'}</span>
                  <span className="text-slate-400">{newProd.category}</span>
                </div>
                <h4 className="font-serif text-sm font-bold text-slate-900 line-clamp-1">
                  {newProd.name || 'Product Title Preview'}
                </h4>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-sm font-bold text-slate-900">
                    {formatPrice(Number(newProd.price) || 290)}
                  </span>
                  {newProd.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      {formatPrice(Number(newProd.originalPrice))}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ---------------- TAB 3: VIEW ALL PRODUCTS PAGE ---------------- */}
      {activeTab === 'products' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-serif text-xl font-bold text-onyx-950">
                Product Catalog Management
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {productsList.length} total active creations in database
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search products..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                />
              </div>

              <button
                onClick={() => setActiveTab('add-product')}
                className="px-4 py-2 rounded-xl bg-onyx-950 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-gold" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700 divide-y divide-slate-100">
              <thead>
                <tr className="text-[11px] uppercase font-bold text-slate-400 bg-slate-50">
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-10 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate max-w-xs">{p.name}</p>
                        <p className="text-[10px] text-slate-400">{p.brand} • SKU: AU-{p.id}</p>
                      </div>
                    </td>

                    <td className="p-3 font-semibold text-slate-700">{p.category}</td>

                    <td className="p-3 font-bold text-slate-900">{formatPrice(p.price)}</td>

                    <td className="p-3">
                      <span className={`font-bold ${p.stock < 10 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {p.stock} units
                      </span>
                    </td>

                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          p.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {p.stock > 0 ? 'In Stock' : 'Sold Out'}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-black hover:bg-slate-100"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ---------------- TAB 4: VIEW ORDERS PAGE ---------------- */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-serif text-xl font-bold text-onyx-950">
                Order Fulfillment & Tracking
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage client orders and update live shipping milestones
              </p>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 outline-none"
              >
                <option value="all">All Statuses ({ordersList.length})</option>
                <option value="Processing">Processing</option>
                <option value="Artisan Packaging">Artisan Packaging</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700 divide-y divide-slate-100">
              <thead>
                <tr className="text-[11px] uppercase font-bold text-slate-400 bg-slate-50">
                  <th className="p-3">Order ID & Date</th>
                  <th className="p-3">Customer & Delivery</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((o) => (
                  <tr key={o.orderId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3">
                      <p className="font-bold text-slate-900">#{o.orderId}</p>
                      <p className="text-[10px] text-slate-400">{o.date}</p>
                      <span className="text-[10px] text-aura-800 font-mono block mt-0.5">
                        {o.trackingNumber}
                      </span>
                    </td>

                    <td className="p-3">
                      <p className="font-bold text-slate-900">{o.shippingAddress?.fullName || 'Client'}</p>
                      <p className="text-[10px] text-slate-500">
                        {o.shippingAddress?.city}, {o.shippingAddress?.state} {o.shippingAddress?.zip}
                      </p>
                      <p className="text-[10px] text-slate-400">{o.customerInfo?.email}</p>
                    </td>

                    <td className="p-3">
                      <p className="font-semibold text-slate-800">{o.items?.length || 1} items</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-xs">
                        {o.items?.[0]?.product?.name}
                      </p>
                    </td>

                    <td className="p-3 font-serif font-bold text-slate-900 text-sm">
                      {formatPrice(o.total)}
                    </td>

                    <td className="p-3">
                      <span className="inline-block text-[11px] font-medium text-slate-700">
                        {o.paymentMethod || 'Credit Card'}
                      </span>
                    </td>

                    <td className="p-3">
                      {/* Live Status Selector */}
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.orderId, e.target.value)}
                        className="text-xs font-bold py-1.5 px-2.5 rounded-xl border border-slate-200 bg-white outline-none cursor-pointer focus:border-aura-700"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Artisan Packaging">Artisan Packaging</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ---------------- TAB 5: VIEW CUSTOMERS PAGE ---------------- */}
      {activeTab === 'customers' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fade-in">
          
          <div className="pb-4 border-b border-slate-100">
            <h2 className="font-serif text-xl font-bold text-onyx-950">
              Registered Privé Clientele Directory
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {customersList.length} registered VIP club members
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customersList.map((c) => (
              <div key={c.id} className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 space-y-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                    alt={c.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-serif text-sm font-bold text-slate-900">{c.name}</h3>
                    <p className="text-xs text-slate-400">{c.email}</p>
                    <span className="inline-block text-[10px] font-bold text-gold-dark bg-gold/15 px-2 py-0.5 rounded-full mt-1">
                      {c.tier || 'AURA Privé'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase">Orders Placed</p>
                    <p className="font-bold text-slate-900">{c.orderCount || 1}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase">Total Spend</p>
                    <p className="font-bold text-slate-900">{formatPrice(c.totalSpent || 455)}</p>
                  </div>
                </div>

                {c.savedAddresses?.[0] && (
                  <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600">
                    <p className="text-[10px] text-slate-400 uppercase">Primary Residence</p>
                    <p>{c.savedAddresses[0].street}, {c.savedAddresses[0].city}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 animate-slide-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Edit Product: {editingProduct.name}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="p-1 text-slate-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProductSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Price (₹ INR)</label>
                <input
                  type="number"
                  required
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Inventory Stock Units</label>
                <input
                  type="number"
                  required
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-onyx-950 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
