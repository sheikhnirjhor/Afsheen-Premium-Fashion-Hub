import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Truck, ShieldCheck, RotateCcw, Minus, Plus, ChevronRight, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { SAMPLE_PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import ProductCard from '../components/common/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = SAMPLE_PRODUCTS.find(p => p.id === id);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-navy-500 mb-4">Product Not Found</h2>
          <Link to="/products" className="btn-gold">Browse Products</Link>
        </div>
      </div>
    );
  }

  const category = CATEGORIES.find(c => c.id === product.category);
  const relatedProducts = SAMPLE_PRODUCTS.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, selectedSize, selectedColor || product.colors?.[0] || '', quantity);
  };

  return (
    <div className="bg-cream-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-cream-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gold-600 flex items-center gap-1"><Home size={14} /> Home</Link>
            <ChevronRight size={14} />
            <Link to="/products" className="hover:text-gold-600">Products</Link>
            <ChevronRight size={14} />
            {category && (
              <>
                <Link to={`/products?category=${category.id}`} className="hover:text-gold-600">{category.name}</Link>
                <ChevronRight size={14} />
              </>
            )}
            <span className="text-navy-500 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-card">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full aspect-[3/4] object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      i === activeImage ? 'border-gold-500' : 'border-cream-200'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.tags?.slice(0, 2).map(tag => (
                <span key={tag} className="badge-gold text-xs capitalize">{tag}</span>
              ))}
            </div>

            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-navy-500 mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating) ? 'text-gold-500 fill-gold-500' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-gold-600">৳{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">৳{product.originalPrice.toLocaleString()}</span>
                  <span className="bg-burgundy-100 text-burgundy-700 px-2 py-0.5 rounded text-sm font-semibold">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-navy-500 mb-3">Color: <span className="text-gold-600">{selectedColor || product.colors[0]}</span></h3>
                <div className="flex gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${
                        (selectedColor || product.colors[0]) === color
                          ? 'border-gold-500 bg-gold-50 text-gold-700'
                          : 'border-cream-200 text-gray-600 hover:border-gold-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div className="mb-6">
              <h3 className="font-semibold text-navy-500 mb-3">Size {selectedSize && `- ${selectedSize}`}</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition ${
                      selectedSize === size
                        ? 'border-gold-500 bg-gold-500 text-white'
                        : 'border-cream-200 text-navy-500 hover:border-gold-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-semibold text-navy-500 mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-cream-200 flex items-center justify-center hover:bg-cream-50 transition"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-cream-200 flex items-center justify-center hover:bg-cream-50 transition"
                >
                  <Plus size={16} />
                </button>
                <span className="text-sm text-gray-500 ml-2">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 btn-gold flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button className="w-14 h-14 border-2 border-cream-200 rounded-lg flex items-center justify-center hover:bg-burgundy-50 hover:border-burgundy-300 transition">
                <Heart size={22} className="text-gray-400 hover:text-burgundy-500" />
              </button>
            </div>

            {/* Trust Info */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-xl border border-cream-100">
              <div className="text-center">
                <Truck size={20} className="mx-auto text-gold-500 mb-1" />
                <p className="text-xs text-gray-500">Free Delivery</p>
              </div>
              <div className="text-center">
                <ShieldCheck size={20} className="mx-auto text-gold-500 mb-1" />
                <p className="text-xs text-gray-500">Secure Payment</p>
              </div>
              <div className="text-center">
                <RotateCcw size={20} className="mx-auto text-gold-500 mb-1" />
                <p className="text-xs text-gray-500">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-serif font-bold text-navy-500 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
