import React, { useState, useEffect } from 'react';
import { Product, User, Order, Review, CartItem } from './types';
import { HomeView } from './components/HomeView';
import { ShopView } from './components/ShopView';
import { ProductDetailsView } from './components/ProductDetailsView';
import { CartView } from './components/CartView';
import { CustomerDashboardView, AdminDashboardView } from './components/Dashboards';
import { AboutView, ContactView } from './components/AboutAndContact';
import { AuthView } from './components/AuthView';
import { ShoppingBag, User as UserIcon, Shield, Menu, X, Facebook, Instagram, Twitter, Sparkles } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Fetch Data from Express Backend
  useEffect(() => {
    // 1. Fetch Products
    fetch(`${API_BASE_URL}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err));

    // 2. Fetch Orders
    fetch(`${API_BASE_URL}/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error('Error fetching orders:', err));

    // Cart local storage persistent
    const storedCart = localStorage.getItem('afsheen_cart');
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  const saveCartToStorage = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem('afsheen_cart', JSON.stringify(updated));
  };

  // Cart Operations
  const handleAddToCart = (product: Product, quantity: number, selectedSize?: string) => {
    const updated = [...cart];
    const matchIdx = updated.findIndex(
      (item) => item.product.id === product.id && item.selectedSize === selectedSize
    );
    if (matchIdx > -1) {
      updated[matchIdx].quantity = Math.min(product.stock, updated[matchIdx].quantity + quantity);
    } else {
      updated.push({ product, quantity, selectedSize });
    }
    saveCartToStorage(updated);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number, selectedSize?: string) => {
    const updated = cart
      .map((item) => {
        if (item.product.id === productId && item.selectedSize === selectedSize) {
          return { ...item, quantity: Math.min(item.product.stock, Math.max(1, quantity)) };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    saveCartToStorage(updated);
  };

  const handleRemoveFromCart = (productId: string, selectedSize?: string) => {
    const updated = cart.filter(
      (item) => !(item.product.id === productId && item.selectedSize === selectedSize)
    );
    saveCartToStorage(updated);
  };

  // API Call: Create Order
  const handleCheckout = async (details: {
    address: string;
    phone: string;
    giftWrapped: boolean;
    discountPercent: number;
  }) => {
    const sub = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const disc = (sub * details.discountPercent) / 100;
    const wrap = details.giftWrapped ? 500 : 0;
    const tax = (sub - disc) * 0.08;
    const finalTotal = sub - disc + wrap + tax;

    const orderPayload = {
      customerEmail: currentUser?.email || 'guest@example.com',
      customerName: currentUser?.name || 'Atelier Guest',
      items: cart,
      total: finalTotal,
      deliveryAddress: details.address,
      deliveryPhone: details.phone,
      giftWrapped: details.giftWrapped,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const createdOrder = await res.json();
      setOrders([createdOrder, ...orders]);
      saveCartToStorage([]); // Clear cart
    } catch (err) {
      console.error('Checkout failed:', err);
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-[#fdfbf7] text-[#1a1a1a] flex flex-col justify-between">
      {/* STICKY NAVBAR */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-[#FAF6F0] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div onClick={() => setCurrentPage('home')} className="cursor-pointer">
            <h1 className="font-serif text-2xl font-bold tracking-widest uppercase">AFSHEEN</h1>
            <p className="text-[9px] font-semibold text-[#b49466] tracking-[0.25em] uppercase font-mono">
              BY SHEIKH
            </p>
          </div>

          <nav className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-neutral-600">
            {['Home', 'Shop', 'About', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => setCurrentPage(item.toLowerCase())}
                className="hover:text-[#b49466] transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <button
              onClick={() => setCurrentPage('cart')}
              className="p-2 relative hover:bg-[#FAF6F0] rounded-full"
            >
              <ShoppingBag className="w-5 h-5 text-neutral-700" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1a1a1a] text-[#c5a880] rounded-full w-4 h-4 text-[9px] font-bold flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN VIEW ROUTING */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <HomeView
            products={products}
            onNavigate={setCurrentPage}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setCurrentPage('shop');
            }}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setCurrentPage('product-details');
            }}
          />
        )}
        {currentPage === 'shop' && (
          <ShopView
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setCurrentPage('product-details');
            }}
            onQuickAdd={(p) => handleAddToCart(p, 1)}
          />
        )}
        {currentPage === 'cart' && (
          <CartView
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            currentUser={currentUser}
            onCheckout={handleCheckout}
            onNavigate={setCurrentPage}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#1a1a1a] text-[#c5a880] py-12 text-center text-xs">
        <p>© 2026 Afsheen by Sheikh Atelier. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
