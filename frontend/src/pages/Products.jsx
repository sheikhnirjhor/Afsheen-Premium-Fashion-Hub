import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutGrid } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { SAMPLE_PRODUCTS } from '../data/products';
import { CATEGORIES, SIZES } from '../data/categories';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [gridSize, setGridSize] = useState(4);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const categoryFilter = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  const category = CATEGORIES.find(c => c.id === categoryFilter);

  const filteredProducts = useMemo(() => {
    let products = [...SAMPLE_PRODUCTS];

    if (categoryFilter) {
      products = products.filter(p => p.category === categoryFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      products = products.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    products = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (selectedSizes.length > 0) {
      products = products.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    }

    if (inStockOnly) {
      products = products.filter(p => p.stock > 0);
    }

    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        products.reverse();
        break;
      default:
        products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return products;
  }, [categoryFilter, searchQuery, sortBy, priceRange, selectedSizes, inStockOnly]);

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 200000]);
    setSelectedSizes([]);
    setInStockOnly(false);
    setSearchParams({});
  };

  return (
    <div className="bg-cream-50 min-h-screen">
      {/* Header */}
      <div className="bg-navy-500 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-white">
            {category ? category.name : searchQuery ? `Search: "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-cream-500 mt-2">
            {filteredProducts.length} products found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl p-6 shadow-card sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif font-bold text-navy-500">Filters</h3>
                <button onClick={clearFilters} className="text-xs text-gold-600 hover:text-gold-700">
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-sm text-navy-500 mb-3">Category</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => setSearchParams({})}
                    className={`block w-full text-left text-sm py-1.5 px-2 rounded transition ${
                      !categoryFilter ? 'bg-gold-100 text-gold-700 font-medium' : 'text-gray-600 hover:bg-cream-50'
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSearchParams({ category: cat.id })}
                      className={`block w-full text-left text-sm py-1.5 px-2 rounded transition ${
                        categoryFilter === cat.id
                          ? 'bg-gold-100 text-gold-700 font-medium'
                          : 'text-gray-600 hover:bg-cream-50'
                      }`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold text-sm text-navy-500 mb-3">
                  Price Range: ৳{priceRange[0].toLocaleString()} - ৳{priceRange[1].toLocaleString()}
                </h4>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-gold-500"
                />
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <h4 className="font-semibold text-sm text-navy-500 mb-3">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        selectedSizes.includes(size)
                          ? 'bg-gold-500 text-white'
                          : 'bg-cream-100 text-navy-500 hover:bg-gold-100'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-gold-500 rounded"
                  />
                  <span className="text-sm text-navy-500">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-card">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-1 text-sm text-navy-500 hover:text-gold-600"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                </button>
                <span className="text-sm text-gray-500 hidden sm:inline">
                  {filteredProducts.length} products
                </span>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="text-sm border border-cream-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>

                <div className="hidden sm:flex items-center gap-1">
                  <button
                    onClick={() => setGridSize(3)}
                    className={`p-1.5 rounded ${gridSize === 3 ? 'bg-gold-100 text-gold-600' : 'text-gray-400'}`}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setGridSize(4)}
                    className={`p-1.5 rounded ${gridSize === 4 ? 'bg-gold-100 text-gold-600' : 'text-gray-400'}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedSizes.length > 0 || inStockOnly) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedSizes.map(size => (
                  <span key={size} className="flex items-center gap-1 bg-gold-100 text-gold-700 px-3 py-1 rounded-full text-xs font-medium">
                    Size: {size}
                    <button onClick={() => toggleSize(size)}><X size={12} /></button>
                  </span>
                ))}
                {inStockOnly && (
                  <span className="flex items-center gap-1 bg-gold-100 text-gold-700 px-3 py-1 rounded-full text-xs font-medium">
                    In Stock Only
                    <button onClick={() => setInStockOnly(false)}><X size={12} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className={`grid grid-cols-2 ${gridSize === 3 ? 'md:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'} gap-4 lg:gap-6`}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg mb-4">No products found matching your criteria.</p>
                <button onClick={clearFilters} className="btn-gold">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
