import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Sparkles,
  Share2,
  Ruler,
  X,
  ArrowRight,
  Plus,
  Minus,
  MessageSquare,
  ThumbsUp,
  CheckCircle2
} from 'lucide-react';

export const ProductDetailPage = () => {
  const {
    currentProductId,
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
    navigateTo,
    addToast
  } = useShop();

  // Find product by id or default to first product
  const product = PRODUCTS.find((p) => p.id === currentProductId) || PRODUCTS[0];

  // Gallery & Options State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : 'Standard');
  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Bundle Add-on State
  const bundleAddon = PRODUCTS.find((p) => p.id !== product.id && p.category === product.category) || PRODUCTS[1];
  const [includeBundleAddon, setIncludeBundleAddon] = useState(true);

  // New Review Form State
  const [userReviews, setUserReviews] = useState([
    {
      id: 'usr-rev-1',
      name: 'Victoria S.',
      rating: 5,
      date: '3 days ago',
      title: 'Perfection in every seam',
      comment: 'The quality of materials and exquisite packaging made unboxing an absolute delight. Fits true to size and feels wonderfully luxurious.',
      verified: true
    },
    {
      id: 'usr-rev-2',
      name: 'Marcus K.',
      rating: 5,
      date: '1 week ago',
      title: 'A true investment piece',
      comment: 'I wear this constantly. The craftsmanship holds up impeccably and I always receive compliments.',
      verified: true
    }
  ]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');

  // Reset states when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setSelectedSize(product.sizes ? product.sizes[0] : 'Standard');
    setSelectedColor(product.colors ? product.colors[0] : null);
    setQuantity(1);
    setActiveTab('description');
  }, [product]);

  const isWishlisted = isInWishlist(product.id);
  const relatedProducts = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    navigateTo('checkout');
  };

  const handleBundleAddToCart = () => {
    addToCart(product, 1, selectedSize, selectedColor);
    if (includeBundleAddon) {
      addToCart(bundleAddon, 1, bundleAddon.sizes ? bundleAddon.sizes[0] : 'Standard', bundleAddon.colors ? bundleAddon.colors[0] : null);
    }
    addToast({
      type: 'success',
      title: 'Bundle Added!',
      message: 'Both items added to your bag with bundle savings.'
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        type: 'info',
        title: 'Link Copied',
        message: 'Product link copied to your clipboard.'
      });
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewTitle || !reviewComment || !reviewerName) {
      addToast({
        type: 'error',
        title: 'Incomplete Review',
        message: 'Please fill in all review fields.'
      });
      return;
    }
    const newRev = {
      id: 'rev-' + Date.now(),
      name: reviewerName,
      rating: reviewRating,
      date: 'Just now',
      title: reviewTitle,
      comment: reviewComment,
      verified: true
    };
    setUserReviews([newRev, ...userReviews]);
    setReviewTitle('');
    setReviewComment('');
    setReviewerName('');
    addToast({
      type: 'success',
      title: 'Review Published',
      message: 'Thank you for sharing your feedback with the AURA community!'
    });
  };

  const bundleTotal = includeBundleAddon ? (product.price + bundleAddon.price) * 0.9 : product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <button onClick={() => navigateTo('home')} className="hover:text-slate-900 transition-colors">
          Home
        </button>
        <span>/</span>
        <button onClick={() => navigateTo('shop', null, product.categorySlug)} className="hover:text-slate-900 transition-colors capitalize">
          {product.category}
        </button>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Section: Gallery (Left) & Purchasing Info (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Large Image */}
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#FAF8F5] border border-slate-200/80 shadow-md group">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isBestSeller && (
                <span className="bg-aura-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Best Seller
                </span>
              )}
              {product.discount > 0 && (
                <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* Quick Share Button */}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md backdrop-blur-sm transition-all"
              title="Share Product Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-24 h-28 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-slate-50 ${
                    selectedImageIndex === idx
                      ? 'border-onyx-950 scale-105 shadow-md'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Product angle" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Value Highlights Pill Bar */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
            <div className="p-3 rounded-2xl bg-white border border-slate-100 flex flex-col items-center">
              <Truck className="w-4 h-4 text-gold mb-1" />
              <span className="text-[11px] font-bold text-slate-800">Free Express</span>
              <span className="text-[9px] text-slate-400">Orders over ₹5,000</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-100 flex flex-col items-center">
              <RotateCcw className="w-4 h-4 text-gold mb-1" />
              <span className="text-[11px] font-bold text-slate-800">30-Day Returns</span>
              <span className="text-[9px] text-slate-400">Pre-paid packaging</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-100 flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-gold mb-1" />
              <span className="text-[11px] font-bold text-slate-800">Artisan Authenticity</span>
              <span className="text-[9px] text-slate-400">100% Certified</span>
            </div>
          </div>

        </div>

        {/* Right: Purchasing Details & Configuration */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Brand & Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs uppercase tracking-widest font-extrabold text-aura-800">
                {product.brand}
              </span>
              <span className="text-xs text-slate-400 font-medium">SKU: AU-{product.id}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-onyx-950 leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars & Reviews Counter */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-amber-500 text-sm">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="font-bold ml-1.5 text-slate-900">{product.rating}</span>
              </div>
              <span className="text-xs text-slate-300">•</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-xs text-slate-600 hover:text-aura-800 font-semibold underline"
              >
                {product.reviewsCount + userReviews.length} Verified Reviews
              </button>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-slate-200/80 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl font-bold text-onyx-950">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {product.discount > 0 && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                Save {formatPrice(product.originalPrice - product.price)} ({product.discount}%)
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>
                  Color: <strong className="text-slate-900">{selectedColor?.name}</strong>
                </span>
              </div>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border-2 ${
                      selectedColor?.name === c.name
                        ? 'border-onyx-950 scale-110 shadow-md'
                        : 'border-slate-200 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor?.name === c.name && (
                      <Check className={`w-4 h-4 ${['#FFFFFF', '#FAF8F5', '#FAFAFA'].includes(c.hex) ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector + Size Guide Trigger */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>
                  Size: <strong className="text-slate-900">{selectedSize}</strong>
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-aura-800 hover:text-aura-950 font-bold"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedSize === s
                        ? 'bg-onyx-950 text-white border-onyx-950 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Level Warning */}
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>In Stock — Ready for dispatch in 24 hours</span>
          </div>

          {/* Quantity + Add To Cart + Wishlist Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              
              {/* Quantity Stepper */}
              <div className="flex items-center border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 px-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2.5 py-3 text-slate-600 hover:text-black text-sm"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-2.5 py-3 text-slate-600 hover:text-black text-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 px-6 rounded-2xl bg-onyx-950 hover:bg-aura-800 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-luxury hover:shadow-luxury-hover group"
              >
                <ShoppingBag className="w-4 h-4 text-gold" />
                <span>Add to Bag</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-4 rounded-2xl border transition-colors ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-rose-500 hover:bg-rose-50/50'
                }`}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Instant Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 rounded-2xl bg-gold hover:bg-gold-light text-onyx-950 text-xs font-bold uppercase tracking-widest transition-all shadow-md"
            >
              Buy Now — Instant Checkout
            </button>
          </div>

        </div>

      </div>

      {/* 2. FREQUENTLY BOUGHT TOGETHER BUNDLE */}
      {bundleAddon && (
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FAF8F5] to-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-gold" />
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Frequently Styled Together
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Bundle & Save 10%
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Item 1 */}
              <div className="flex items-center gap-3">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-16 h-20 object-cover rounded-xl border border-slate-200 shrink-0"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 line-clamp-1">{product.name}</p>
                  <p className="text-xs text-slate-500 font-semibold">{formatPrice(product.price)}</p>
                </div>
              </div>

              <span className="text-xl font-bold text-slate-400">+</span>

              {/* Item 2 */}
              <div className="flex items-center gap-3">
                <img
                  src={bundleAddon.images[0]}
                  alt={bundleAddon.name}
                  className="w-16 h-20 object-cover rounded-xl border border-slate-200 shrink-0"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 line-clamp-1">{bundleAddon.name}</p>
                  <p className="text-xs text-slate-500 font-semibold">{formatPrice(bundleAddon.price)}</p>
                </div>
              </div>
            </div>

            {/* Bundle Action */}
            <div className="flex items-center gap-4 text-right">
              <div>
                <p className="text-xs text-slate-400 line-through">
                  {formatPrice(product.price + bundleAddon.price)}
                </p>
                <p className="font-serif text-xl font-bold text-onyx-950">
                  {formatPrice(bundleTotal)}
                </p>
              </div>

              <button
                onClick={handleBundleAddToCart}
                className="px-6 py-3 rounded-xl bg-onyx-950 text-white hover:bg-aura-800 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Add Both to Bag
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. TABBED SPECIFICATIONS, REVIEWS & POLICY */}
      <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-[#FAF8F5]">
          {[
            { id: 'description', label: 'Craftsmanship & Story' },
            { id: 'specs', label: 'Specifications' },
            { id: 'reviews', label: `Reviews (${product.reviewsCount + userReviews.length})` },
            { id: 'shipping', label: 'Shipping & Returns' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-onyx-950 text-onyx-950 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          
          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="space-y-4 max-w-3xl">
              <h4 className="font-serif text-xl font-bold text-slate-900">
                The Philosophy of {product.name}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every piece in the AURA collection is developed with an obsessive focus on tactile richness, timeless architectural geometry, and responsible European and heritage workshop sourcing.
              </p>
            </div>
          )}

          {/* Specs Tab */}
          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <h4 className="font-serif text-lg font-bold text-slate-900 mb-4">
                Technical Details & Composition
              </h4>
              <dl className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                {product.specs &&
                  Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 p-3 text-xs">
                      <dt className="font-bold text-slate-500">{key}</dt>
                      <dd className="col-span-2 text-slate-800 font-medium">{value}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Rating Breakdown */}
                <div className="md:col-span-5 p-6 rounded-2xl bg-[#FAF8F5] border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-4xl font-bold text-onyx-950">
                      {product.rating}
                    </span>
                    <div>
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Based on {product.reviewsCount + userReviews.length} verified ratings
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2 text-xs">
                    {[
                      { star: 5, pct: '92%' },
                      { star: 4, pct: '6%' },
                      { star: 3, pct: '2%' },
                      { star: 2, pct: '0%' },
                      { star: 1, pct: '0%' }
                    ].map((row) => (
                      <div key={row.star} className="flex items-center gap-3">
                        <span className="w-6 text-slate-600 font-bold">{row.star}★</span>
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="bg-gold h-full rounded-full" style={{ width: row.pct }} />
                        </div>
                        <span className="w-8 text-right text-slate-400 text-[10px]">{row.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Write Review Form */}
                <div className="md:col-span-7">
                  <h4 className="font-serif text-lg font-bold text-slate-900 mb-3">
                    Share Your Experience
                  </h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="e.g. Elena R."
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">
                          Rating
                        </label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-aura-600 bg-white"
                        >
                          <option value={5}>5 Stars - Outstanding</option>
                          <option value={4}>4 Stars - Great Quality</option>
                          <option value={3}>3 Stars - Satisfactory</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">
                        Review Title
                      </label>
                      <input
                        type="text"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="Sum up your review"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">
                        Your Detailed Thoughts
                      </label>
                      <textarea
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="How was the fit, feel, texture, and packaging?"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-aura-600 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-onyx-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-aura-800 transition-colors"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>

              </div>

              {/* Review List */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                {userReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{rev.name}</span>
                        {rev.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified Buyer</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex text-amber-400 mb-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>

                    <h5 className="text-xs font-bold text-slate-900">{rev.title}</h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Tab */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 max-w-2xl text-xs text-slate-600 leading-relaxed">
              <h4 className="font-serif text-lg font-bold text-slate-900">
                AURA White-Glove Logistics
              </h4>
              <p>
                <strong>Complimentary Express Shipping:</strong> Orders over ₹5,000 qualify for complimentary courier delivery (2-4 business days worldwide).
              </p>
              <p>
                <strong>Carbon-Neutral Packaging:</strong> Every item is encased in custom recyclable boxes, silk ribbon, and protective unbleached cotton dustbags.
              </p>
              <p>
                <strong>30-Day Effortless Returns:</strong> If you are not completely enraptured by your purchase, return it within 30 days using our prepaid return labels.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* 4. RELATED PRODUCTS CAROUSEL */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-aura-800">
                Complete Your Aura
              </span>
              <h3 className="font-serif text-2xl font-bold text-onyx-950 mt-1">
                You May Also Appreciate
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-gold" />
                <h3 className="font-serif text-lg font-bold text-slate-900">AURA Size & Fit Guide</h3>
              </div>
              <button onClick={() => setIsSizeGuideOpen(false)} className="p-1 text-slate-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 my-4 leading-relaxed">
              All our garments and accessories are crafted to international luxury atelier proportions. Measurements are in inches/centimeters.
            </p>

            <table className="w-full text-xs text-slate-700 divide-y divide-slate-200">
              <thead>
                <tr className="text-left font-bold text-slate-900 bg-slate-50">
                  <th className="p-2.5">Size</th>
                  <th className="p-2.5">Chest / Bust</th>
                  <th className="p-2.5">Waist</th>
                  <th className="p-2.5">Hips</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2.5 font-bold">XS</td>
                  <td className="p-2.5">32-34 in / 81-86 cm</td>
                  <td className="p-2.5">24-26 in / 61-66 cm</td>
                  <td className="p-2.5">34-36 in / 86-91 cm</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">S</td>
                  <td className="p-2.5">35-37 in / 89-94 cm</td>
                  <td className="p-2.5">27-29 in / 68-74 cm</td>
                  <td className="p-2.5">37-39 in / 94-99 cm</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">M</td>
                  <td className="p-2.5">38-40 in / 96-101 cm</td>
                  <td className="p-2.5">30-32 in / 76-81 cm</td>
                  <td className="p-2.5">40-42 in / 101-106 cm</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">L</td>
                  <td className="p-2.5">41-43 in / 104-109 cm</td>
                  <td className="p-2.5">33-35 in / 84-89 cm</td>
                  <td className="p-2.5">43-45 in / 109-114 cm</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">XL</td>
                  <td className="p-2.5">44-46 in / 112-117 cm</td>
                  <td className="p-2.5">36-38 in / 91-96 cm</td>
                  <td className="p-2.5">46-48 in / 117-122 cm</td>
                </tr>
              </tbody>
            </table>

            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="mt-6 w-full py-3 rounded-xl bg-onyx-950 text-white text-xs font-bold uppercase tracking-wider"
            >
              Got It
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
