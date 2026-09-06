import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Heart, ShoppingBag, Star, Check, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export const QuickViewModal = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
    navigateTo
  } = useShop();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const currentSize = selectedSize || (product.sizes ? product.sizes[0] : 'Standard');
  const currentColor = selectedColor || (product.colors ? product.colors[0] : null);
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, currentSize, currentColor);
    setQuickViewProduct(null);
  };

  const handleFullDetail = () => {
    setQuickViewProduct(null);
    navigateTo('product-detail', product.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={() => setQuickViewProduct(null)} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 animate-slide-up">
        
        {/* Close button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-slate-600 shadow-md backdrop-blur-sm transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Product Images */}
          <div className="p-6 bg-[#FAF8F5] flex flex-col justify-between">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {product.discount > 0 && (
                <div className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {product.discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx ? 'border-aura-700 shadow-sm scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Options & Actions */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Brand & Category */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-widest font-bold text-aura-800">
                  {product.brand}
                </span>
                <span className="text-xs text-slate-400 font-medium">{product.category}</span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl font-bold text-slate-900 leading-snug">
                {product.name}
              </h2>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-500 text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                  <span className="font-bold">{product.rating}</span>
                </div>
                <span className="text-xs text-slate-400">({product.reviewsCount} reviews)</span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  In Stock ({product.stock} left)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl font-bold text-slate-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                {product.description}
              </p>

              {/* Color Swatches */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                    <span>Color: <strong className="text-slate-900">{currentColor?.name}</strong></span>
                  </div>
                  <div className="flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c)}
                        title={c.name}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all border-2 ${
                          currentColor?.name === c.name ? 'border-onyx-900 scale-110 shadow-sm' : 'border-slate-200'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {currentColor?.name === c.name && (
                          <Check className={`w-3.5 h-3.5 ${['#FFFFFF', '#FAF8F5', '#FAFAFA'].includes(c.hex) ? 'text-black' : 'text-white'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                    <span>Select Size: <strong className="text-slate-900">{currentSize}</strong></span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          currentSize === s
                            ? 'bg-onyx-900 text-white border-onyx-900 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 px-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-2.5 py-2 text-slate-600 hover:text-black text-sm"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-2.5 py-2 text-slate-600 hover:text-black text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 rounded-xl bg-onyx-900 hover:bg-aura-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md group"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition-colors ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-rose-500 hover:bg-rose-50/50'
                  }`}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Full details link */}
              <button
                onClick={handleFullDetail}
                className="w-full text-center text-xs font-semibold text-aura-800 hover:text-aura-950 flex items-center justify-center gap-1.5 py-1"
              >
                <span>View Complete Product Details & Specs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
