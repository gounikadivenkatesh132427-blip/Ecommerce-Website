import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, PROMO_CODES, CURRENCIES } from '../data/products';
import { api } from '../services/api';

const ShopContext = createContext();

const DEMO_USERS = {
  emma: {
    id: 'usr-1',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@aura.luxury',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    tier: 'AURA Black VIP',
    points: 1450,
    memberSince: '2023',
    savedAddresses: [
      {
        id: 'addr-1',
        title: 'Primary Residence',
        fullName: 'Ananya Sharma',
        street: 'Penthouse 12, Golf Links Enclave',
        city: 'New Delhi',
        state: 'Delhi',
        zip: '110003',
        country: 'India',
        phone: '+91 98101 23456',
        isDefault: true
      }
    ]
  },
  alex: {
    id: 'usr-2',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@aura.luxury',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    tier: 'AURA Gold Member',
    points: 820,
    memberSince: '2024',
    savedAddresses: [
      {
        id: 'addr-2',
        title: 'Sea Face Penthouse',
        fullName: 'Rohan Mehta',
        street: '18B Altamount Road, Cumballa Hill',
        city: 'Mumbai',
        state: 'MH',
        zip: '400026',
        country: 'India',
        phone: '+91 98200 87654',
        isDefault: true
      }
    ]
  }
};

export const ShopProvider = ({ children }) => {
  // Navigation / Page state
  const [currentPage, setCurrentPage] = useState('home');
  const [currentProductId, setCurrentProductId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_cart');
      return saved ? JSON.parse(saved) : [
        // Realistic default initial item
        {
          cartItemId: 'prod-fash-1-M-Camel Tan',
          product: PRODUCTS[0],
          selectedSize: 'M',
          selectedColor: PRODUCTS[0].colors[0],
          quantity: 1,
          price: PRODUCTS[0].price
        }
      ];
    } catch {
      return [];
    }
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_wishlist');
      return saved ? JSON.parse(saved) : ['prod-beauty-1', 'prod-elec-1', 'prod-acc-1'];
    } catch {
      return [];
    }
  });

  // User state
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_user');
      return saved ? JSON.parse(saved) : DEMO_USERS.emma;
    } catch {
      return DEMO_USERS.emma;
    }
  });

  // Orders state
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_orders');
      return saved ? JSON.parse(saved) : [
        {
          orderId: 'AURA-98241',
          date: '2026-08-28',
          items: [
            {
              product: PRODUCTS[4], // Lumiere Face Elixir (7999)
              quantity: 1,
              selectedSize: '50ml / 1.7 fl oz',
              selectedColor: PRODUCTS[4].colors[0],
              price: PRODUCTS[4].price
            },
            {
              product: PRODUCTS[12], // Palermo Tote (32900)
              quantity: 1,
              selectedSize: 'Large (Fits 15" Laptop)',
              selectedColor: PRODUCTS[12].colors[0],
              price: PRODUCTS[12].price
            }
          ],
          subtotal: 40899,
          discount: 8180,
          shipping: 0,
          tax: 5889,
          total: 38608,
          status: 'Delivered',
          shippingMethod: 'Express Courier (Free VIP Tier)',
          trackingNumber: 'AU-EXP-88937190',
          shippingAddress: {
            fullName: 'Ananya Sharma',
            street: 'Penthouse 12, Golf Links Enclave',
            city: 'New Delhi',
            state: 'Delhi',
            zip: '110003',
            country: 'India'
          },
          trackingSteps: [
            { label: 'Order Confirmed', date: 'Aug 28, 10:30 AM', completed: true },
            { label: 'Artisan Packaged', date: 'Aug 28, 03:45 PM', completed: true },
            { label: 'Shipped with Express', date: 'Aug 29, 08:15 AM', completed: true },
            { label: 'Delivered', date: 'Aug 30, 02:20 PM', completed: true }
          ]
        }
      ];
    } catch {
      return [];
    }
  });

  // Active Promo Code
  const [activePromo, setActivePromo] = useState(null);

  // Currency
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  // Modals and Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('aura_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('aura_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aura_user');
    }
  }, [user]);

  // Scroll to top on page navigation
  const navigateTo = (page, productId = null, categorySlug = null) => {
    setCurrentPage(page);
    if (productId !== null) setCurrentProductId(productId);
    if (categorySlug !== null) setSelectedCategory(categorySlug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toast Helper
  const addToast = ({ type = 'success', title, message }) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Management
  const addToCart = (product, quantity = 1, size = null, color = null) => {
    const selectedSize = size || (product.sizes ? product.sizes[0] : 'Standard');
    const selectedColor = color || (product.colors ? product.colors[0] : { name: 'Default', hex: '#000000' });
    const cartItemId = `${product.id}-${selectedSize}-${selectedColor.name}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            product,
            selectedSize,
            selectedColor,
            quantity,
            price: product.price
          }
        ];
      }
    });

    addToast({
      type: 'success',
      title: 'Added to Aura Cart',
      message: `${product.name} (${selectedSize}) is now in your bag.`
    });
  };

  const updateCartQuantity = (cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    addToast({
      type: 'info',
      title: 'Item Removed',
      message: 'Item has been removed from your shopping bag.'
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Management
  const toggleWishlist = (productId) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast({
          type: 'info',
          title: 'Removed from Wishlist',
          message: product ? `${product.name} removed from your saved items.` : 'Removed from wishlist.'
        });
        return prev.filter((id) => id !== productId);
      } else {
        addToast({
          type: 'success',
          title: 'Saved to Wishlist',
          message: product ? `${product.name} added to your personal curated list.` : 'Saved to wishlist.'
        });
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  // Promo Code with Backend Validation
  const applyPromo = async (code) => {
    const trimmed = code.trim().toUpperCase();
    const result = await api.validatePromo(trimmed, cartSubtotal);

    if (result && result.success) {
      setActivePromo(result.data);
      addToast({
        type: 'success',
        title: 'Promo Code Applied!',
        message: `Code "${trimmed}" applied: ${result.data.description}`
      });
      return { success: true };
    } else {
      addToast({
        type: 'error',
        title: 'Invalid Coupon Code',
        message: result?.message || 'Please try "AURA20" for 20% off or "VIP500" for ₹500 off.'
      });
      return { success: false, message: result?.message || 'Invalid promo code' };
    }
  };

  const removePromo = () => {
    setActivePromo(null);
    addToast({
      type: 'info',
      title: 'Promo Removed',
      message: 'Discount code has been cleared.'
    });
  };

  // Pricing Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (activePromo) {
    if (activePromo.type === 'percentage') {
      discountAmount = (cartSubtotal * activePromo.value) / 100;
    } else if (activePromo.type === 'fixed') {
      discountAmount = cartSubtotal >= (activePromo.minSpend || 0) ? activePromo.value : 0;
    }
  }

  const freeShippingThreshold = 5000;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold || activePromo?.type === 'shipping';
  const standardShippingCost = isFreeShipping || cartSubtotal === 0 ? 0 : 350;
  const estimatedTax = cartSubtotal > 0 ? (cartSubtotal - discountAmount) * 0.18 : 0;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + standardShippingCost + estimatedTax);
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Currency Formatter
  const formatPrice = (amountInUSD) => {
    const converted = amountInUSD * currency.rate;
    if (currency.code === 'INR') {
      return `${currency.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${currency.symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Auth helper
  const switchDemoUser = async (key) => {
    const res = await api.login({ demoKey: key });
    if (res && res.success) {
      setUser(res.data);
      addToast({
        type: 'success',
        title: 'Logged in as Demo User',
        message: `Welcome back, ${res.data.name} (${res.data.tier})`
      });
    } else if (DEMO_USERS[key]) {
      setUser(DEMO_USERS[key]);
      addToast({
        type: 'success',
        title: 'Logged in as Demo User',
        message: `Welcome back, ${DEMO_USERS[key].name} (${DEMO_USERS[key].tier})`
      });
    }
  };

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res && res.success) {
      setUser(res.data);
      addToast({
        type: 'success',
        title: 'Welcome to AURA',
        message: `Signed in successfully as ${email}`
      });
    } else {
      const mockUser = {
        id: 'usr-' + Date.now(),
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        tier: 'AURA Gold Member',
        points: 250,
        memberSince: '2026',
        savedAddresses: []
      };
      setUser(mockUser);
      addToast({
        type: 'success',
        title: 'Welcome to AURA',
        message: `Signed in successfully as ${email}`
      });
    }
  };

  const signup = async (userData) => {
    const res = await api.register(userData);
    if (res && res.success) {
      setUser(res.data);
      addToast({
        type: 'success',
        title: 'Account Created',
        message: `Welcome to the AURA Sanctuary, ${userData.firstName}!`
      });
    } else {
      const newUser = {
        id: 'usr-' + Date.now(),
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        tier: 'AURA Member',
        points: 100,
        memberSince: '2026',
        savedAddresses: []
      };
      setUser(newUser);
      addToast({
        type: 'success',
        title: 'Account Created',
        message: `Welcome to the AURA Sanctuary, ${userData.firstName}!`
      });
    }
  };

  const logout = () => {
    setUser(null);
    addToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been safely signed out.'
    });
  };

  // Order Placement with Backend Integration
  const createOrder = async (orderData) => {
    const payload = {
      userId: user?.id,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      shippingCost: orderData.shippingCost || 0,
      tax: estimatedTax,
      total: orderData.total || grandTotal,
      shippingMethod: orderData.shippingMethod || 'Express Delivery',
      paymentMethod: orderData.paymentMethod || 'Credit Card',
      shippingAddress: orderData.shippingAddress,
      customerInfo: orderData.customerInfo
    };

    // Try creating on Express backend
    const backendOrder = await api.createOrder(payload);

    const finalizedOrder = backendOrder || {
      orderId: 'AURA-' + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      shipping: orderData.shippingCost || 0,
      tax: estimatedTax,
      total: orderData.total || grandTotal,
      status: 'Processing',
      shippingMethod: orderData.shippingMethod || 'Express Delivery',
      paymentMethod: orderData.paymentMethod || 'Credit Card',
      trackingNumber: `AU-${Math.floor(10000000 + Math.random() * 90000000)}`,
      shippingAddress: orderData.shippingAddress,
      customerInfo: orderData.customerInfo,
      trackingSteps: [
        { label: 'Order Confirmed', date: 'Just now', completed: true },
        { label: 'Artisan Packaging', date: 'In Progress', completed: false },
        { label: 'Express Dispatch', date: 'Pending', completed: false },
        { label: 'Delivery at Doorstep', date: 'Estimated in 2-3 days', completed: false }
      ]
    };

    setOrders((prev) => [finalizedOrder, ...prev]);
    clearCart();
    return finalizedOrder;
  };

  return (
    <ShopContext.Provider
      value={{
        // Routing & views
        currentPage,
        currentProductId,
        selectedCategory,
        setSelectedCategory,
        navigateTo,

        // Data
        products: PRODUCTS,

        // Cart
        cart,
        addToCart,
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
        totalCartCount,
        isCartOpen,
        setIsCartOpen,

        // Wishlist
        wishlist,
        toggleWishlist,
        isInWishlist,

        // Promo
        activePromo,
        applyPromo,
        removePromo,

        // Currency
        currency,
        setCurrency,
        formatPrice,

        // Search & Modals
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        quickViewProduct,
        setQuickViewProduct,

        // Auth & Profile
        user,
        switchDemoUser,
        login,
        signup,
        logout,

        // Orders
        orders,
        createOrder,

        // Toasts
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
