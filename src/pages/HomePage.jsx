import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES, PRODUCTS, REVIEWS } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Star,
  Clock,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Flame,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { InstagramIcon } from '../components/common/SocialIcons';

export const HomePage = () => {
  const { navigateTo, formatPrice, addToCart } = useShop();

  // Active tab for Trending vs Best Sellers vs New
  const [activeTab, setActiveTab] = useState('trending');

  // Flash Sale Countdown Timer (Hours, Minutes, Seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 36,
    seconds: 48
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter products by active tab
  const getTabProducts = () => {
    if (activeTab === 'trending') {
      return PRODUCTS.filter((p) => p.isTrending).slice(0, 8);
    } else if (activeTab === 'bestsellers') {
      return PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8);
    } else if (activeTab === 'new') {
      return PRODUCTS.filter((p) => p.isNew).slice(0, 8);
    }
    return PRODUCTS.slice(0, 8);
  };

  // Flash deal spotlight product (e.g. AURA Studio Wireless ANC Headphones)
  const flashProduct = PRODUCTS.find((p) => p.id === 'prod-elec-1') || PRODUCTS[0];

  return (
    <div className="space-y-20 sm:space-y-28">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-[#F7F4F0] border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Editorial Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-aura-300/80 shadow-xs backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span className="text-xs font-bold uppercase tracking-widest text-onyx-950">
                  Autumn / Winter 2026 Collection
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-onyx-950 tracking-tight leading-[1.15]">
                Discover <span className="gold-gradient-text italic font-normal">Your Aura.</span>
                <br />
                Curated Luxury for the Exceptional.
              </h1>

              {/* Tagline / Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Immerse yourself in a world of masterfully crafted apparel, pure botanical beauty rituals, precision electronics, and sculptural homeware.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
                <button
                  onClick={() => navigateTo('shop')}
                  className="px-8 py-4 rounded-xl bg-onyx-950 hover:bg-aura-800 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-luxury hover:shadow-luxury-hover flex items-center gap-2.5 group"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>

                <button
                  onClick={() => navigateTo('about')}
                  className="px-8 py-4 rounded-xl bg-white hover:bg-aura-50 text-slate-800 text-xs font-bold uppercase tracking-widest border border-slate-200 transition-colors shadow-xs"
                >
                  The AURA Story
                </button>
              </div>

              {/* Trust Micro-Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-onyx-950">50K+</p>
                  <p className="text-[11px] text-slate-500 font-medium">Privé Members</p>
                </div>
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-onyx-950">100%</p>
                  <p className="text-[11px] text-slate-500 font-medium">Artisanal Quality</p>
                </div>
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-onyx-950">4.9★</p>
                  <p className="text-[11px] text-slate-500 font-medium">Client Rating</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase with Floating Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Hero Visual Card */}
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1000&auto=format&fit=crop"
                    alt="AURA Autumn Luxury Coat"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gold-light bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      Editorial Highlight
                    </span>
                    <h3 className="font-serif text-xl font-bold mt-2">Tailored Mongolian Cashmere</h3>
                    <p className="text-xs text-slate-200 mt-0.5">Handmade in Biella, Italy</p>
                  </div>
                </div>

                {/* Floating Micro-Card: Fast Delivery */}
                <div className="absolute -top-4 -left-4 sm:-left-8 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-luxury border border-white/60 flex items-center gap-3 animate-float hidden sm:flex">
                  <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Complimentary Express</p>
                    <p className="text-[10px] text-slate-500">Orders over ₹5,000</p>
                  </div>
                </div>

                {/* Floating Micro-Card: Product Preview */}
                <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-luxury border border-white/80 max-w-[210px] hidden sm:block animate-pulse-subtle">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-amber-500 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">4.95 / 5.0</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 line-clamp-1">Lumière Facial Elixir</p>
                  <p className="text-xs font-semibold text-aura-800">{formatPrice(7999)}</p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-aura-800">
            Curated Universes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-onyx-950 mt-1">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Each category represents the finest expressions of form, comfort, and mindful design.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateTo('shop', null, cat.slug)}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 aspect-[3/4] shadow-sm hover:shadow-luxury cursor-pointer transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors" />

              <div className="absolute bottom-4 inset-x-4 text-white text-center">
                <p className="font-serif text-sm sm:text-base font-bold group-hover:text-gold-light transition-colors">
                  {cat.name}
                </p>
                <p className="text-[10px] text-slate-300 mt-0.5">{cat.itemCount}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TRENDING / BEST SELLERS / NEW TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-aura-800">
              The Aura Selection
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-onyx-950 mt-1">
              Curated Highlights
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 border border-slate-200/80">
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'trending'
                  ? 'bg-white text-onyx-950 shadow-sm'
                  : 'text-slate-600 hover:text-onyx-950'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Trending</span>
            </button>

            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'bestsellers'
                  ? 'bg-white text-onyx-950 shadow-sm'
                  : 'text-slate-600 hover:text-onyx-950'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-gold" />
              <span>Best Sellers</span>
            </button>

            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'new'
                  ? 'bg-white text-onyx-950 shadow-sm'
                  : 'text-slate-600 hover:text-onyx-950'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-aura-700" />
              <span>New Arrivals</span>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {getTabProducts().map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View all button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigateTo('shop')}
            className="px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 text-onyx-950 border border-slate-300 text-xs font-bold uppercase tracking-widest transition-all shadow-sm inline-flex items-center gap-2 group"
          >
            <span>Explore All {PRODUCTS.length} Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* 4. FLASH DEAL SPOTLIGHT WITH COUNTDOWN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-onyx-950 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Offer Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-widest">
                <Zap className="w-3.5 h-3.5" />
                <span>Limited Edition Privé Drop</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                {flashProduct.name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                {flashProduct.shortDescription || flashProduct.description}
              </p>

              {/* Price & Savings */}
              <div className="flex items-baseline gap-4">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-gold">
                  {formatPrice(flashProduct.price)}
                </span>
                <span className="text-base text-slate-400 line-through">
                  {formatPrice(flashProduct.originalPrice)}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white text-xs font-bold">
                  SAVE {flashProduct.discount}%
                </span>
              </div>

              {/* Countdown Timer Block */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  <span>Offer Ends In:</span>
                </p>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-center min-w-[64px]">
                    <span className="font-serif text-2xl font-bold text-white block">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase">Hours</span>
                  </div>
                  <span className="text-xl font-bold text-gold">:</span>
                  <div className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-center min-w-[64px]">
                    <span className="font-serif text-2xl font-bold text-white block">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase">Mins</span>
                  </div>
                  <span className="text-xl font-bold text-gold">:</span>
                  <div className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-center min-w-[64px]">
                    <span className="font-serif text-2xl font-bold text-white block text-gold">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase">Secs</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => addToCart(flashProduct, 1)}
                  className="px-8 py-4 rounded-xl bg-gold hover:bg-gold-light text-onyx-950 text-xs font-bold uppercase tracking-widest transition-all shadow-lg flex items-center gap-2"
                >
                  <span>Claim Exclusive Offer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigateTo('product-detail', flashProduct.id)}
                  className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors"
                >
                  View Specifications
                </button>
              </div>
            </div>

            {/* Right Product Spotlight Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative aspect-square w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-onyx-900">
                <img
                  src={flashProduct.images[0]}
                  alt={flashProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. EDITORIAL LOOKBOOK SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Editorial Card 1 */}
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] bg-slate-900 shadow-xl group">
            <img
              src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop"
              alt="The Evening Aura"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
                Collection Edition
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">The Silk Charmeuse Evening</h3>
              <p className="text-xs text-slate-300 max-w-md">
                Pure grade 6A mulberry silk draped with sensual fluid grace.
              </p>
              <button
                onClick={() => navigateTo('shop', null, 'fashion')}
                className="pt-2 text-xs font-bold uppercase tracking-wider text-white hover:text-gold flex items-center gap-1.5 transition-colors"
              >
                <span>Discover Lookbook</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Editorial Card 2 */}
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] bg-slate-900 shadow-xl group">
            <img
              src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1000&auto=format&fit=crop"
              alt="Living Sanctuary"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
                Atelier Sanctuary
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">Mindful Living & Aromatics</h3>
              <p className="text-xs text-slate-300 max-w-md">
                Handmade stone diffusers and Belgian pure flax linen for the restorative home.
              </p>
              <button
                onClick={() => navigateTo('shop', null, 'home-lifestyle')}
                className="pt-2 text-xs font-bold uppercase tracking-wider text-white hover:text-gold flex items-center gap-1.5 transition-colors"
              >
                <span>Shop Homeware</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. VERIFIED CLIENT REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-aura-800">
            Verified Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-onyx-950 mt-1">
            Voices of the Privé Club
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Read authentic impressions from our global clientele across Paris, London, Milan, and New York.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>

                <h4 className="font-serif text-sm font-bold text-slate-900 leading-snug">
                  "{review.title}"
                </h4>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-4">
                  {review.comment}
                </p>
              </div>

              {/* Reviewer info */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.userName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{review.userName}</p>
                  <p className="text-[10px] text-slate-400">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. INSTAGRAM / COMMUNITY GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-aura-800">
              #AuraStyle
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-onyx-950 mt-0.5">
              Styled by You
            </h2>
          </div>
          <a
            href="#instagram"
            onClick={(e) => e.preventDefault()}
            className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-aura-800 flex items-center gap-2"
          >
            <InstagramIcon className="w-4 h-4 text-gold" />
            <span>Follow @aura.atelier</span>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            { img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop', user: '@sophie.vogue' },
            { img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop', user: '@marcus.audio' },
            { img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop', user: '@charlotte.noir' },
            { img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop', user: '@julian.atelier' },
            { img: 'https://images.unsplash.com/photo-1608248597359-01a55f8ff0f8?q=80&w=600&auto=format&fit=crop', user: '@elena.glow' },
            { img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop', user: '@david.sneakers' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden aspect-square bg-slate-100 shadow-sm cursor-pointer"
            >
              <img
                src={item.img}
                alt="Community styled photo"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center">
                <InstagramIcon className="w-5 h-5 text-gold mb-1" />
                <span className="text-[11px] font-bold">{item.user}</span>
                <span className="text-[9px] text-slate-300">Shop Look</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
