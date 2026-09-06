import express from 'express';
import { db } from '../data/db.js';

const router = express.Router();

// GET /api/categories
router.get('/categories', (req, res) => {
  try {
    const categories = db.getCategories();
    const products = db.getProducts();

    // Calculate live item counts
    const enriched = categories.map((cat) => ({
      ...cat,
      liveCount: products.filter((p) => p.categorySlug === cat.slug).length
    }));

    res.json({ success: true, data: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/products (with filtering, sorting, and search)
router.get('/products', (req, res) => {
  try {
    let products = db.getProducts();
    const {
      category,
      minPrice,
      maxPrice,
      brand,
      minRating,
      inStock,
      onSale,
      search,
      sortBy,
      limit
    } = req.query;

    // Filter by Category
    if (category && category !== 'all') {
      products = products.filter(
        (p) => p.categorySlug === category.toLowerCase() || p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by Price
    if (minPrice) {
      products = products.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      products = products.filter((p) => p.price <= Number(maxPrice));
    }

    // Filter by Brand
    if (brand) {
      const brandsList = Array.isArray(brand) ? brand : brand.split(',');
      products = products.filter((p) =>
        brandsList.some((b) => b.trim().toLowerCase() === p.brand.toLowerCase())
      );
    }

    // Filter by Rating
    if (minRating) {
      products = products.filter((p) => p.rating >= Number(minRating));
    }

    // Filter by Stock
    if (inStock === 'true') {
      products = products.filter((p) => p.inStock);
    }

    // Filter by Sale
    if (onSale === 'true') {
      products = products.filter((p) => p.discount && p.discount > 0);
    }

    // Filter by Search text
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else {
      // Default: featured first
      products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    // Limit
    if (limit) {
      products = products.slice(0, Number(limit));
    }

    res.json({
      success: true,
      total: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/products/:id
router.get('/products/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch related products in the same category
    const all = db.getProducts();
    const related = all
      .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
      .slice(0, 4);

    res.json({
      success: true,
      data: {
        ...product,
        relatedProducts: related
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/products (Admin: Add Product)
router.post('/products', (req, res) => {
  try {
    const {
      name,
      category,
      brand,
      price,
      originalPrice,
      stock,
      description,
      shortDescription,
      images,
      colors,
      sizes,
      specs,
      isFeatured,
      isTrending,
      isNew
    } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ success: false, message: 'Name, category, and price are required' });
    }

    const products = db.getProducts();
    const categorySlug = category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = 'prod-' + categorySlug.substring(0, 4) + '-' + (products.length + 1);

    const newProduct = {
      id,
      name,
      slug,
      category,
      categorySlug,
      brand: brand || 'Aura Atelier',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.25),
      discount: originalPrice ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100) : 20,
      rating: 5.0,
      reviewsCount: 1,
      inStock: Number(stock) > 0,
      stock: Number(stock) || 15,
      isFeatured: Boolean(isFeatured),
      isTrending: Boolean(isTrending),
      isBestSeller: false,
      isNew: isNew !== undefined ? Boolean(isNew) : true,
      shortDescription: shortDescription || description?.substring(0, 100),
      description: description || 'Artisanal luxury creation by AURA.',
      images: images && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=900&auto=format&fit=crop'
      ],
      colors: colors || [{ name: 'Default', hex: '#18181B' }],
      sizes: sizes || ['Standard'],
      specs: specs || { 'Craft': 'Artisan Handcrafted', 'Origin': 'European Workshop' }
    };

    products.unshift(newProduct);
    db.saveProducts(products);

    res.status(201).json({
      success: true,
      message: 'Product added successfully to catalog',
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/products/:id (Admin: Edit Product)
router.put('/products/:id', (req, res) => {
  try {
    const products = db.getProducts();
    const index = products.findIndex((p) => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updated = {
      ...products[index],
      ...req.body,
      price: req.body.price ? Number(req.body.price) : products[index].price,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : products[index].stock,
      inStock: req.body.stock !== undefined ? Number(req.body.stock) > 0 : products[index].inStock
    };

    products[index] = updated;
    db.saveProducts(products);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/products/:id (Admin: Delete Product)
router.delete('/products/:id', (req, res) => {
  try {
    let products = db.getProducts();
    const initialLen = products.length;
    products = products.filter((p) => p.id !== req.params.id);

    if (products.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    db.saveProducts(products);
    res.json({
      success: true,
      message: 'Product deleted successfully from catalog'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/products/:id/reviews
router.post('/products/:id/reviews', (req, res) => {
  try {
    const { name, rating, title, comment } = req.body;
    if (!name || !title || !comment) {
      return res.status(400).json({ success: false, message: 'Missing required review fields' });
    }

    const products = db.getProducts();
    const index = products.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const newReview = {
      id: 'rev-' + Date.now(),
      name,
      rating: Number(rating) || 5,
      date: 'Just now',
      title,
      comment,
      verified: true
    };

    if (!products[index].userReviews) {
      products[index].userReviews = [];
    }
    products[index].userReviews.unshift(newReview);
    products[index].reviewsCount += 1;

    db.saveProducts(products);

    res.status(201).json({
      success: true,
      message: 'Review recorded successfully',
      data: newReview
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
