import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, User as UserIcon, LogOut, Sparkles, Trash2, AlertCircle 
} from 'lucide-react';

// Data Types
export interface Product {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

const BACKEND_URL = 'http://localhost:5000/api';

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'shop' | 'admin' | 'cart' | 'login' | 'register'>('shop');
  const [loading, setLoading] = useState<boolean>(true);

  // Auth Form States
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  // Admin Add Product Form States
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdImage, setNewProdImage] = useState('');

  // 1. Initial Load: Read stored Token and Fetch Products from Node.js Backend
  useEffect(() => {
    const savedToken = localStorage.getItem('afsheen_token');
    const savedUser = localStorage.getItem('afsheen_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
    }

    fetchProducts();
  }, []);

  // API Call: Fetch Products from Backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Backend connection error:', error);
    } finally {
      setLoading(false);
    }
  };

  // API Call: Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and user info
      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('afsheen_token', data.token);
      localStorage.setItem('afsheen_user', JSON.stringify(data.user));

      setActiveTab('shop');
      setAuthEmail('');
      setAuthPassword('');
    } catch (err: any) {
      setAuthError(err.message || 'Backend authentication error.');
    }
  };

  // API Call: Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: authName, email: authEmail, password: authPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Auto-login after registration
      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('afsheen_token', data.token);
      localStorage.setItem('afsheen_user', JSON.stringify(data.user));

      setActiveTab('shop');
      setAuthName('');
      setAuthEmail('');
      setAuthPassword('');
    } catch (err: any) {
      setAuthError(err.message || 'Failed to create account.');
    }
  };

  // Logout Handler
  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('afsheen_token');
    localStorage.removeItem('afsheen_user');
    setActiveTab('shop');
  };

  // API Call: Add Product (Admin)
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productPayload = {
        name: newProdName,
        category: newProdCategory,
        price: Number(newProdPrice),
        image: newProdImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c'
      };

      const res = await fetch(`${BACKEND_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productPayload)
      });

      if (res.ok) {
        alert('Product added successfully to database!');
        setNewProdName('');
        setNewProdCategory('');
        setNewProdPrice('');
        setNewProdImage('');
        fetchProducts(); // Refresh product list
      } else {
        alert('Failed to add product.');
      }
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  // Cart Handler
  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const pId = product._id || product.id;
      const existing = prevCart.find(item => (item.product._id || item.product.id) === pId);
      if (existing) {
        return prevCart.map(item =>
          (item.product._id || item.product.id) === pId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <Sparkles className="w-8 h-8 text-amber-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header Navigation */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <h1 className="text-2xl font-serif font-bold text-amber-900 cursor-pointer" onClick={() => setActiveTab('shop')}>
            AFSHEEN
          </h1>

          <nav className="flex items-center space-x-6">
            <button onClick={() => setActiveTab('shop')} className={`text-sm font-medium ${activeTab === 'shop' ? 'text-amber-900 font-bold' : ''}`}>
              Shop
            </button>

            {currentUser?.role === 'admin' && (
              <button onClick={() => setActiveTab('admin')} className={`text-sm font-medium ${activeTab === 'admin' ? 'text-amber-900 font-bold' : ''}`}>
                Admin Panel
              </button>
            )}

            <button onClick={() => setActiveTab('cart')} className="relative p-2 text-slate-700">
              <ShoppingBag className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">{currentUser.name}</span>
                <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 p-1">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => setActiveTab('login')} className="flex items-center space-x-1 text-sm bg-amber-900 text-white px-4 py-2 rounded-md">
                <UserIcon className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main View Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* SHOP TAB */}
        {activeTab === 'shop' && (
          <div>
            <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6">Our Collection</h3>
            {products.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <p>No products found in the database. Add products from Admin panel.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product._id || product.id} className="bg-white rounded-xl border overflow-hidden shadow-sm flex flex-col justify-between">
                    <div>
                      <img src={product.image} alt={product.name} className="w-full aspect-[3/4] object-cover" />
                      <div className="p-4">
                        <span className="text-xs text-amber-700 uppercase font-semibold">{product.category}</span>
                        <h4 className="font-semibold text-slate-900 mt-1">{product.name}</h4>
                        <p className="text-lg font-bold text-slate-900 mt-2">৳{product.price}</p>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-slate-900 hover:bg-amber-900 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LOGIN / REGISTER TAB */}
        {(activeTab === 'login' || activeTab === 'register') && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl border shadow-sm">
            <h2 className="text-2xl font-serif font-bold mb-6 text-center text-amber-900">
              {activeTab === 'login' ? 'Login' : 'Create Account'}
            </h2>

            {authError && <div className="bg-red-50 text-red-600 text-xs p-3 rounded mb-4">{authError}</div>}

            <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister} className="space-y-4">
              {activeTab === 'register' && (
                <div>
                  <label className="text-xs font-medium text-slate-700">Full Name</label>
                  <input 
                    type="text" required className="w-full border p-2 rounded text-sm mt-1"
                    value={authName} onChange={e => setAuthName(e.target.value)} 
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-slate-700">Email Address</label>
                <input 
                  type="email" required className="w-full border p-2 rounded text-sm mt-1"
                  value={authEmail} onChange={e => setAuthEmail(e.target.value)} 
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Password</label>
                <input 
                  type="password" required className="w-full border p-2 rounded text-sm mt-1"
                  value={authPassword} onChange={e => setAuthPassword(e.target.value)} 
                />
              </div>

              <button type="submit" className="w-full bg-amber-900 text-white py-2.5 rounded font-medium text-sm hover:bg-amber-800">
                {activeTab === 'login' ? 'Sign In' : 'Register'}
              </button>
            </form>

            <div className="mt-4 text-center text-xs text-slate-600">
              {activeTab === 'login' ? (
                <p>Don't have an account? <button onClick={() => setActiveTab('register')} className="text-amber-900 font-bold underline">Register</button></p>
              ) : (
                <p>Already have an account? <button onClick={() => setActiveTab('login')} className="text-amber-900 font-bold underline">Login</button></p>
              )}
            </div>
          </div>
        )}

        {/* CART TAB */}
        {activeTab === 'cart' && (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
            {cart.length === 0 ? (
              <p className="text-slate-500 text-center py-6">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <h4 className="font-semibold text-sm">{item.product.name}</h4>
                      <p className="text-xs text-slate-500">Qty: {item.quantity} x ৳{item.product.price}</p>
                    </div>
                    <p className="font-bold text-sm">৳{item.product.price * item.quantity}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-amber-900">
                    ৳{cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ADMIN TAB */}
        {activeTab === 'admin' && currentUser?.role === 'admin' && (
          <div className="max-w-md mx-auto bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h3 className="font-bold text-lg">Add New Product to Database</h3>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <input type="text" placeholder="Product Name" required className="w-full border p-2 text-sm rounded" value={newProdName} onChange={e => setNewProdName(e.target.value)} />
              <input type="text" placeholder="Category" required className="w-full border p-2 text-sm rounded" value={newProdCategory} onChange={e => setNewProdCategory(e.target.value)} />
              <input type="number" placeholder="Price (BDT)" required className="w-full border p-2 text-sm rounded" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} />
              <input type="url" placeholder="Image URL" required className="w-full border p-2 text-sm rounded" value={newProdImage} onChange={e => setNewProdImage(e.target.value)} />
              <button type="submit" className="w-full bg-slate-900 text-white py-2.5 rounded text-sm font-semibold">
                Save Product
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
