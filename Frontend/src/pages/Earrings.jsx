import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';
import { useProductFilters } from '../hooks/useProductFilters';
import Pagination from '../components/Pagination';

import SubcategoryCircles from '../components/SubcategoryCircles';

const Earrings = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  const {
    filteredProducts,
    handleFilterChange,
    getFilterStats,
  } = useProductFilters(products);

  useEffect(() => {
    fetchEarrings();
  }, [subCategory]);

  // Reset pagination when filters or subcategory change
  useEffect(() => { setCurrentPage(1); }, [subCategory, filteredProducts]);

  const fetchEarrings = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const url = new URL(`${baseUrl}/products`);
      url.searchParams.set('category', 'earrings');
      if (subCategory) url.searchParams.set('subCategory', subCategory);
      const response = await fetch(url.toString());

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      } else {
        throw new Error('Failed to fetch earrings');
      }
    } catch (err) {
      console.error('Error fetching earrings:', err);
      setError('Failed to load earrings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-page">
      {/* Page Header */}
      <section className="category-header">
        <div className="container">
          <h1 className="category-title">Earrings Collection</h1>
          <p className="category-description">
            Discover our exquisite collection of earrings, from elegant studs to statement chandeliers.
            Each piece is crafted with precision and designed to complement your unique style.
          </p>
        </div>
      </section>

      {/* Subcategories Circles below banner */}
      <div className="container">
        <SubcategoryCircles
          value={subCategory}
          onChange={setSubCategory}
          items={[
            { value: '', label: 'ALL', image: 'https://res.cloudinary.com/dm94ctges/image/upload/v1761929961/-473Wx593H-466687266-gold-MODEL_iotjwu.jpg' },
            { value: 'victorian', label: 'Victorian', image: 'https://res.cloudinary.com/dm94ctges/image/upload/v1761822776/IMG-0411_copy_2_ttq0xk.jpg' },
            { value: 'cz-stone', label: 'CZ STONE', image: 'https://res.cloudinary.com/dm94ctges/image/upload/v1761929967/zircon-earring-green-victorian-zircon-earring-188620-1186901157_nd93ef.jpg' },
            { value: 'beeds', label: 'FASHION', image: 'https://res.cloudinary.com/dm94ctges/image/upload/v1761929966/zircon-earring-green-rose-gold-zircon-earring-157705-37668658315420_vyewth.jpg' },
            { value: 'gold-plated', label: 'GOLD PLATED', image: 'https://res.cloudinary.com/dm94ctges/image/upload/v1761929967/zircon-earring-green-victorian-zircon-earring-188620-1186901157_nd93ef.jpg' },
          ]}
        />
      </div>

      {/* Products Section with Filters */}
      <section className="category-products">
        <div className="container">
          <div className="products-layout">
            {/* Filter Sidebar */}
            <aside className="filters-sidebar">
              <FilterPanel
                products={products}
                onFilterChange={handleFilterChange}
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
              />
            </aside>

            {/* Products Grid */}
            <main className="products-main">
              {/* Subcategory chips replaced by circles (above) */}

              {/* Results Header */}
              <div className="results-header">
                <div className="results-info" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <h2 style={{ margin: 0 }}>Showing {getFilterStats().filtered} of {getFilterStats().total} earrings</h2>
                    {getFilterStats().activeFilters > 0 && (
                      <span className="active-filters">
                        {getFilterStats().activeFilters} filter{getFilterStats().activeFilters !== 1 ? 's' : ''} applied
                      </span>
                    )}
                  </div>
                  <button
                    className="filter-toggle-btn"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    aria-label="Open filters"
                  >
                    <span className="filter-icon" aria-hidden>⚙️</span>
                    <span>Filters</span>
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="loading-message">Loading earrings...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : filteredProducts.length === 0 ? (
                <div className="no-products">
                  <p>No earrings match your current filters. Try adjusting your search criteria.</p>
                </div>
              ) : (
                <>
                  <div className="products-grid">
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
                  <Pagination
                    currentPage={currentPage}
                    totalItems={filteredProducts.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Earrings;