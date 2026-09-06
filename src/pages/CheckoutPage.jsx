import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Lock,
  Package,
  QrCode,
  Smartphone,
  Printer,
  Sparkles,
  ChevronRight,
  Clock,
  MapPin,
  User,
  ShoppingBag
} from 'lucide-react';

export const CheckoutPage = () => {
  const {
    cart,
    cartSubtotal,
    discountAmount,
    isFreeShipping,
    formatPrice,
    createOrder,
    navigateTo,
    user,
    activePromo
  } = useShop();

  // Active step: 1 (Contact/Shipping), 2 (Delivery/Payment), 3 (Confirmation)
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Form State: Customer & Address
  const [formData, setFormData] = useState({
    email: user?.email || 'ananya.sharma@aura.luxury',
    phone: user?.savedAddresses?.[0]?.phone || '+91 98101 23456',
    firstName: user?.name ? user.name.split(' ')[0] : 'Ananya',
    lastName: user?.name ? user.name.split(' ')[1] || 'Sharma' : 'Sharma',
    street: user?.savedAddresses?.[0]?.street || 'Penthouse 12, Golf Links Enclave',
    city: user?.savedAddresses?.[0]?.city || 'New Delhi',
    state: user?.savedAddresses?.[0]?.state || 'Delhi',
    zip: user?.savedAddresses?.[0]?.zip || '110003',
    country: 'India'
  });

  // Delivery Method: 'standard' | 'express' | 'concierge'
  const [deliveryMethod, setDeliveryMethod] = useState('standard');

  // Payment Method: 'card' | 'applepay' | 'upi' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Card details state for interactive preview
  const [cardDetails, setCardDetails] = useState({
    number: '4532 •••• •••• 8921',
    name: 'ANANYA SHARMA',
    expiry: '08/29',
    cvc: '742'
  });

  const deliveryOptions = [
    {
      id: 'standard',
      title: 'Standard Carbon-Neutral Delivery',
      time: '3 - 5 Business Days',
      cost: isFreeShipping ? 0 : 350,
      description: 'Zero-emission courier delivery in custom FSC-certified packaging.'
    },
    {
      id: 'express',
      title: 'Express Priority Air',
      time: '1 - 2 Business Days',
      cost: 750,
      description: 'Guaranteed expedited air transit with hourly GPS tracking.'
    },
    {
      id: 'concierge',
      title: 'White-Glove VIP Concierge',
      time: 'Next Day Scheduled Slot',
      cost: 1500,
      description: 'Hand-delivered by an AURA personal ambassador with evening appointment.'
    }
  ];

  const selectedDeliveryCost = deliveryOptions.find((d) => d.id === deliveryMethod)?.cost || 0;
  const estimatedTax = (cartSubtotal - discountAmount) * 0.18;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + selectedDeliveryCost + estimatedTax);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (currentStep === 1) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const order = createOrder({
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
          phone: formData.phone
        },
        customerInfo: {
          email: formData.email,
          phone: formData.phone
        },
        shippingMethod: deliveryOptions.find((d) => d.id === deliveryMethod)?.title,
        shippingCost: selectedDeliveryCost,
        paymentMethod:
          paymentMethod === 'card'
            ? 'Credit Card (•••• 8921)'
            : paymentMethod === 'applepay'
            ? 'Apple Pay'
            : paymentMethod === 'upi'
            ? 'UPI FastPay'
            : 'Cash on Delivery (COD)',
        total: finalTotal
      });

      setCompletedOrder(order);
      setIsProcessing(false);
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Trigger Celebration Confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#CFB58E', '#0F172A', '#EADECE']
        });
      } catch (e) {
        // Safe fallback if canvas not available
      }
    }, 1800);
  };

  // If cart is empty and not on confirmation step, redirect
  if (cart.length === 0 && currentStep !== 3) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-slate-900">Your bag is empty</h2>
        <p className="text-xs text-slate-500">Please add items to your shopping bag before proceeding to checkout.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-2.5 rounded-xl bg-onyx-950 text-white text-xs font-bold uppercase"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  // ---------------- STEP 3: ORDER CONFIRMATION VIEW ----------------
  if (currentStep === 3 && completedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in">
        
        {/* Celebration Header */}
        <div className="text-center space-y-4 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-luxury">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm border border-emerald-100">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/15 text-aura-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Order Confirmed & Placed</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-onyx-950">
            Thank You for Your Order
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            A confirmation email has been dispatched to <strong>{formData.email}</strong> with your full invoice and live delivery tracking link.
          </p>

          <div className="pt-2 flex items-center justify-center gap-4 text-xs">
            <div className="px-4 py-2 rounded-xl bg-[#FAF8F5] border border-slate-200">
              <span className="text-slate-400 font-medium">Order Number:</span>{' '}
              <strong className="text-onyx-950">{completedOrder.orderId}</strong>
            </div>
            <div className="px-4 py-2 rounded-xl bg-[#FAF8F5] border border-slate-200">
              <span className="text-slate-400 font-medium">Tracking Number:</span>{' '}
              <strong className="text-aura-800">{completedOrder.trackingNumber}</strong>
            </div>
          </div>
        </div>

        {/* Live Tracking Timeline */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              <h3 className="font-serif text-base font-bold text-slate-900">
                Order Tracking Status
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Estimated Delivery: 2-3 Business Days
            </span>
          </div>

          {/* Steps Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {completedOrder.trackingSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                    step.completed ? 'bg-onyx-950 text-white shadow-sm' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step.completed ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <p className="text-xs font-bold text-slate-900">{step.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{step.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Receipt & Item Summary */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-serif text-base font-bold text-slate-900">
              Purchased Items & Breakdown
            </h3>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs font-semibold text-aura-800 hover:text-aura-950"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice Receipt</span>
            </button>
          </div>

          {/* Line items in confirmation */}
          <div className="divide-y divide-slate-100">
            {completedOrder.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-14 h-16 object-cover rounded-xl border border-slate-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{item.product.name}</p>
                    <p className="text-[11px] text-slate-500">
                      Qty: {item.quantity} • Size: {item.selectedSize}
                    </p>
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Total Breakdown */}
          <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600 max-w-xs ml-auto">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-900">{formatPrice(completedOrder.subtotal)}</span>
            </div>
            {completedOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Savings Discount:</span>
                <span>-{formatPrice(completedOrder.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Tier:</span>
              <span>{completedOrder.shipping === 0 ? 'Free' : formatPrice(completedOrder.shipping)}</span>
            </div>
            <div className="flex justify-between text-sm font-serif font-bold text-onyx-950 pt-2 border-t border-slate-200">
              <span>Grand Total:</span>
              <span>{formatPrice(completedOrder.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigateTo('home')}
            className="px-8 py-3.5 rounded-full bg-onyx-950 hover:bg-aura-800 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md"
          >
            Return to Homepage
          </button>
          <button
            onClick={() => navigateTo('shop')}
            className="px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Continue Shopping Catalog
          </button>
        </div>

      </div>
    );
  }

  // ---------------- STEPS 1 & 2: CHECKOUT FORM FLOW ----------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Checkout Progress Stepper */}
      <div className="max-w-xl mx-auto flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep === 1 ? 'bg-onyx-950 text-white' : 'bg-emerald-600 text-white'
            }`}
          >
            {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
          </div>
          <span className={`text-xs font-bold ${currentStep === 1 ? 'text-onyx-950' : 'text-slate-500'}`}>
            Contact & Address
          </span>
        </div>

        <div className="w-12 h-0.5 bg-slate-200" />

        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep === 2 ? 'bg-onyx-950 text-white' : 'bg-slate-200 text-slate-500'
            }`}
          >
            2
          </div>
          <span className={`text-xs font-bold ${currentStep === 2 ? 'text-onyx-950' : 'text-slate-400'}`}>
            Delivery & Payment
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Interactive Form Steps */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STEP 1: CONTACT & SHIPPING ADDRESS */}
          {currentStep === 1 && (
            <form onSubmit={handleNextStep} className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="font-serif text-xl font-bold text-onyx-950">
                  1. Contact & Shipping Details
                </h2>
                {user && (
                  <span className="text-[11px] font-semibold text-aura-800 bg-aura-50 px-2.5 py-1 rounded-full">
                    Pre-filled for {user.name}
                  </span>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Shipping Address
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Street Address & Apartment/Suite *
                  </label>
                  <input
                    type="text"
                    required
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      State / Region *
                    </label>
                    <input
                      type="text"
                      required
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      ZIP / Postal *
                    </label>
                    <input
                      type="text"
                      required
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600 bg-white"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="France">France</option>
                    <option value="Italy">Italy</option>
                    <option value="Germany">Germany</option>
                    <option value="India">India</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-onyx-950 hover:bg-aura-800 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md group"
              >
                <span>Continue to Delivery & Payment</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}

          {/* STEP 2: DELIVERY METHOD & PAYMENT */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Delivery Method Selection */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-serif text-lg font-bold text-onyx-950">
                    2. Select Delivery Method
                  </h3>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-aura-800 font-bold underline"
                  >
                    Edit Address
                  </button>
                </div>

                <div className="space-y-3">
                  {deliveryOptions.map((opt) => (
                    <label
                      key={opt.id}
                      onClick={() => setDeliveryMethod(opt.id)}
                      className={`flex items-start justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        deliveryMethod === opt.id
                          ? 'border-onyx-950 bg-[#FAF8F5] shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          checked={deliveryMethod === opt.id}
                          onChange={() => setDeliveryMethod(opt.id)}
                          className="accent-onyx-900 mt-1"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{opt.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{opt.description}</p>
                          <span className="inline-block text-[10px] font-semibold text-aura-800 mt-1">
                            Estimated: {opt.time}
                          </span>
                        </div>
                      </div>

                      <span className="font-serif text-sm font-bold text-onyx-950">
                        {opt.cost === 0 ? 'FREE' : formatPrice(opt.cost)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                <h3 className="font-serif text-lg font-bold text-onyx-950 pb-3 border-b border-slate-100">
                  3. Payment Method
                </h3>

                {/* Payment Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-onyx-950 bg-onyx-950 text-white shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('applepay')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'applepay'
                        ? 'border-onyx-950 bg-onyx-950 text-white shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Apple / G-Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-onyx-950 bg-onyx-950 text-white shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>UPI Instant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-onyx-950 bg-onyx-950 text-white shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span>Cash on Delivery</span>
                  </button>
                </div>

                {/* Credit Card Interactive Preview & Fields */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 pt-2 animate-fade-in">
                    
                    {/* Visual Card Cardholder Widget */}
                    <div className="p-5 rounded-2xl bg-gradient-to-tr from-onyx-950 via-slate-900 to-onyx-800 text-white shadow-xl space-y-4 max-w-sm mx-auto border border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="font-serif text-lg font-bold tracking-widest text-gold">AURA BLACK</span>
                        <CreditCard className="w-6 h-6 text-white/70" />
                      </div>
                      <div className="py-2">
                        <p className="font-mono text-base tracking-widest">{cardDetails.number}</p>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <div>
                          <p className="uppercase">Cardholder</p>
                          <p className="font-bold text-white uppercase text-xs">{cardDetails.name}</p>
                        </div>
                        <div>
                          <p className="uppercase">Expires</p>
                          <p className="font-bold text-white text-xs">{cardDetails.expiry}</p>
                        </div>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          placeholder="4532 •••• •••• 8921"
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600 font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            placeholder="MM/YY"
                            className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                            Security CVC
                          </label>
                          <input
                            type="text"
                            value={cardDetails.cvc}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                            placeholder="742"
                            className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-aura-600 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* 1-Click Apple Pay / Google Pay */}
                {paymentMethod === 'applepay' && (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3 animate-fade-in">
                    <Smartphone className="w-8 h-8 mx-auto text-slate-800" />
                    <h4 className="text-xs font-bold text-slate-900">Biometric 1-Touch Payment</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Authorize with Face ID / Touch ID when you click Place Order.
                    </p>
                  </div>
                )}

                {/* UPI Instant QR */}
                {paymentMethod === 'upi' && (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3 animate-fade-in">
                    <QrCode className="w-12 h-12 mx-auto text-aura-800" />
                    <h4 className="text-xs font-bold text-slate-900">Scan QR with any UPI App</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Supports Google Pay, PhonePe, Paytm, BHIM, and Apple UPI.
                    </p>
                  </div>
                )}

                {/* Cash on Delivery */}
                {paymentMethod === 'cod' && (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2 animate-fade-in">
                    <Package className="w-8 h-8 mx-auto text-slate-800" />
                    <h4 className="text-xs font-bold text-slate-900">Pay Upon White-Glove Delivery</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Inspect your garments at the door before presenting contactless card or cash payment.
                    </p>
                  </div>
                )}

                {/* Final Place Order Action */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handlePlaceOrder}
                    className="w-full py-4 rounded-2xl bg-onyx-950 hover:bg-aura-800 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-luxury hover:shadow-luxury-hover disabled:opacity-75"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Securing Atelier Order...</span>
                      </div>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-gold" />
                        <span>Authorize & Place Order ({formatPrice(finalTotal)})</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-900 font-semibold"
                  >
                    &larr; Return to Shipping Address
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Right: Sticky Order Summary Sidebar */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-onyx-950 pb-3 border-b border-slate-200">
              Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
            </h3>

            {/* Item list preview */}
            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.cartItemId} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-14 object-cover rounded-xl border border-slate-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-slate-500">
                        Qty: {item.quantity} • {item.selectedSize}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatPrice(cartSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Applied Promo Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Selected Shipping</span>
                <span>{selectedDeliveryCost === 0 ? 'Free' : formatPrice(selectedDeliveryCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span>{formatPrice(estimatedTax)}</span>
              </div>
              <div className="flex justify-between text-base font-serif font-bold text-onyx-950 pt-3 border-t border-slate-200">
                <span>Grand Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-2 border-t border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>256-Bit SSL Encrypted & Protected</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
