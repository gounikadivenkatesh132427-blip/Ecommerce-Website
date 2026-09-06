import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';

export const ProductCard = ({ product, viewMode = 'grid' }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
    navigateTo,
    setQuickViewProduct
  } = useShop();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : null);
  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const discountPercent = product.discount || (product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1, product.sizes ? product.sizes[0] : 'Standard', selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleCardClick = () => {
    navigateTo('product-detail', product.id);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  // List View Mode
  if (viewMode === 'list') {
    return (
      <div
        onClick={handleCardClick}
        className="group flex flex-col sm:flex-row items-center gap-6 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-aura-400 hover:shadow-luxury transition-all duration-300 cursor-pointer"
      >
        {/* Image */}
        <div className="relative w-full sm:w-56 h-64 sm:h-52 rounded-xl overflow-hidden bg-slate-100 shrink-0">
          <img
            src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
          {discountPercent > 0 && (
            <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between w-full h-full py-1">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-aura-800">
                {product.brand}
              </span>
              <span className="text-xs text-slate-400">{product.category}</span>
            </div>

            <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-aura-800 transition-colors mt-1">
              {product.name}
            </h3>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-500 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                <span className="font-bold">{product.rating}</span>
              </div>
              <span className="text-xs text-slate-400">({product.reviewsCount} reviews)</span>
            </div>

            <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
              {product.shortDescription || product.description}
            </p>
          </div>

          {/* Pricing & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleWishlistClick}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-rose-500'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                onClick={handleQuickView}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={handleQuickAdd}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  isAdded
                    ? 'bg-emerald-700 text-white'
                    : 'bg-onyx-900 text-white hover:bg-aura-800'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Mode (Default)
  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col rounded-2xl bg-white border border-slate-200/70 hover:border-aura-400 hover:shadow-luxury transition-all duration-300 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full bg-[#F4EFEB] overflow-hidden">
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-onyx-900 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-aura-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Best Seller
            </span>
          )}
          {discountPercent > 0 && !product.isNew && !product.isBestSeller && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Top Right Actions (Wishlist & Quick View) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 transition-all duration-300">
          <button
            onClick={handleWishlistClick}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
              isWishlisted
                ? 'bg-white text-rose-500 shadow-md'
                : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={handleQuickView}
            className="p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-black shadow-sm backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Slide-Up Add To Cart Button on Hover */}
        <div className="absolute bottom-3 inset-x-3 z-10 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all backdrop-blur-sm ${
              isAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-onyx-900/95 hover:bg-aura-800 text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-gold" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="uppercase font-bold tracking-wider text-aura-800">
              {product.brand}
            </span>
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
              <span className="font-semibold text-slate-700 text-[11px]">{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif text-sm font-semibold text-slate-900 group-hover:text-aura-800 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>

        {/* Color preview dots */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5">
            {product.colors.slice(0, 3).map((c) => (
              <span
                key={c.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(c);
                }}
                className={`w-3 h-3 rounded-full border border-slate-300 inline-block transition-transform ${
                  selectedColor?.name === c.name ? 'scale-125 border-slate-800' : ''
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[10px] text-slate-400 font-medium">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Price Row */}
        <div className="flex items-baseline justify-between mt-3 pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-slate-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {discountPercent > 0 && (
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
              -{discountPercent}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
