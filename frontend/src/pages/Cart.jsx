import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const {
    cart, removeFromCart, updateQuantity, coupon,
    applyCoupon, removeCoupon, getSubtotal, getDiscount, getShipping, getTotal, getCartCount,
  } = useCart();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode.trim());
      setCouponCode('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-cream-400 mb-4" />
          <h2 className="text-2xl font-serif font-bold text-navy-500 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">Discover our premium collection and add items to your cart.</p>
          <Link to="/products" className="btn-gold inline-flex items-center gap-2">
            Start Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-serif font-bold text-navy-500 mb-8">
          Shopping Cart ({getCartCount()} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.cartId} className="bg-white rounded-xl p-4 lg:p-6 shadow-card flex gap-4">
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-24 h-32 lg:w-32 lg:h-40 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`} className="font-serif font-semibold text-navy-500 hover:text-gold-600 transition line-clamp-2">
                    {item.name}
                  </Link>
                  <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-500">
                    {item.size && <span>Size: <strong>{item.size}</strong></span>}
                    {item.color && <span>Color: <strong>{item.color}</strong></span>}
                  </div>
                  <p className="text-gold-600 font-bold text-lg mt-2">৳{item.price.toLocaleString()}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="w-8 h-8 rounded border border-cream-200 flex items-center justify-center hover:bg-cream-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="w-8 h-8 rounded border border-cream-200 flex items-center justify-center hover:bg-cream-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-navy-500">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-card sticky top-24">
              <h3 className="font-serif font-bold text-navy-500 text-lg mb-4">Order Summary</h3>

              {/* Coupon */}
              <form onSubmit={handleApplyCoupon} className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="Coupon code"
                      className="w-full pl-9 pr-3 py-2.5 border border-cream-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                  <button type="submit" className="btn-outline-gold py-2.5 px-4 text-sm">
                    Apply
                  </button>
                </div>
              </form>

              {coupon && (
                <div className="flex items-center justify-between bg-green-50 text-green-700 px-3 py-2 rounded-lg mb-4 text-sm">
                  <span className="font-medium">{coupon.code} - {coupon.type === 'percent' ? `${coupon.discount}% off` : `৳${coupon.discount} off`}</span>
                  <button onClick={removeCoupon}><X size={14} /></button>
                </div>
              )}

              <div className="space-y-3 text-sm border-t border-cream-100 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getCartCount()} items)</span>
                  <span>৳{getSubtotal().toLocaleString()}</span>
                </div>
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-৳{getDiscount().toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{getShipping() === 0 ? 'Free' : `৳${getShipping()}`}</span>
                </div>
                <div className="flex justify-between font-bold text-navy-500 text-lg border-t border-cream-100 pt-3">
                  <span>Total</span>
                  <span className="text-gold-600">৳{getTotal().toLocaleString()}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-gold w-full mt-6 flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              <Link to="/products" className="block text-center text-gold-600 text-sm mt-3 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
