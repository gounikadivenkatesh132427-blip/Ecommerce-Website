import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../data/products';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, TwitterIcon } from './SocialIcons';

export const Footer = () => {
  const { navigateTo, addToast } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast({
        type: 'error',
        title: 'Invalid Email',
        message: 'Please enter a valid email address.'
      });
      return;
    }
    setSubscribed(true);
    addToast({
      type: 'success',
      title: 'Welcome to AURA Privé Club',
      message: 'Your exclusive 20% discount code "AURA20" is ready to use!'
    });
    setEmail('');
  };

  return (
    <footer className="bg-onyx-950 text-white mt-20 pt-16 pb-12 border-t border-onyx-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Pillars Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-14 border-b border-white/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-gold">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-white">Complimentary Delivery</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Free carbon-neutral express shipping on all orders over $150.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-gold">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-white">30-Day Easy Returns</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Effortless return process with pre-paid luxury return packaging.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-gold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-white">100% Certified Luxury</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Hand-inspected authenticity and artisanal quality guaranteed.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-gold">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-white">24/7 VIP Concierge</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Direct access to personal style advisors and client care.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 py-14 border-b border-white/10">
          
          {/* Brand Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-3xl font-extrabold tracking-[0.25em] text-white">AURA</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">Your Style. Your Aura.</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              AURA represents the convergence of artisanal craftsmanship, modern minimalism, and sustainable luxury. Every piece is selected to enrich your personal signature aesthetic.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-gold-light mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>Join the AURA Privé Club</span>
              </p>
              
              {subscribed ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-white/10 border border-gold/30 text-xs text-gold-light">
                  <CheckCircle2 className="w-4 h-4 text-gold" />
                  <span>Welcome! Use code <strong className="text-white">AURA20</strong> at checkout for 20% off.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gold text-onyx-950 text-xs font-bold uppercase tracking-wider hover:bg-gold-light transition-all flex items-center gap-1 shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h5 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4">
              Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigateTo('shop', null, cat.slug)}
                    className="hover:text-gold transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h5 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4">
              Client Care
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-gold transition-colors">
                  Our Story & Heritage
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('auth')} className="hover:text-gold transition-colors">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('cart')} className="hover:text-gold transition-colors">
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-gold transition-colors">
                  Artisanal Sustainability
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-gold transition-colors">
                  Contact Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* VIP Services */}
          <div>
            <h5 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4">
              Privé Services
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => navigateTo('auth')} className="hover:text-gold transition-colors">
                  AURA VIP Rewards
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('wishlist')} className="hover:text-gold transition-colors">
                  Curated Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-gold transition-colors">
                  Bespoke Consultations
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-gold transition-colors">
                  Corporate & Gifting
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Payment Methods */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} AURA Luxury Atelier Inc. All rights reserved.</p>

          {/* Accepted Payment Pill Badges */}
          <div className="flex items-center gap-2 flex-wrap text-[11px] font-semibold text-slate-300">
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">VISA</span>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Mastercard</span>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">AMEX</span>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Apple Pay</span>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">PayPal</span>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Klarna</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
