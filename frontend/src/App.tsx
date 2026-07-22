import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Heart, Search, User as UserIcon, LogOut, ShieldCheck, 
  Sparkles, Star, Plus, Trash2, Edit3, CheckCircle, Package, ArrowRight, X, Phone, MapPin, Truck 
} from 'lucide-react';

// Import Firebase Firestore modules
import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

// Data Types
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  rating: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  userName: string;
  comment: string;
  rating: number;
  date: string;
}

// Initial Fallback Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Royal Muslin Saree - Emerald Green',
    category: 'Muslin',
    price: 4500,
    originalPrice: 5500,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    description: 'Authentic handcrafted Bangladeshi Jamdani Muslin Saree with pure zari weaving.',
    rating: 4.9,
    isNew: true,
    isBestSeller: true
  }
];

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'shop' | 'admin' | 'cart' | 'checkout' | 'login'>('shop');
  const [loading, setLoading] = useState<boolean>(true);

  // Firestore Fetch Data Effect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Products
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
        setProducts(productsData.length > 0 ? productsData : INITIAL_PRODUCTS);

        // Fetch Users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
        setUsers(usersData);

        // Fetch Orders
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
        setOrders(ordersData);

        // Fetch Reviews
        const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
        const reviewsData = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[];
        setReviews(reviewsData);

      } catch (error) {
        console.error("Firestore Error: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Check Local Storage for active user session & cart
    const storedSession = localStorage.getItem('afsheen_session');
    if (storedSession) setCurrentUser(JSON.parse(storedSession));

    const storedCart = localStorage.getItem('afsheen_cart');
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  // Save Cart to Local Storage
  useEffect(() => {
    localStorage.setItem('afsheen_cart', JSON.stringify(cart));
  }, [cart]);

  // Firestore Handlers
  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleCreateOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    try {
      const newOrderPayload = {
        ...orderData,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'orders'), newOrderPayload);
      const createdOrder = { ...newOrderPayload, id: docRef.id } as Order;

      setOrders(prev => [createdOrder, ...prev]);
      setCart([]);
      alert("Order placed successfully!");
      setActiveTab('shop');
    } catch (error) {
      console.error("Error creating order: ", error);
      alert("Failed to place order. Try again.");
    }
  };

  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'products'), newProduct);
      const createdProduct = { ...newProduct, id: docRef.id };
      setProducts(prev => [...prev, createdProduct]);
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('afsheen_session');
    setActiveTab('shop');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <Sparkles className="w-10 h-10 text-amber-600 animate-spin mx-auto mb-2" />
          <p className="text-amber-900 font-medium">Afsheen Crafting Experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Top Banner */}
      <div className="bg-amber-900 text-amber-100 text-xs py-2 px-4 text-center tracking-wide">
        ✨ Traditional Elegance Delivered To Your Doorstep | Free Delivery on Orders Over ৳3000
      </div>

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => setActiveTab('shop')}>
            <h1 className="text-2xl font-serif font-bold text-amber-900 tracking-wider">AFSHEEN</h1>
            <p className="text-[10px] tracking-widest text-amber-600 uppercase">Elegance Redefined</p>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <button 
              onClick={() => setActiveTab('shop')} 
              className={`text-sm font-medium transition-colors ${activeTab === 'shop' ? 'text-amber-800 font-bold' : 'text-slate-600 hover:text-amber-800'}`}
            >
              Shop
            </button>
            
            {currentUser?.role === 'admin' && (
              <button 
                onClick={() => setActiveTab('admin')} 
                className={`text-sm font-medium transition-colors ${activeTab === 'admin' ? 'text-amber-800 font-bold' : 'text-slate-600 hover:text-amber-800'}`}
              >
                Admin Panel
              </button>
            )}

            {/* Cart Icon */}
            <button 
              onClick={() => setActiveTab('cart')} 
              className="relative p-2 text-slate-700 hover:text-amber-800 transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* Profile / Auth Button */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
                  {currentUser.name}
                </span>
                <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 p-1">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setActiveTab('login')} 
                className="flex items-center space-x-1 text-sm bg-amber-900 text-white px-4 py-2 rounded-md hover:bg-amber-800 transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'shop' && (
          <div>
            {/* Hero Section */}
            <div className="relative rounded-2xl overflow-hidden mb-12 bg-amber-950 text-white p-8 md:p-16 flex flex-col justify-center">
              <div className="relative z-10 max-w-xl">
                <span className="text-amber-400 font-semibold tracking-widest text-xs uppercase mb-2 block">New Collection 2026</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">Handcrafted Tradition & Culture</h2>
                <p className="text-amber-100 text-sm md:text-base mb-6">Discover Bangladesh's finest Muslin, Jamdani, and Heritage sarees crafted by master artisans.</p>
              </div>
            </div>

            {/* Products Grid */}
            <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6">Featured Sarees</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    {product.isNew && (
                      <span className="absolute top-3 left-3 bg-amber-800 text-white text-[10px] font-bold px-2 py-1 rounded">NEW</span>
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-amber-700 font-medium uppercase tracking-wider">{product.category}</span>
                    <h4 className="font-medium text-slate-900 mt-1 line-clamp-1">{product.name}</h4>
                    <div className="mt-2 flex items-baseline space-x-2">
                      <span className="text-lg font-bold text-slate-900">৳{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">৳{product.originalPrice}</span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full mt-4 bg-slate-900 hover:bg-amber-900 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-2xl font-serif font-bold mb-6">Your Shopping Cart</h2>
            {cart.length === 0 ? (
              <p className="text-slate-500 py-8 text-center">Your cart is currently empty.</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <h4 className="font-semibold text-sm">{item.product.name}</h4>
                        <p className="text-xs text-slate-500">Qty: {item.quantity} x ৳{item.product.price}</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm">৳{item.product.price * item.quantity}</span>
                  </div>
                ))}
                <div className="pt-4 flex justify-between items-center text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-amber-900">
                    ৳{cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)}
                  </span>
                </div>
                <button 
                  onClick={() => setActiveTab('checkout')}
                  className="w-full mt-6 bg-amber-900 text-white py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
