import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    discountAmount,
    grandTotal,
    freeShippingThreshold,
    isFreeShipping,
    formatPrice,
    navigateTo,
    activePromo,
    applyPromo,
    removePromo
  } = useShop();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput) return;
    applyPromo(promoInput);
    setPromoInput('');
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    navigateTo('cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-200 animate-slide-left">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#FCFAF8]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-aura-800" />
              <h2 className="font-serif text-lg font-bold text-slate-900 tracking-tight">
                Shopping Bag
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-aura-100 text-aura-900">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-5 py-3.5 bg-aura-50/70 border-b border-aura-100/80">
            {isFreeShipping ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Congratulations! You qualify for <strong>Complimentary Express Delivery</strong>.</span>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-700 font-medium">
                  Add <span className="font-bold text-slate-900">{formatPrice(amountNeededForFreeShipping)}</span> more for <strong className="text-aura-900">Free Express Delivery</strong>
                </p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-gold h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-aura-50 flex items-center justify-center mx-auto mb-4 text-aura-700">
                  <ShoppingBag className="w-8 h-8 opacity-70" />
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900">Your bag is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Explore our curated collections of timeless apparel, fine jewelry, and luxury lifestyle pieces.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('shop');
                  }}
                  className="mt-6 px-6 py-2.5 rounded-full bg-onyx-900 text-white text-xs font-semibold hover:bg-aura-800 transition-colors shadow-md"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartItemId} className="py-4 flex gap-4 first:pt-0 group">
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-50"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4
                          onClick={() => {
                            setIsCartOpen(false);
                            navigateTo('product-detail', item.product.id);
                          }}
                          className="text-sm font-semibold text-slate-900 hover:text-aura-800 cursor-pointer line-clamp-1"
                        >
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.selectedSize} {item.selectedColor?.name && `• ${item.selectedColor.name}`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, -1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-[#FAF8F5] space-y-3.5">
              
              {/* Promo input in drawer */}
              {activePromo ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Promo "{activePromo.code}" applied (-{formatPrice(discountAmount)})</span>
                  </div>
                  <button
                    onClick={removePromo}
                    className="text-emerald-700 hover:text-rose-600 text-[11px] font-bold underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. AURA20)"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-aura-600 uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-aura-800 transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Subtotal breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatPrice(cartSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{isFreeShipping ? <strong className="text-emerald-700 font-semibold">Free</strong> : 'Calculated at checkout'}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-xl bg-onyx-900 hover:bg-aura-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md group"
                >
                  <span>Checkout Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleViewCart}
                  className="w-full py-2.5 rounded-xl bg-transparent hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
                >
                  View Full Bag & Estimate Shipping
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Guaranteed 256-Bit SSL Encrypted Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
