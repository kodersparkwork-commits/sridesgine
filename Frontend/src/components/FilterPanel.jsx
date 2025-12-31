import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
// Removed legacy CSS import
import { X, Check } from 'lucide-react';

const FilterPanel = ({
  products,
  onFilterChange,
  categories = [],
  selectedCategory = 'all',
  isOpen,
  onToggle
}) => {
  const DEFAULT_PRICE_RANGE = [0, 200000];
  const [filters, setFilters] = useState({
    priceRange: [...DEFAULT_PRICE_RANGE],
    inStock: false,
    sortBy: 'name'
  });

  const [priceRange, setPriceRange] = useState([...DEFAULT_PRICE_RANGE]);

  // Handle category change
  const handleCategoryChange = (cat) => {
    onFilterChange({ ...filters, category: cat });
  };

  useEffect(() => {
    if (products && products.length > 0) {
      const prices = products.map(p => Number(p.price)).filter(p => !isNaN(p));
      if (prices.length > 0) {
        const minPrice = Math.max(0, Math.floor(Math.min(...prices)));
        const maxPrice = Math.min(200000, Math.ceil(Math.max(...prices)));
        const nextRange = [minPrice, Math.max(minPrice, maxPrice)];
        setPriceRange(nextRange);
        setFilters(prev => ({
          ...prev,
          priceRange: nextRange,
        }));
        return;
      }
    }
    // Fallback to defaults when no products
    setPriceRange([...DEFAULT_PRICE_RANGE]);
    setFilters(prev => ({
      ...prev,
      priceRange: [...DEFAULT_PRICE_RANGE],
    }));
  }, [products]);

  const handlePriceChange = (index, value) => {
    const next = Array.isArray(filters.priceRange) ? [...filters.priceRange] : [...priceRange];
    const parsed = Number(value);
    const minAllowed = priceRange[0];
    const maxAllowed = priceRange[1];
    if (Number.isNaN(parsed)) {
      next[index] = index === 0 ? minAllowed : maxAllowed;
    } else {
      next[index] = Math.min(Math.max(parsed, minAllowed), maxAllowed);
    }
    // Keep order valid
    if (index === 0 && next[0] > next[1]) {
      next[1] = next[0];
    } else if (index === 1 && next[1] < next[0]) {
      next[0] = next[1];
    }
    const newFilters = { ...filters, priceRange: next };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStockChange = (value) => {
    const newFilters = { ...filters, inStock: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (value) => {
    const newFilters = { ...filters, sortBy: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      priceRange: [...priceRange],
      inStock: false,
      sortBy: 'name',
      category: 'all',
    };
    setFilters(prev => ({
      ...prev,
      priceRange: [...priceRange],
      inStock: false,
      sortBy: 'name',
    }));
    onFilterChange(resetFilters);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Lock body scroll when the drawer is open on mobile
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen]);

  // Close on Escape key when open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onToggle?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onToggle]);

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const panelContent = (
    <div className={`bg-white h-full flex flex-col ${isMobile ? 'fixed inset-y-0 right-0 w-80 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ' + (isOpen ? 'translate-x-0' : 'translate-x-full') : 'block'}`}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-serif text-lg text-text-main">Filters</h3>
        {!isMobile && (
          <button className="text-sm text-primary hover:underline" onClick={clearFilters}>Clear All</button>
        )}
        {isMobile && (
          <button onClick={onToggle} aria-label="Close filters" className="text-text-muted hover:text-text-main">
            <X size={24} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {categories.length > 0 && (
          <div>
            <h4 className="font-medium text-text-main mb-3">Category</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${selectedCategory === cat ? 'bg-primary text-white border-primary' : 'bg-transparent text-text-muted border-order hover:border-primary'}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="font-medium text-text-main mb-3">Sort By</h4>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full p-2.5 bg-white border border-border rounded-md text-sm focus:outline-none focus:border-primary"
          >
            <option value="name">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        <div>
          <h4 className="font-medium text-text-main mb-3">Price Range</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-text-muted block mb-1">Min</label>
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(0, e.target.value)}
                  min={priceRange[0]}
                  max={priceRange[1]}
                  className="w-full p-2 border border-border rounded text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-text-muted block mb-1">Max</label>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(1, e.target.value)}
                  min={priceRange[0]}
                  max={priceRange[1]}
                  className="w-full p-2 border border-border rounded text-sm"
                />
              </div>
            </div>

            <div className="relative pt-6 pb-2">
              {/* Simplified Range Slider Visual (Semantic HTML range inputs) */}
              <input
                type="range"
                min={priceRange[0]}
                max={priceRange[1]}
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                className="absolute w-full pointer-events-none appearance-none h-1 bg-gray-200 rounded z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                style={{ zIndex: filters.priceRange[0] > (priceRange[1] - priceRange[0]) / 2 ? 20 : 10 }}
              />
              <input
                type="range"
                min={priceRange[0]}
                max={priceRange[1]}
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                className="absolute w-full pointer-events-none appearance-none h-1 bg-transparent rounded z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
              />
            </div>
            <div className="text-center text-sm font-medium text-primary">
              {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-text-main mb-3">Availability</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="availability"
                checked={!filters.inStock}
                onChange={() => handleStockChange(false)}
                className="text-primary focus:ring-primary"
              />
              <span className="text-sm">All Products</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="availability"
                checked={filters.inStock}
                onChange={() => handleStockChange(true)}
                className="text-primary focus:ring-primary"
              />
              <span className="text-sm">In Stock Only</span>
            </label>
          </div>
        </div>
      </div>

      {isMobile && (
        <div className="p-4 border-t border-border bg-gray-50 flex gap-3">
          <button className="flex-1 py-2.5 border border-border rounded text-sm font-medium" onClick={clearFilters}>Clear All</button>
          <button className="flex-1 py-2.5 bg-primary text-white rounded text-sm font-medium" onClick={onToggle}>Apply Filters</button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {!isMobile && panelContent}
      {isMobile && isOpen && typeof document !== 'undefined' && createPortal(
        <>
          <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onToggle} aria-hidden></div>
          {panelContent}
        </>,
        document.body
      )}
    </>
  );
};

export default FilterPanel;
