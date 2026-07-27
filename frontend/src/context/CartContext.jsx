import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('afsheen_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem('afsheen_cart', JSON.stringify(cart));
  }, [cart]);

  function addToCart(product, size, color, quantity = 1) {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === product.id && item.size === size && item.color === color
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        toast.success('Cart updated!');
        return updated;
      }
      toast.success('Added to cart!');
      return [...prev, { ...product, size, color, quantity, cartId: Date.now() }];
    });
  }

  function removeFromCart(cartId) {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
    toast.success('Removed from cart');
  }

  function updateQuantity(cartId, quantity) {
    if (quantity < 1) return removeFromCart(cartId);
    setCart(prev =>
      prev.map(item =>
        item.cartId === cartId ? { ...item, quantity } : item
      )
    );
  }

  function clearCart() {
    setCart([]);
    setCoupon(null);
  }

  function applyCoupon(code) {
    const validCoupons = {
      'AFSHEEN20': { discount: 20, type: 'percent', maxDiscount: 5000, minOrder: 5000 },
      'WELCOME10': { discount: 10, type: 'percent', maxDiscount: 3000, minOrder: 2000 },
      'FLAT2000': { discount: 2000, type: 'fixed', minOrder: 10000 },
      'BRIDAL15': { discount: 15, type: 'percent', maxDiscount: 10000, minOrder: 30000 },
    };

    const upperCode = code.toUpperCase();
    if (validCoupons[upperCode]) {
      const couponData = validCoupons[upperCode];
      const subtotal = getSubtotal();
      if (subtotal < couponData.minOrder) {
        toast.error(`Minimum order of ৳${couponData.minOrder.toLocaleString()} required`);
        return false;
      }
      setCoupon({ code: upperCode, ...couponData });
      toast.success('Coupon applied successfully!');
      return true;
    }
    toast.error('Invalid coupon code');
    return false;
  }

  function removeCoupon() {
    setCoupon(null);
    toast.success('Coupon removed');
  }

  function getSubtotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function getDiscount() {
    if (!coupon) return 0;
    if (coupon.type === 'percent') {
      const discount = getSubtotal() * (coupon.discount / 100);
      return Math.min(discount, coupon.maxDiscount || Infinity);
    }
    return coupon.discount;
  }

  function getShipping() {
    return getSubtotal() >= 10000 ? 0 : 150;
  }

  function getTotal() {
    return getSubtotal() - getDiscount() + getShipping();
  }

  function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  const value = {
    cart,
    coupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getShipping,
    getTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
