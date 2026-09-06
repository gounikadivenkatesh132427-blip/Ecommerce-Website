import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import { Search, X, TrendingUp, ArrowRight, Star } from 'lucide-react';

export const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, navigateTo, formatPrice } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = searchTerm.trim()
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 6)
    : [];

  const trendingTags = [
    'Cashmere Coat',
    'Botanical Elixir',
    'Titanium Watch',
    'Leather Tote',
    'Linen Bedding',
    'Italian Sneaker'
  ];

  const handleProductClick = (productId) => {
    setIsSearchOpen(false);
    navigateTo('product-detail', productId);
  };

  const handleCategoryClick = (categorySlug) => {
    setIsSearchOpen(false);
    navigateTo('shop', null, categorySlug);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md animate-fade-in">
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={() => setIsSearchOpen(false)} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 z-10 animate-slide-down">
        {/* Search Bar Input */}
        <div className="flex items-center px-5 py-4 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-aura-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products, brands, luxury categories..."
            className="w-full text-base bg-transparent border-none outline-none placeholder-slate-400 text-onyx-900 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs font-semibold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {/* If no search term, show trending & categories */}
          {!searchTerm.trim() ? (
            <div className="space-y-6">
              {/* Trending Searches */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-gold" />
                  <span>Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchTerm(tag)}
                      className="px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-aura-100 hover:text-aura-900 text-xs font-medium text-slate-700 transition-all border border-slate-200/60"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse by Category */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Curated Categories
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.slug)}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-aura-50 text-left transition-colors border border-slate-100 group"
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-800 group-hover:text-aura-800">
                          {cat.name}
                        </p>
                        <p className="text-[10px] text-slate-400">{cat.itemCount}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-aura-600 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Filtered Search Results */
            <div>
              {filteredProducts.length > 0 ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Matching Products ({filteredProducts.length})
                  </p>
                  <div className="divide-y divide-slate-100">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="flex items-center gap-4 py-3 px-2 rounded-xl hover:bg-aura-50/70 transition-colors cursor-pointer group"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-lg shrink-0 border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-aura-700 bg-aura-100 px-2 py-0.5 rounded-full">
                              {product.category}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                              {product.brand}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-aura-900 mt-0.5">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center text-amber-500 text-xs">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                              <span className="font-semibold">{product.rating}</span>
                            </div>
                            <span className="text-xs text-slate-300">•</span>
                            <span className="text-xs font-bold text-slate-900">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-slate-400 line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-aura-700 group-hover:translate-x-1 transition-all shrink-0 mr-2" />
                      </div>
                    ))}
                  </div>

                  {/* View all in shop CTA */}
                  <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigateTo('shop');
                      }}
                      className="text-xs font-semibold text-aura-800 hover:text-aura-950 inline-flex items-center gap-1.5"
                    >
                      View all products in Shop Catalog <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-base font-serif text-slate-700">No items found for "{searchTerm}"</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Try checking your spelling or searching for general categories like "Fashion", "Beauty", or "Electronics".
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
