import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  Check,
  Star
} from 'lucide-react';

export const WishlistPage = () => {
  const {
    wishlist,
    toggleWishlist,
    addToCart,
    formatPrice,
    navigateTo,
    addToast
  } = useShop();

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  const handleMoveAllToCart = () => {
    wishlistedProducts.forEach((p) => {
      addToCart(p, 1, p.sizes ? p.sizes[0] : 'Standard', p.colors ? p.colors[0] : null);
    });
    addToast({
      type: 'success',
      title: 'Wishlist Moved to Cart',
      message: `All ${wishlistedProducts.length} saved items have been added to your shopping bag.`
    });
  };

  const handleMoveSingleToCart = (product) => {
    addToCart(product, 1, product.sizes ? product.sizes[0] : 'Standard', product.colors ? product.colors[0] : null);
    toggleWishlist(product.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <button onClick={() => navigateTo('home')} className="hover:text-slate-900 transition-colors">
          Home
        </button>
        <span>/</span>
        <span className="text-slate-800 font-semibold">My Saved Items</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-onyx-950">
            Curated Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {wishlistedProducts.length} items saved for future elegance
          </p>
        </div>

        {wishlistedProducts.length > 0 && (
          <button
            onClick={handleMoveAllToCart}
            className="px-6 py-3 rounded-xl bg-onyx-950 hover:bg-aura-800 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-gold" />
            <span>Move All to Bag</span>
          </button>
        )}
      </div>

      {/* Main Wishlist Grid or Empty State */}
      {wishlistedProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-5">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Your wishlist is currently empty</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Click the heart icon on any product across our catalog to curate your dream ensemble.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="mt-6 px-8 py-3.5 rounded-full bg-onyx-950 hover:bg-aura-800 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md inline-flex items-center gap-2"
          >
            <span>Start Exploring Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-luxury transition-all duration-300"
            >
              {/* Product Thumbnail */}
              <div
                onClick={() => navigateTo('product-detail', product.id)}
                className="relative aspect-[3/4] bg-slate-100 overflow-hidden cursor-pointer"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors shadow-sm"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {product.discount > 0 && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Info & Actions */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="uppercase font-bold tracking-wider text-aura-800">
                      {product.brand}
                    </span>
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                      <span>{product.rating}</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => navigateTo('product-detail', product.id)}
                    className="font-serif text-sm font-semibold text-slate-900 hover:text-aura-800 cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-sm font-bold text-slate-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Move to Cart button */}
                <button
                  onClick={() => handleMoveSingleToCart(product)}
                  className="w-full py-2.5 rounded-xl bg-onyx-950 hover:bg-aura-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-gold" />
                  <span>Move to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
