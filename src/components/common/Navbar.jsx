import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES, CURRENCIES } from '../../data/products';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  LogOut,
  Package,
  Globe
} from 'lucide-react';

export const Navbar = () => {
  const {
    currentPage,
    navigateTo,
    totalCartCount,
    wishlist,
    setIsCartOpen,
    setIsSearchOpen,
    user,
    logout,
    currency,
    setCurrency
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  
  // Announcement banner rotation
  const announcements = [
    '✨ Complimentary Global Express Delivery on orders over ₹5,000',
    '💎 Use code AURA20 for 20% off your curated wardrobe',
    '🌿 Conscious Luxury — 100% Sustainable & Ethical Sourcing',
    '🛡️ 30-Day Hassle-Free Returns & Dedicated 24/7 Concierge'
  ];
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategorySelect = (categorySlug) => {
    setIsCategoryDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigateTo('shop', null, categorySlug);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      
      {/* Top Announcement Bar */}
      <div className="bg-onyx-950 text-white text-[11px] font-medium py-2 px-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4 text-slate-400">
            <span>24/7 Concierge: <strong className="text-white">+1 (800) 928-AURA</strong></span>
          </div>

          <div className="flex-1 text-center font-medium tracking-wide text-gold-light animate-fade-in flex items-center justify-center gap-1.5">
            <span>{announcements[announcementIndex]}</span>
          </div>

          {/* Currency Selector & Admin Portal Shortcut */}
          <div className="relative hidden md:flex items-center gap-3">
            <button
              onClick={() => navigateTo('admin')}
              className="px-2.5 py-0.5 rounded-full bg-gold/20 text-gold-light border border-gold/40 hover:bg-gold hover:text-onyx-950 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 shadow-xs"
              title="AURA Management Console"
            >
              <ShieldCheck className="w-3 h-3 text-gold" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-gold" />
              <span>{currency.code} ({currency.symbol})</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isCurrencyDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-xl py-1.5 text-slate-800 border border-slate-100 z-50 animate-slide-down">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c);
                      setIsCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-aura-50 ${
                      currency.code === c.code ? 'font-bold text-aura-900 bg-aura-100/50' : ''
                    }`}
                  >
                    <span>{c.code}</span>
                    <span className="text-slate-400">{c.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'glass-header shadow-md py-3.5 border-b border-slate-200/70'
            : 'bg-white/95 backdrop-blur-md py-4 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Left: Mobile Menu Toggle & Desktop Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-slate-700 hover:text-black rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-slate-700">
              <button
                onClick={() => navigateTo('home')}
                className={`transition-colors hover:text-aura-900 relative py-1 ${
                  currentPage === 'home' ? 'text-onyx-950 font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-onyx-950' : ''
                }`}
              >
                Home
              </button>

              {/* Categories Mega Dropdown Trigger */}
              <div
                className="relative py-1"
                onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                onMouseLeave={() => setIsCategoryDropdownOpen(false)}
              >
                <button
                  onClick={() => navigateTo('shop')}
                  className={`flex items-center gap-1 transition-colors hover:text-aura-900 ${
                    currentPage === 'shop' ? 'text-onyx-950 font-bold' : ''
                  }`}
                >
                  <span>Collections</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180 text-aura-800' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-2xl p-4 border border-slate-100 z-50 animate-slide-down">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">
                      Shop By Category
                    </div>
                    <div className="space-y-1">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat.slug)}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-aura-50 transition-colors text-left group"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-800 group-hover:text-aura-900">
                              {cat.name}
                            </p>
                            <p className="text-[10px] text-slate-400">{cat.itemCount}</p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-aura-700 group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setIsCategoryDropdownOpen(false);
                          navigateTo('shop');
                        }}
                        className="w-full text-center text-xs font-bold text-aura-800 hover:text-aura-950 py-1"
                      >
                        Explore Complete Catalog &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigateTo('shop')}
                className="transition-colors hover:text-aura-900"
              >
                Shop All
              </button>

              <button
                onClick={() => navigateTo('about')}
                className={`transition-colors hover:text-aura-900 py-1 ${
                  currentPage === 'about' ? 'text-onyx-950 font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-onyx-950' : ''
                }`}
              >
                The Atelier
              </button>
            </div>
          </div>

          {/* Center: Brand Logo */}
          <div className="text-center">
            <button
              onClick={() => navigateTo('home')}
              className="flex flex-col items-center group cursor-pointer focus:outline-none"
            >
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-[0.25em] text-onyx-950 group-hover:text-aura-800 transition-colors uppercase">
                AURA
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-aura-700 font-semibold -mt-1 group-hover:text-onyx-900 transition-colors">
                Your Style. Your Aura.
              </span>
            </button>
          </div>

          {/* Right: Actions (Search, Wishlist, User, Cart) */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-600 transition-colors text-xs"
              title="Search (Cmd+K)"
            >
              <Search className="w-4 h-4 text-slate-700" />
              <span className="hidden md:inline text-[11px] text-slate-500 font-medium">Search...</span>
              <kbd className="hidden lg:inline text-[9px] bg-white px-1.5 py-0.5 rounded shadow-xs text-slate-400 font-sans border border-slate-200">
                ⌘K
              </kbd>
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => navigateTo('wishlist')}
              className={`relative p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors ${
                currentPage === 'wishlist' ? 'text-rose-500 bg-rose-50' : ''
              }`}
              title="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-rose-500/10 text-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse-subtle">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full bg-onyx-900 text-white hover:bg-aura-800 transition-colors shadow-sm"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 min-w-[20px] h-5 rounded-full bg-gold text-onyx-950 text-[10px] font-black flex items-center justify-center shadow-md border-2 border-white">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* User Account / Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-aura-400 transition-all"
                title="Account"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl p-4 border border-slate-100 z-50 animate-slide-down"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  {user ? (
                    <div>
                      {/* User Header */}
                      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                          <span className="inline-block text-[10px] font-semibold text-aura-800 bg-aura-50 px-2 py-0.5 rounded-full mt-0.5">
                            {user.tier}
                          </span>
                        </div>
                      </div>

                      {/* Menu Links */}
                      <div className="py-2 space-y-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigateTo('auth');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>My VIP Account</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigateTo('auth');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                        >
                          <Package className="w-4 h-4 text-slate-400" />
                          <span>Order History</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigateTo('admin');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-aura-900 bg-aura-50/70 hover:bg-aura-100 transition-colors text-left"
                        >
                          <ShieldCheck className="w-4 h-4 text-gold" />
                          <span>Admin Management Portal</span>
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2 space-y-3">
                      <p className="text-xs font-semibold text-slate-800">Welcome to AURA</p>
                      <p className="text-[11px] text-slate-500">Sign in to access VIP privileges and order tracking.</p>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigateTo('auth');
                        }}
                        className="w-full py-2 rounded-xl bg-onyx-900 text-white text-xs font-bold hover:bg-aura-800 transition-colors"
                      >
                        Sign In / Register
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col justify-between p-6 animate-slide-left">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex flex-col">
                  <span className="font-serif text-xl font-bold tracking-widest text-slate-900">AURA</span>
                  <span className="text-[8px] uppercase tracking-widest text-aura-700 font-semibold">Your Style. Your Aura.</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:text-black rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="py-6 space-y-4">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('home');
                  }}
                  className="w-full text-left font-serif text-lg font-bold text-slate-900 hover:text-aura-800"
                >
                  Home
                </button>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Categories
                  </p>
                  <div className="space-y-2 pl-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.slug)}
                        className="w-full flex items-center justify-between py-1.5 text-sm font-medium text-slate-700 hover:text-aura-800 text-left"
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs text-slate-400">{cat.itemCount}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('shop');
                  }}
                  className="w-full text-left font-serif text-lg font-bold text-slate-900 hover:text-aura-800"
                >
                  All Products
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('about');
                  }}
                  className="w-full text-left font-serif text-lg font-bold text-slate-900 hover:text-aura-800"
                >
                  The Atelier (About Us)
                </button>
              </div>
            </div>

            {/* Bottom Actions in Drawer */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateTo('auth');
                }}
                className="w-full py-3 rounded-xl bg-onyx-900 text-white text-xs font-bold uppercase tracking-wider text-center"
              >
                {user ? `Account (${user.name})` : 'Sign In / Register'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
