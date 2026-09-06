import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Sparkles,
  ShieldCheck,
  Leaf,
  Globe,
  Award,
  ArrowRight,
  Mail,
  Send,
  MessageSquare,
  CheckCircle2,
  ChevronDown,
  Clock
} from 'lucide-react';

export const AboutPage = () => {
  const { navigateTo, addToast } = useShop();

  // Contact form state
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('concierge');
  const [inquiryMessage, setInquiryMessage] = useState('');

  // FAQ Accordion active index
  const [openFaq, setOpenFaq] = useState(0);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryMessage) {
      addToast({
        type: 'error',
        title: 'Please Complete Form',
        message: 'All fields are required to reach the atelier concierge.'
      });
      return;
    }
    addToast({
      type: 'success',
      title: 'Inquiry Dispatched',
      message: 'An AURA personal stylist will contact you within 4 business hours.'
    });
    setInquiryName('');
    setInquiryEmail('');
    setInquiryMessage('');
  };

  const faqs = [
    {
      q: 'How does AURA ensure genuine artisanal luxury?',
      a: 'Every piece is produced in limited micro-batches in certified European and heritage workshops across Biella, Grasse, Florence, and Lyon. We rigorously test textile tensile strength, leather tanning purity, and acoustic transducer fidelity.'
    },
    {
      q: 'What is AURA’s sustainability and carbon pledge?',
      a: 'We operate on a 100% carbon-neutral logistics protocol. All packaging uses FSC-certified unbleached cartons and recyclable silk wrapping. Our textiles are certified organic or OEKO-TEX Standard 100.'
    },
    {
      q: 'What is the return policy for international orders?',
      a: 'We provide complimentary 30-day returns worldwide. Simply generate a prepaid return label from your Client Dashboard or contact our 24/7 concierge for doorstep courier pickup.'
    },
    {
      q: 'How does the AURA Privé VIP membership work?',
      a: 'Membership is complimentary upon your first order. Privé members accumulate points with every acquisition, receive private invites to seasonal drop releases 72 hours early, and enjoy dedicated concierge styling services.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-20">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <button onClick={() => navigateTo('home')} className="hover:text-slate-900 transition-colors">
          Home
        </button>
        <span>/</span>
        <span className="text-slate-800 font-semibold">The Atelier & Manifesto</span>
      </div>

      {/* 1. HERO STORY SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-aura-300 text-xs font-bold uppercase tracking-widest text-onyx-950">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Our Heritage & Purpose</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-onyx-950 leading-tight">
            Where Quiet Luxury Meets <span className="gold-gradient-text italic font-normal">Modern Soul.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Founded with a singular conviction: luxury should not shout; it should resonate. At <strong>AURA</strong>, we strip away transient excess to celebrate the pure majesty of master craftsmanship, tactile organic textiles, and thoughtful form.
          </p>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Our brand tagline — <em>“Your Style. Your Aura.”</em> — is an invitation to express your identity through pieces crafted to endure for decades, not fleeting seasons.
          </p>

          <div className="pt-2 flex gap-4">
            <button
              onClick={() => navigateTo('shop')}
              className="px-8 py-4 rounded-xl bg-onyx-950 hover:bg-aura-800 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
            >
              <span>Explore Creations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
              alt="Atelier craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. FOUR PILLARS */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-aura-800">
            Uncompromising Standards
          </span>
          <h2 className="font-serif text-3xl font-bold text-onyx-950 mt-1">
            The Four Pillars of AURA
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-aura-50 text-aura-800 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900">Artisanal Mastery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bespoke tailors in Italy, master perfumers in Grasse, and acoustic engineers in Scandinavia handcraft each design.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-aura-50 text-aura-800 flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900">Conscious Luxury</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              100% traceable Mongolian cashmere, Belgian flax linen, and botanical cold-pressed actives without harmful chemicals.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-aura-50 text-aura-800 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900">Carbon-Neutral Transit</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every international delivery is 100% offset through accredited reforestation initiatives and clean transport partnerships.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-aura-50 text-aura-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900">Client Centricity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lifetime product support, 30-day effortless returns, and round-the-clock concierge advice for every member.
            </p>
          </div>
        </div>
      </section>

      {/* 3. IMPACT STATS */}
      <section className="p-10 sm:p-14 rounded-3xl bg-onyx-950 text-white shadow-2xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          <div className="space-y-1">
            <p className="font-serif text-4xl sm:text-5xl font-bold text-gold">50K+</p>
            <p className="text-xs text-slate-400 font-medium">Privé Members Worldwide</p>
          </div>
          <div className="space-y-1 pt-6 lg:pt-0">
            <p className="font-serif text-4xl sm:text-5xl font-bold text-gold">45+</p>
            <p className="text-xs text-slate-400 font-medium">Countries Delivered</p>
          </div>
          <div className="space-y-1 pt-6 lg:pt-0">
            <p className="font-serif text-4xl sm:text-5xl font-bold text-gold">100%</p>
            <p className="text-xs text-slate-400 font-medium">Carbon-Neutral Logistics</p>
          </div>
          <div className="space-y-1 pt-6 lg:pt-0">
            <p className="font-serif text-4xl sm:text-5xl font-bold text-gold">99.4%</p>
            <p className="text-xs text-slate-400 font-medium">Client Satisfaction Score</p>
          </div>
        </div>
      </section>

      {/* 4. CONCIERGE CONTACT & FAQ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Contact Concierge Form */}
        <div className="lg:col-span-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-aura-800">
              Personal Attention
            </span>
            <h3 className="font-serif text-2xl font-bold text-onyx-950 mt-1">
              Contact the AURA Concierge
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Whether inquiring about bespoke sizing, corporate gifting, or styling advice, our personal stylists are at your disposal.
            </p>
          </div>

          <form onSubmit={handleInquirySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="e.g. Genevieve Dupond"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="genevieve@luxury.fr"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Inquiry Topic
              </label>
              <select
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600 bg-white"
              >
                <option value="concierge">Personal Styling & Sizing Advice</option>
                <option value="order">Order Tracking & White-Glove Shipping</option>
                <option value="gifting">Bespoke Corporate Gifting</option>
                <option value="press">Press & Collaborations</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Your Message *
              </label>
              <textarea
                rows={4}
                required
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="How may our concierge assist your personal wardrobe or order today?"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-onyx-950 hover:bg-aura-800 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-gold" />
              <span>Send Message to Concierge</span>
            </button>
          </form>
        </div>

        {/* FAQ Accordion */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-aura-800">
              Frequently Clarified
            </span>
            <h3 className="font-serif text-2xl font-bold text-onyx-950 mt-1">
              Atelier Inquiries & FAQs
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif text-sm font-bold text-slate-900 hover:text-aura-800 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-aura-800' : ''
                    }`}
                  />
                </button>

                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed animate-fade-in border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
};
