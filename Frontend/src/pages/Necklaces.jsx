import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';
import Pagination from '../components/Pagination';
import { useProductFilters } from '../hooks/useProductFilters';
import { dummyProducts } from '../data/dummyData';

import SubcategoryCircles from '../components/SubcategoryCircles';

const Necklaces = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [subCategory, setSubCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  const {
    filteredProducts,
    handleFilterChange,
    getFilterStats
  } = useProductFilters(products);

  useEffect(() => {
    fetchNecklaces();
  }, [subCategory]);

  // Reset to first page when filters or subcategory change
  useEffect(() => { setCurrentPage(1); }, [subCategory, filteredProducts]);

  const fetchNecklaces = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const url = new URL(`${baseUrl}/products`);
      url.searchParams.set('category', 'necklaces');
      if (subCategory) url.searchParams.set('subCategory', subCategory);
      const response = await fetch(url.toString());

      if (response.ok) {
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts(dummyProducts.filter(p => p.category === 'necklaces'));
        }
      } else {
        throw new Error('Failed to fetch necklaces');
      }
    } catch (err) {
      console.error('Error fetching necklaces:', err);
      setProducts(dummyProducts.filter(p => p.category === 'necklaces'));
      setError('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="bg-secondary/30 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-primary mb-4">Necklaces Collection</h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Discover our exquisite necklace collection featuring traditional and contemporary designs.
            Perfect for weddings, festivals, and special occasions.
          </p>
        </div>
      </section>

      {/* Subcategories Circles below banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <SubcategoryCircles
          value={subCategory}
          onChange={setSubCategory}
          items={[
            { value: '', label: 'All', image: 'https://res.cloudinary.com/dm94ctges/image/upload/v1761928616/WhatsApp-Image-2023-12-20-at-13.11.04-1.jpeg_zhb29x.jpg' },
            { value: 'victorian', label: 'Victorian', image: 'https://res.cloudinary.com/dm94ctges/image/upload/v1761928611/diqwl_512_aqscho.webp' },
            { value: 'cz-stone', label: 'Cz Stone', image: 'https://res.cloudinary.com/dm94ctges/image/upload/v1761928612/images_-_2025-10-30T192217.317.jpeg_po1c7z.jpg' },
            { value: 'fashion', label: 'Fashion', image: 'https://res.cloudinary.com/dm94ctges/image/upload/v1761928621/greenstonebridaljewellery-scaled_ssuk75.jpg' },
            { value: 'gold-plated', label: 'Gold Plated', image: 'https://res.cloudinary.com/dm94ctges/image/upload/v1761928613/images_64.jpeg_qwinnt.jpg' },
          ]}
        />
      </div>

      {/* Products Section with Filters */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-8">
            {/* Filter Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <FilterPanel
                products={products}
                onFilterChange={handleFilterChange}
                category="necklaces"
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
              />
            </aside>

            {/* Products Grid */}
            <main className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-medium text-text-main">
                    Showing {getFilterStats().filtered} of {getFilterStats().total} necklaces
                  </h2>
                  {getFilterStats().activeFilters > 0 && (
                    <span className="text-sm text-accent mt-1 inline-block">
                      {getFilterStats().activeFilters} filter{getFilterStats().activeFilters !== 1 ? 's' : ''} applied
                    </span>
                  )}
                </div>
                <button
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-secondary rounded-lg hover:bg-secondary/20 transition-colors"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  aria-label="Open filters"
                >
                  <span aria-hidden>⚙️</span>
                  <span className="font-medium">Filters</span>
                </button>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="text-center py-20 text-text-muted">Loading necklaces...</div>
              ) : error ? (
                <div className="text-center py-20 text-red-600">{error}</div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-text-muted text-lg">No necklaces match your current filters. Try adjusting your search criteria.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts
                      .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                      .map(product => (
                        <ProductCard key={product._id} product={{
                          productId: product.productId,
                          id: product._id,
                          name: product.name,
                          price: product.price,
                          images: product.images || [],
                          image: product.images?.[0] || product.image,
                          inStock: product.inStock,
                          description: product.description,
                        }} />
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
      </section>
    </div>
  );
};

export default Necklaces;