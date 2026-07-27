import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export default function FeaturedCategories() {
  return (
    <section className="section-padding bg-cream-gradient">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-gold-500 font-cursive text-lg">Explore</span>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-navy-500 mt-1">
            Shop by Category
          </h2>
          <div className="w-20 h-1 bg-gold-gradient mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
          {CATEGORIES.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className={`group relative overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-500 ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div className={`relative ${index === 0 ? 'aspect-square' : 'aspect-[4/5]'} overflow-hidden`}>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-2xl mb-1 block">{category.icon}</span>
                  <h3 className={`font-serif font-bold text-white ${index === 0 ? 'text-xl' : 'text-sm lg:text-base'}`}>
                    {category.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-gold-400 text-xs mt-1 group-hover:gap-2 transition-all">
                    Shop Now <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
