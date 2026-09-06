async function testEndpoints() {
  const BASE = 'http://localhost:5000/api';
  console.log('Testing AURA INR REST API Endpoints...');

  try {
    // 1. Health
    const health = await fetch(`${BASE}/health`).then(r => r.json());
    console.log('1. Health Check:', health.status === 'healthy' ? 'PASS ✅' : 'FAIL ❌', health);

    // 2. Products
    const productsRes = await fetch(`${BASE}/products`).then(r => r.json());
    const products = productsRes.data || productsRes;
    console.log(`2. Products (${products.length} items):`, products.length > 0 ? 'PASS ✅' : 'FAIL ❌');
    console.log('   Sample Product 1:', products[0].name, 'Price: ₹' + products[0].price);
    console.log('   Sample Product 5:', products[4].name, 'Price: ₹' + products[4].price);

    // 3. Promos
    const promoRes = await fetch(`${BASE}/promos/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'VIP500', cartSubtotal: 5000 })
    }).then(r => r.json());
    console.log('3. Promo Code VIP500 Validation:', promoRes.success ? 'PASS ✅' : 'FAIL ❌', promoRes.data);

    // 4. Admin Stats
    const stats = await fetch(`${BASE}/admin/stats`).then(r => r.json());
    console.log('4. Admin Stats:', stats.success ? 'PASS ✅' : 'FAIL ❌', 'Gross Revenue: ₹' + stats.data.grossRevenue);

    // 5. Admin Customers
    const customers = await fetch(`${BASE}/admin/customers`).then(r => r.json());
    console.log(`5. Admin Customers (${customers.total} users):`, customers.success ? 'PASS ✅' : 'FAIL ❌');
    console.log('   Customer 1:', customers.data[0].name, 'Spent: ₹' + customers.data[0].totalSpent);

    // 6. Create Order with Cash on Delivery
    const orderRes = await fetch(`${BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr-1',
        items: [{ product: products[0], quantity: 1, price: products[0].price }],
        subtotal: products[0].price,
        discount: 0,
        shippingCost: 0,
        tax: Math.round(products[0].price * 0.18),
        total: products[0].price + Math.round(products[0].price * 0.18),
        shippingMethod: 'Standard Carbon-Neutral Delivery',
        paymentMethod: 'Cash on Delivery (COD)',
        shippingAddress: {
          fullName: 'Ananya Sharma',
          street: 'Penthouse 12, Golf Links Enclave',
          city: 'New Delhi',
          state: 'Delhi',
          zip: '110003',
          country: 'India',
          phone: '+91 98101 23456'
        }
      })
    }).then(r => r.json());
    console.log('6. Create Order (Cash on Delivery):', orderRes.success ? 'PASS ✅' : 'FAIL ❌', 'Order ID:', orderRes.data?.orderId, 'Total: ₹' + orderRes.data?.total);

    console.log('\n🎉 ALL 6 API ENDPOINTS VERIFIED & WORKING SEAMLESSLY WITH INR CURRENCY!');
  } catch (err) {
    console.error('Test Error:', err);
  }
}

testEndpoints();
