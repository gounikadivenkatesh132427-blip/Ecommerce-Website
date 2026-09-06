import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Package,
  Clock,
  MapPin,
  LogOut,
  Award,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const AuthPage = () => {
  const {
    user,
    login,
    signup,
    logout,
    switchDemoUser,
    orders,
    formatPrice,
    navigateTo
  } = useShop();

  // Auth mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Active dashboard tab if logged in
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'rewards'

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(email || 'emma.laurent@aura.luxury', password || 'password123');
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    signup({ firstName: firstName || 'Emma', lastName: lastName || 'Laurent', email: email || 'emma@aura.luxury' });
  };

  // ---------------- VIEW A: LOGGED IN DASHBOARD ----------------
  if (user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <button onClick={() => navigateTo('home')} className="hover:text-slate-900 transition-colors">
            Home
          </button>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Client Dashboard</span>
        </div>

        {/* User VIP Header Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-onyx-950 via-slate-900 to-onyx-900 text-white shadow-luxury flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
          <div className="flex items-center gap-5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-gold shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold">{user.name}</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-gold text-onyx-950 px-2.5 py-0.5 rounded-full">
                  {user.tier}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{user.email}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-gold-light">
                <span className="flex items-center gap-1 font-semibold">
                  <Award className="w-4 h-4 text-gold" />
                  {user.points || 1200} Privé Reward Points
                </span>
                <span>•</span>
                <span className="text-slate-400">Privé Member since {user.memberSince || '2023'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => logout()}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs & Content */}
        <div className="space-y-6">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 gap-6 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'border-onyx-950 text-onyx-950'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Order History ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'addresses'
                  ? 'border-onyx-950 text-onyx-950'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Saved Residences</span>
            </button>

            <button
              onClick={() => setActiveTab('rewards')}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'rewards'
                  ? 'border-onyx-950 text-onyx-950'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span>Privé Privileges</span>
            </button>
          </div>

          {/* TAB 1: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
                  <Package className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <h3 className="font-serif text-lg font-bold text-slate-900">No Past Orders Found</h3>
                  <p className="text-xs text-slate-500 mt-1">Once you complete a purchase, you can track it live here.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base font-bold text-slate-900">
                            Order #{order.orderId}
                          </span>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>Placed on {order.date}</span>
                          <span>•</span>
                          <span>Tracking: {order.trackingNumber}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-serif text-lg font-bold text-onyx-950">
                          {formatPrice(order.total)}
                        </span>
                        <p className="text-[11px] text-slate-400">{order.items.length} items</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-14 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{item.product.name}</p>
                            <p className="text-[10px] text-slate-500">Qty: {item.quantity} • {item.selectedSize}</p>
                            <p className="text-xs font-semibold text-slate-800 mt-1">{formatPrice(item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tracking Timeline */}
                    <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-100">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        {order.trackingSteps?.map((step, idx) => (
                          <div key={idx} className="p-2">
                            <div className={`w-3 h-3 rounded-full mx-auto mb-1.5 ${step.completed ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                            <p className="font-bold text-slate-900 text-[11px]">{step.label}</p>
                            <p className="text-[9px] text-slate-400">{step.date}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: SAVED RESIDENCES */}
          {activeTab === 'addresses' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.savedAddresses?.map((addr) => (
                <div key={addr.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-base font-bold text-slate-900">{addr.title}</h4>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-aura-800 bg-aura-50 px-2 py-0.5 rounded-full uppercase">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>{addr.fullName}</strong>
                    <br />
                    {addr.street}
                    <br />
                    {addr.city}, {addr.state} {addr.zip}, {addr.country}
                    <br />
                    Phone: {addr.phone}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: PRIVÉ PRIVILEGES */}
          {activeTab === 'rewards' && (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
              <h3 className="font-serif text-xl font-bold text-slate-900">
                AURA Black VIP Privileges
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600">
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-slate-100 space-y-2">
                  <Sparkles className="w-5 h-5 text-gold" />
                  <h4 className="font-serif text-sm font-bold text-slate-900">Private Pre-Releases</h4>
                  <p>72-hour early access to seasonal capsule collections and limited-edition runs.</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-slate-100 space-y-2">
                  <Award className="w-5 h-5 text-gold" />
                  <h4 className="font-serif text-sm font-bold text-slate-900">Complimentary Courier</h4>
                  <p>Unlimited free express delivery on all orders without threshold limits.</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-slate-100 space-y-2">
                  <User className="w-5 h-5 text-gold" />
                  <h4 className="font-serif text-sm font-bold text-slate-900">Dedicated Stylist</h4>
                  <p>Personal 1-on-1 virtual consultations with an atelier fashion advisor.</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    );
  }

  // ---------------- VIEW B: SIGN IN / REGISTER FORM ----------------
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Side: Brand Visual & Manifesto */}
        <div className="md:col-span-5 bg-onyx-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-white">AURA</span>
              <span className="text-[9px] uppercase tracking-widest text-gold font-semibold">Your Style. Your Aura.</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-snug pt-4">
              Enter the Privé Sanctuary
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Create an account to track deliveries live, save your favorite pieces, and receive invitations to private drops.
            </p>
          </div>

          {/* Quick Demo Login Triggers */}
          <div className="relative pt-8 mt-8 border-t border-white/10 space-y-3">
            <p className="text-[10px] uppercase font-bold tracking-widest text-gold">
              Quick 1-Click Demo Accounts:
            </p>
            <button
              onClick={() => switchDemoUser('emma')}
              className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-between border border-white/15 transition-colors"
            >
              <span>Emma Laurent (VIP Black)</span>
              <ArrowRight className="w-3.5 h-3.5 text-gold" />
            </button>
            <button
              onClick={() => switchDemoUser('alex')}
              className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-between border border-white/15 transition-colors"
            >
              <span>Alexander Chen (Gold)</span>
              <ArrowRight className="w-3.5 h-3.5 text-gold" />
            </button>
          </div>
        </div>

        {/* Right Side: Authentication Forms */}
        <div className="md:col-span-7 p-8 sm:p-10">
          
          {/* Mode Switch Tabs */}
          <div className="flex border-b border-slate-100 mb-6">
            <button
              onClick={() => setAuthMode('login')}
              className={`pb-3 font-serif text-base font-bold transition-colors mr-6 border-b-2 ${
                authMode === 'login'
                  ? 'border-onyx-950 text-onyx-950'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`pb-3 font-serif text-base font-bold transition-colors border-b-2 ${
                authMode === 'register'
                  ? 'border-onyx-950 text-onyx-950'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* SIGN IN FORM */}
          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="emma.laurent@aura.luxury"
                    className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Password
                  </label>
                  <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] text-aura-800 hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-10 pr-10 py-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded accent-onyx-900"
                  />
                  <span>Remember my credentials</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-onyx-950 hover:bg-aura-800 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md mt-2"
              >
                Sign In to Account
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Emma"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Laurent"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                />
              </div>

              <p className="text-[11px] text-slate-400">
                By registering, you agree to the AURA Privé Terms & Privacy Policy.
              </p>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-onyx-950 hover:bg-aura-800 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md mt-2"
              >
                Create Privé Account
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
