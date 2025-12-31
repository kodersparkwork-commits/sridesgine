import React, { useEffect, useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';
import Pagination from '../components/Pagination';
import SkeletonProductCard from '../components/SkeletonProductCard';
import { SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/Navbar';
import SubcategoryCircles from '../components/SubcategoryCircles';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 200000],
    category: 'all',
    inStock: false,
    sortBy: 'name',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isFilterOpen]);


  // Dummy products for testing
  const dummyProducts = [
    { _id: '1', name: 'Gold Plated Necklace', price: 2500, category: 'necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', inStock: true },
    { _id: '2', name: 'Diamond Ring', price: 15000, category: 'rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', inStock: true },
    { _id: '3', name: 'Pearl Earrings', price: 3500, category: 'earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', inStock: true },
    { _id: '4', name: 'Temple Pendant Set', price: 5500, category: 'temple-jewellery', image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400', inStock: true },
    { _id: '5', name: 'Traditional Bangles Set', price: 4200, category: 'bangles', image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400', inStock: true },
    { _id: '6', name: 'Silk Saree', price: 8500, category: 'sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', inStock: true },
    { _id: '7', name: 'Ruby Pendant', price: 12000, category: 'pendants', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400', inStock: true },
    { _id: '8', name: 'Silver Necklace', price: 1800, category: 'necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', inStock: true },
    { _id: '9', name: 'Emerald Ring', price: 18000, category: 'rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', inStock: true },
    { _id: '10', name: 'Gold Hoop Earrings', price: 4500, category: 'earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', inStock: true },
    { _id: '11', name: 'Antique Necklace', price: 6500, category: 'necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', inStock: true },
    { _id: '12', name: 'Designer Bangles', price: 3800, category: 'bangles', image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400', inStock: true },
    { _id: '13', name: 'Bridal Necklace Set', price: 25000, category: 'necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', inStock: true },
    { _id: '14', name: 'Wedding Ring', price: 22000, category: 'rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', inStock: true },
    { _id: '15', name: 'Jhumka Earrings', price: 2800, category: 'earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', inStock: true },
    { _id: '16', name: 'Temple Jewellery Set', price: 15500, category: 'temple-jewellery', image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400', inStock: true },
    { _id: '17', name: 'Kundan Pendant', price: 7200, category: 'pendants', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400', inStock: true },
    { _id: '18', name: 'Banarasi Saree', price: 12500, category: 'sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', inStock: true },
    { _id: '19', name: 'Gold Bangles', price: 8800, category: 'bangles', image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400', inStock: true },
    { _id: '20', name: 'Polki Necklace', price: 28000, category: 'necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', inStock: true },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${baseUrl}/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        const fetchedProducts = data.products || data;
        // Use dummy products if no products fetched
        setProducts(fetchedProducts.length > 0 ? fetchedProducts : dummyProducts);
      } catch (err) {
        console.log('Using dummy products:', err.message);
        // Use dummy products on error
        setProducts(dummyProducts);
        setError(null); // Clear error when using dummy data
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    // Ensure baseline categories are always present
    const baseline = ['rings', 'necklaces', 'earrings', 'pendants', 'temple-jewellery', 'bangles', 'sarees', 'dresses'];
    const cats = products.map(p => p.category).filter(Boolean);
    const merged = Array.from(new Set([...baseline, ...cats]));
    return ['all', ...merged];
  }, [products]);

  // Filter logic
  const filteredProducts = useMemo(() => {
    const list = products.filter(p => {
      const inPrice = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
      const normalizedCat = p.category ? p.category.toLowerCase().replace(/\s+/g, '-') : '';
      const inCategory = filters.category === 'all' || normalizedCat === filters.category || p.category === filters.category;
      const inStockOk = filters.inStock ? p.inStock !== false : true;
      return inPrice && inCategory && inStockOk;
    });
    const sortBy = filters.sortBy || 'name';
    const getCreatedTime = (p) => {
      if (p?.createdAt) {
        const t = new Date(p.createdAt).getTime();
        if (!Number.isNaN(t)) return t;
      }
      const id = p?._id || p?.id || '';
      if (typeof id === 'string' && id.length === 24) {
        const tsHex = id.slice(0, 8);
        const seconds = parseInt(tsHex, 16);
        if (!Number.isNaN(seconds)) return seconds * 1000;
      }
      return 0;
    };
    return [...list].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'newest':
          return getCreatedTime(b) - getCreatedTime(a);
        default:
          return 0;
      }
    });
  }, [products, filters]);

  // Reset to page 1 when filters or product list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, products]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  const activeFilters = useMemo(() => {
    let count = 0;
    if (filters.inStock) count++;
    if (filters.category && filters.category !== 'all') count++;
    return count;
  }, [filters]);

  // Category circle items with images
  const categoryCircles = useMemo(() => [
    {
      value: 'all',
      label: 'All',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop'
    },
    {
      value: 'rings',
      label: 'Rings',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop'
    },
    {
      value: 'necklaces',
      label: 'Necklaces',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop'
    },
    {
      value: 'earrings',
      label: 'Earrings',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=200&fit=crop'
    },
    {
      value: 'pendants',
      label: 'Pendants',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=200&fit=crop'
    },
    {
      value: 'temple-jewellery',
      label: 'Temple Jewellery',
      image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=200&h=200&fit=crop'
    },
    {
      value: 'bangles',
      label: 'Bangles',
      image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=200&h=200&fit=crop'
    },
    {
      value: 'sarees',
      label: 'Sarees',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=200&fit=crop'
    },
  ], []);

  return (
    <>
      <Navbar />
      <div className="bg-background min-h-screen pt-24 pb-12">
        {/* Header */}
        <section className="bg-secondary/30 py-12 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-3xl md:text-4xl text-primary mb-4">Shop All Products</h1>
            <p className="text-text-muted max-w-2xl mx-auto">
              Explore our exclusive collection. Use filters to find the perfect piece for you.
            </p>
          </div>
        </section>

        {/* Category Circles */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <SubcategoryCircles
            items={categoryCircles}
            value={filters.category}
            onChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Filters Sidebar (Desktop) */}
            <aside className={`lg:w-64 flex-shrink-0 ${isFilterOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto lg:static lg:block lg:bg-transparent lg:p-0' : 'hidden lg:block'}`}>
              <div className="flex justify-between items-center lg:hidden mb-4">
                <h2 className="font-serif text-xl">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="text-text-muted">Close</button>
              </div>
              <FilterPanel
                products={products}
                onFilterChange={f => setFilters(fl => ({
                  ...fl,
                  priceRange: Array.isArray(f.priceRange) ? f.priceRange : fl.priceRange,
                  category: f.category ?? fl.category,
                  inStock: typeof f.inStock === 'boolean' ? f.inStock : fl.inStock,
                  sortBy: f.sortBy || fl.sortBy,
                }))}
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(false)}
                categories={categories}
                selectedCategory={filters.category}
              />
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-text-muted">
                  Showing <span className="font-medium text-text-main">{paginatedProducts.length}</span> of <span className="font-medium text-text-main">{filteredProducts.length}</span> products
                </div>
                <button
                  className="lg:hidden flex items-center gap-2 text-primary font-medium"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <SlidersHorizontal size={18} /> Filters {activeFilters > 0 && `(${activeFilters})`}
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <SkeletonProductCard key={idx} />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-12">{error}</div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-border">
                  <p className="text-text-muted text-lg">No products match your filters.</p>
                  <button
                    onClick={() => setFilters({ priceRange: [0, 200000], category: 'all', inStock: false, sortBy: 'name' })}
                    className="mt-4 text-primary hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {paginatedProducts.map(product => (
                      <ProductCard key={product._id || product.id} product={product} />
                    ))}
                  </div>
                  <div className="mt-12">
                    <Pagination
                      currentPage={currentPage}
                      totalItems={filteredProducts.length}
                      pageSize={PAGE_SIZE}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
