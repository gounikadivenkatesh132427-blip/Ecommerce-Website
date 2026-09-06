import React, { useState, useMemo, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import {
  Filter,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  Grid,
  List,
  X,
  RotateCcw,
  Star,
  Search,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

export const ShopPage = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    formatPrice,
    navigateTo
  } = useShop();

  // Filters state
  const [activeCategory, setActiveCategory] = useState(selectedCategory || 'all');
  const [priceRange, setPriceRange] = useState(60000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid-4'); // 'grid-4' | 'grid-3' | 'list'
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync with context selectedCategory
  useEffect(() => {
    if (selectedCategory) {
      setActiveCategory(selectedCategory);
    }
  }, [selectedCategory]);

  // Extract unique brands
  const allBrands = useMemo(() => {
    const brands = new Set(PRODUCTS.map((p) => p.brand));
    return Array.from(brands);
  }, []);

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSelectedCategory(null);
    setPriceRange(60000);
    setSelectedBrands([]);
    setMinRating(0);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (activeCategory !== 'all' && product.categorySlug !== activeCategory) {
        return false;
      }
      // Price filter
      if (product.price > priceRange) {
        return false;
      }
      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }
      // Rating filter
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }
      // In Stock filter
      if (inStockOnly && !product.inStock) {
        return false;
      }
      // On Sale filter
      if (onSaleOnly && (!product.discount || product.discount <= 0)) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          product.name.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [
    activeCategory,
    priceRange,
    selectedBrands,
    minRating,
    inStockOnly,
    onSaleOnly,
    searchQuery,
    sortBy
  ]);

  // Active filter count
  const activeFilterCount =
    (activeCategory !== 'all' ? 1 : 0) +
    (priceRange < 60000 ? 1 : 0) +
    selectedBrands.length +
    (minRating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (onSaleOnly ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumbs & Header Banner */}
      <div className="space-y-3 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <button onClick={() => navigateTo('home')} className="hover:text-slate-900 transition-colors">
            Home
          </button>
          <span>/</span>
          <span className="text-slate-800 font-semibold capitalize">
            {activeCategory === 'all' ? 'All Collections' : activeCategory.replace('-', ' & ')}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-onyx-950">
              {activeCategory === 'all'
                ? 'The Complete Collection'
                : CATEGORIES.find((c) => c.slug === activeCategory)?.name || 'Curated Atelier'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Discover timeless silhouettes, restorative botanical elixirs, and precision artisan accessories.
            </p>
          </div>

          <div className="text-xs text-slate-500">
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of{' '}
            <strong className="text-slate-900">{PRODUCTS.length}</strong> luxury creations
          </div>
        </div>
      </div>

      {/* Control Bar: Search in Shop, View Mode, Sorting, Mobile Filter Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        
        {/* Left: Search input inside Shop & Mobile Filter Trigger */}
        <div className="flex items-center gap-3 flex-1 min-w-[240px] max-w-md">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-onyx-900 text-white text-xs font-bold shrink-0"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters ({activeFilterCount})</span>
          </button>

          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in this collection..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-aura-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Sort Dropdown & Layout View Toggles */}
        <div className="flex items-center gap-3">
          
          {/* Sorting */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-semibold text-slate-500">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 py-2 pl-3 pr-8 rounded-xl outline-none focus:border-aura-600 cursor-pointer"
              >
                <option value="featured">Featured & Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="hidden sm:flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-0.5">
            <button
              onClick={() => setViewMode('grid-4')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid-4' ? 'bg-white text-onyx-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="4-Column Grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid-3')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid-3' ? 'bg-white text-onyx-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="3-Column Grid"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white text-onyx-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
            Active Filters:
          </span>

          {activeCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aura-100 text-aura-900 text-xs font-semibold">
              Category: {activeCategory}
              <button onClick={() => { setActiveCategory('all'); setSelectedCategory(null); }}>
                <X className="w-3 h-3 hover:text-rose-600" />
              </button>
            </span>
          )}

          {priceRange < 600 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aura-100 text-aura-900 text-xs font-semibold">
              Under {formatPrice(priceRange)}
              <button onClick={() => setPriceRange(600)}>
                <X className="w-3 h-3 hover:text-rose-600" />
              </button>
            </span>
          )}

          {selectedBrands.map((brand) => (
            <span key={brand} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aura-100 text-aura-900 text-xs font-semibold">
              Brand: {brand}
              <button onClick={() => toggleBrand(brand)}>
                <X className="w-3 h-3 hover:text-rose-600" />
              </button>
            </span>
          ))}

          {minRating > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aura-100 text-aura-900 text-xs font-semibold">
              Rating: {minRating}★ & above
              <button onClick={() => setMinRating(0)}>
                <X className="w-3 h-3 hover:text-rose-600" />
              </button>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aura-100 text-aura-900 text-xs font-semibold">
              In Stock Only
              <button onClick={() => setInStockOnly(false)}>
                <X className="w-3 h-3 hover:text-rose-600" />
              </button>
            </span>
          )}

          {onSaleOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aura-100 text-aura-900 text-xs font-semibold">
              On Sale Only
              <button onClick={() => setOnSaleOnly(false)}>
                <X className="w-3 h-3 hover:text-rose-600" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-aura-800" />
              <h3 className="font-serif text-base font-bold text-slate-900">Refine Search</h3>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-aura-700 hover:text-rose-600 font-semibold"
              >
                Reset
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Categories
            </h4>
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSelectedCategory(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                  activeCategory === 'all'
                    ? 'bg-onyx-900 text-white font-bold'
                    : 'text-slate-700 hover:bg-aura-50'
                }`}
              >
                <span>All Products</span>
                <span className={activeCategory === 'all' ? 'text-gold' : 'text-slate-400'}>
                  {PRODUCTS.length}
                </span>
              </button>

              {CATEGORIES.map((cat) => {
                const count = PRODUCTS.filter((p) => p.categorySlug === cat.slug).length;
                const isSelected = activeCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.slug);
                      setSelectedCategory(cat.slug);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                      isSelected
                        ? 'bg-onyx-900 text-white font-bold'
                        : 'text-slate-700 hover:bg-aura-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={isSelected ? 'text-gold' : 'text-slate-400'}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Max Price
              </h4>
              <span className="text-xs font-bold text-onyx-900">{formatPrice(priceRange)}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="60000"
              step="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-gold h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>{formatPrice(1000)}</span>
              <span>{formatPrice(60000)}+</span>
            </div>
          </div>

          {/* Brand Checklist */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Designers & Brands
            </h4>
            <div className="space-y-2">
              {allBrands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none hover:text-black"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="rounded border-slate-300 text-onyx-900 focus:ring-gold accent-onyx-900 w-4 h-4 cursor-pointer"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Customer Rating Filter */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Minimum Rating
            </h4>
            <div className="space-y-1.5">
              {[4.9, 4.8, 4.5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    minRating === rating ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{rating}★ & above</span>
                  </div>
                  {minRating === rating && <span className="text-[10px] text-amber-700 font-bold">Selected</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Stock & Offer Toggles */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
              <span>In Stock Only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-onyx-900 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
              <span>Special Offers Only</span>
              <input
                type="checkbox"
                checked={onSaleOnly}
                onChange={(e) => setOnSaleOnly(e.target.checked)}
                className="rounded accent-onyx-900 w-4 h-4 cursor-pointer"
              />
            </label>
          </div>

        </aside>

        {/* Products Grid / List */}
        <main className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-aura-50 flex items-center justify-center mx-auto mb-4 text-aura-700">
                <SlidersHorizontal className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">No matching creations found</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                We couldn't find any products matching your specific combination of filters. Try broadening your price or clearing selected filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 px-6 py-2.5 rounded-full bg-onyx-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-aura-800 transition-colors shadow-sm inline-flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === 'list'
                  ? 'grid-cols-1'
                  : viewMode === 'grid-3'
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode === 'list' ? 'list' : 'grid'}
                />
              ))}
            </div>
          )}
        </main>

      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-sm animate-fade-in flex justify-end">
          <div className="w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 animate-slide-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-serif text-lg font-bold text-slate-900">Filter Catalog</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1.5 text-slate-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Category</p>
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveCategory('all'); setSelectedCategory(null); }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold ${activeCategory === 'all' ? 'bg-onyx-900 text-white' : 'text-slate-700'}`}
                >
                  All Products ({PRODUCTS.length})
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setActiveCategory(c.slug); setSelectedCategory(c.slug); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold ${activeCategory === c.slug ? 'bg-onyx-900 text-white' : 'text-slate-700'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Price Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span>Max Price:</span>
                <span>{formatPrice(priceRange)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="60000"
                step="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-gold"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-onyx-900 text-white text-xs font-bold uppercase"
              >
                Apply Filters ({filteredProducts.length} items)
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full py-2 text-xs font-semibold text-rose-600 underline"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
