import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Sparkles,
  Gift,
  Truck,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export const CartPage = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    discountAmount,
    grandTotal,
    standardShippingCost,
    estimatedTax,
    freeShippingThreshold,
    isFreeShipping,
    formatPrice,
    navigateTo,
    activePromo,
    applyPromo,
    removePromo
  } = useShop();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [giftNote, setGiftNote] = useState('');
  const [isGiftWrap, setIsGiftWrap] = useState(false);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoCodeInput) return;
    applyPromo(promoCodeInput);
    setPromoCodeInput('');
  };

  const amountNeeded = Math.max(0, freeShippingThreshold - cartSubtotal);
  const shippingPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  // Recommendations for empty cart or cart footer
  const recommendations = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <button onClick={() => navigateTo('home')} className="hover:text-slate-900 transition-colors">
          Home
        </button>
        <span>/</span>
        <span className="text-slate-800 font-semibold">Shopping Bag</span>
      </div>

      {/* Cart Title */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-6 border-b border-slate-200">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-onyx-950">
          Your Shopping Bag
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {cart.reduce((acc, item) => acc + item.quantity, 0)} Luxury Items Selected
        </p>
      </div>

      {cart.length === 0 ? (
        /* Empty Cart State */
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div className="w-20 h-20 rounded-full bg-aura-50 flex items-center justify-center mx-auto mb-5 text-aura-700">
            <ShoppingBag className="w-10 h-10 opacity-70" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Your bag is currently empty</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            Looks like you haven't added anything to your cart yet. Explore our curated collections of timeless apparel, fine jewelry, and luxury lifestyle pieces.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="mt-6 px-8 py-3.5 rounded-full bg-onyx-950 hover:bg-aura-800 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md inline-flex items-center gap-2"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Recommendations in Empty State */}
          <div className="mt-16 pt-12 border-t border-slate-100 text-left">
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-6">
              Recommended for You
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Populated Cart Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Cart Items Table */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Free Shipping Alert Banner */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-aura-200/80">
              {isFreeShipping ? (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>You have unlocked <strong>Complimentary Express Delivery</strong>!</span>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between text-xs text-slate-700 font-semibold mb-1.5">
                    <span>
                      Add <strong>{formatPrice(amountNeeded)}</strong> more for <strong>Free Express Delivery</strong>
                    </span>
                    <span>{Math.round(shippingPercent)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-gold h-full rounded-full transition-all duration-500" style={{ width: `${shippingPercent}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* Line Items List */}
            <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
              {cart.map((item) => (
                <div key={item.cartItemId} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 group">
                  
                  {/* Image */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-24 h-28 object-cover rounded-2xl border border-slate-200 shrink-0 bg-slate-50 cursor-pointer"
                    onClick={() => navigateTo('product-detail', item.product.id)}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-aura-800">
                      {item.product.brand}
                    </span>
                    <h3
                      onClick={() => navigateTo('product-detail', item.product.id)}
                      className="font-serif text-base font-bold text-slate-900 hover:text-aura-800 cursor-pointer transition-colors"
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Size: <strong className="text-slate-800">{item.selectedSize}</strong>
                      {item.selectedColor?.name && (
                        <span> • Color: <strong className="text-slate-800">{item.selectedColor.name}</strong></span>
                      )}
                    </p>
                    <p className="text-xs font-bold text-slate-900 mt-2 sm:hidden">
                      {formatPrice(item.price)} each
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, -1)}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, 1)}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total Price */}
                  <div className="text-right min-w-[90px]">
                    <p className="font-serif text-base font-bold text-slate-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-[10px] text-slate-400">
                        ({formatPrice(item.price)} each)
                      </p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-lg"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              ))}
            </div>

            {/* Gift Message / Special Notes Accordion */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-gold" />
                  <h4 className="font-serif text-sm font-bold text-slate-900">
                    Complimentary Gift Wrapping & Note
                  </h4>
                </div>
                <input
                  type="checkbox"
                  checked={isGiftWrap}
                  onChange={(e) => setIsGiftWrap(e.target.checked)}
                  className="rounded accent-onyx-900 w-4 h-4 cursor-pointer"
                />
              </div>

              {isGiftWrap && (
                <div className="pt-2 animate-fade-in space-y-2">
                  <p className="text-xs text-slate-500">
                    Your order will be encased in our bespoke onyx gift box tied with champagne satin ribbon. Add a personalized handwritten card below:
                  </p>
                  <textarea
                    rows={2}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Enter your message for the recipient..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600 resize-none"
                  />
                </div>
              )}
            </div>

            {/* Clear Cart Button */}
            <div className="flex justify-between items-center text-xs">
              <button
                onClick={() => navigateTo('shop')}
                className="text-aura-800 hover:text-aura-950 font-bold underline"
              >
                &larr; Continue Shopping
              </button>
              <button
                onClick={clearCart}
                className="text-slate-400 hover:text-rose-600 transition-colors"
              >
                Clear Entire Bag
              </button>
            </div>

          </div>

          {/* Right: Order Summary Card */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200/80 shadow-md space-y-5">
              
              <h3 className="font-serif text-xl font-bold text-onyx-950 pb-3 border-b border-slate-200">
                Order Summary
              </h3>

              {/* Promo Code Input */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Promo Code
                </label>
                {activePromo ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <Tag className="w-4 h-4" />
                      <span>{activePromo.code} ({activePromo.description})</span>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-emerald-700 hover:text-rose-600 font-bold underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      placeholder="Try AURA20 or VIP500"
                      className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-aura-600 uppercase bg-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-onyx-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-aura-800 transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-2 border-t border-slate-200 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatPrice(cartSubtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount Savings</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>
                    {isFreeShipping ? (
                      <strong className="text-emerald-700 font-semibold">Free (Qualified)</strong>
                    ) : (
                      formatPrice(standardShippingCost)
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated GST (18%)</span>
                  <span>{formatPrice(estimatedTax)}</span>
                </div>

                <div className="flex justify-between text-base font-serif font-bold text-onyx-950 pt-3 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={() => navigateTo('checkout')}
                className="w-full py-4 rounded-2xl bg-onyx-950 hover:bg-aura-800 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-luxury hover:shadow-luxury-hover group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Trust Badges */}
              <div className="pt-2 text-center space-y-2 text-[11px] text-slate-400">
                <div className="flex items-center justify-center gap-1.5 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>256-Bit SSL Encrypted & Secure Checkout</span>
                </div>
                <p>Complimentary 30-Day Returns On All Global Orders</p>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
