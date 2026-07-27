import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../common/ProductCard';
import { SAMPLE_PRODUCTS } from '../../data/products';

export default function FeaturedProducts() {
  const featured = SAMPLE_PRODUCTS.filter(p => p.featured).slice(0, 8);

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
          <div>
            <span className="text-gold-500 font-cursive text-lg">Curated for You</span>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-navy-500 mt-1">
              Featured Collection
            </h2>
            <div className="w-20 h-1 bg-gold-gradient mt-4 rounded-full" />
          </div>
          <Link
            to="/products"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-gold-600 font-semibold hover:text-gold-700 transition group"
          >
            View All Products
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
