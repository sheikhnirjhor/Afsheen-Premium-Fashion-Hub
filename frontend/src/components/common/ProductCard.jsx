import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors?.[0] || '', 1);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="card-luxury group-hover:scale-[1.02] transition-all duration-500">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-cream-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount > 0 && (
              <span className="bg-burgundy-600 text-white text-xs font-bold px-2 py-1 rounded">
                -{discount}%
              </span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="bg-gold-500 text-white text-xs font-bold px-2 py-1 rounded">
                Only {product.stock} left!
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
                Sold Out
              </span>
            )}
          </div>
          {/* Hover Actions */}
          <div className="absolute inset-0 bg-navy-500/0 group-hover:bg-navy-500/20 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              onClick={handleQuickAdd}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gold-500 hover:text-white"
            >
              <ShoppingCart size={16} />
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 hover:bg-burgundy-500 hover:text-white">
              <Heart size={16} />
            </button>
          </div>
        </div>
        {/* Info */}
        <div className="p-4">
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(product.rating) ? 'text-gold-500 fill-gold-500' : 'text-gray-300'}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
          </div>
          <h3 className="font-serif font-semibold text-navy-500 text-sm lg:text-base line-clamp-2 group-hover:text-gold-600 transition">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-gold-600">৳{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">৳{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
