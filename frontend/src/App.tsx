import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, User as UserIcon, LogOut, Sparkles, Plus, Trash2, X, Lock, Mail
} from 'lucide-react';

// Firebase Imports
import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc 
} from 'firebase/firestore';

// Types
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  isNew?: boolean;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id?: string;
  userId: string;
  customerName: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Royal Muslin Saree - Emerald Green',
    category: 'Muslin',
    price: 4500,
    originalPrice: 5500,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    description: 'Authentic handcrafted Bangladeshi Jamdani Muslin Saree.',
    isNew: true
  }
];

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'shop' | 'admin' | 'cart' | 'login' | 'register'>('shop');
  const [loading, setLoading] = useState<boolean>(true);

  // Auth & Form States
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  // Add Product Form States
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdImage, setNewProdImage] = useState('');

  // 1. Firebase Auth Observer & Fetch User Profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch User details from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setCurrentUser(userDocSnap.data() as UserProfile);
        } else {
          setCurrentUser({
            uid: user.uid,
            name: user.displayName || 'User',
            email: user.email || '',
            role: 'customer'
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Fetch Products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList: Product[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));

        setProducts(productsList.length > 0 ? productsList : INITIAL_PRODUCTS);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  // Firebase Register Handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      const user = userCredential.user;

      const newUserProfile: UserProfile = {
        uid: user.uid,
        name: authName,
        email: authEmail,
        role: 'customer'
      };

      // Save user details to Firestore
      await setDoc(doc(db, 'users', user.uid), newUserProfile);
      setCurrentUser(newUserProfile);
      setActiveTab('shop');
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
    } catch (err: any) {
      setAuthError(err.message || 'Failed to register.');
    }
  };

  // Firebase Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, authEmail, authPassword);
      setActiveTab('shop');
      setAuthEmail('');
      setAuthPassword('');
    } catch (err: any) {
      setAuthError('Invalid credentials or user does not exist.');
    }
  };

  // Firebase Logout Handler
  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setActiveTab('shop');
  };

  // Add Product to Firestore (Admin Only)
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        name: newProdName,
        category: newProdCategory,
        price: Number(newProdPrice),
        image: newProdImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c',
        description: 'Handcrafted premium product.'
      };

      const docRef = await addDoc(collection(db, 'products'), productData);
      setProducts(prev => [...prev, { id: docRef.id, ...productData }]);

      setNewProdName('');
      setNewProdCategory('');
      setNewProdPrice('');
      setNewProdImage('');
      alert('Product added successfully!');
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // Delete Product from Firestore (Admin Only)
  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Cart Management
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

  // Place Order to Firestore
  const handleCheckout = async () => {
    if (!currentUser) {
      alert('Please login to place an order.');
      setActiveTab('login');
      return;
    }

    try {
      const orderPayload: Order = {
        userId: currentUser.uid,
        customerName: currentUser.name,
        items: cart,
        totalAmount: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'orders'), orderPayload);
      setCart([]);
      alert('Order placed successfully!');
      setActiveTab('shop');
    } catch (err) {
      console.error("Error creating order:", err);
    }
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
      {/* Top Bar */}
      <div className="bg-amber-900 text-amber-100 text-xs py-2 px-4 text-center">
        ✨ Firebase Firestore Connected | Traditional Artisanal Store
      </div>

      {/* Header Navigation */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => setActiveTab('shop')}>
            <h1 className="text-2xl font-serif font-bold text-amber-900">AFSHEEN</h1>
            <p className="text-[10px] text-amber-600 uppercase tracking-widest">Elegance Redefined</p>
          </div>

          <nav className="flex items-center space-x-6">
            <button 
              onClick={() => setActiveTab('shop')}
              className={`text-sm ${activeTab === 'shop' ? 'font-bold text-amber-900' : 'text-slate-600'}`}
            >
              Shop
            </button>

            {currentUser?.role === 'admin' && (
              <button 
                onClick={() => setActiveTab('admin')}
                className={`text-sm ${activeTab === 'admin' ? 'font-bold text-amber-900' : 'text-slate-600'}`}
              >
                Admin Panel
              </button>
            )}

            <button 
              onClick={() => setActiveTab('cart')} 
              className="relative p-2 text-slate-700"
            >
              <ShoppingBag className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-semibold">
                  {currentUser.name}
                </span>
                <button onClick={handleLogout} className="text-slate-500 hover:text-red-600">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setActiveTab('login')} 
                className="flex items-center space-x-1 text-sm bg-amber-900 text-white px-4 py-2 rounded-md hover:bg-amber-800"
              >
                <UserIcon className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Views */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* SHOP TAB */}
        {activeTab === 'shop' && (
          <div>
            <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6">Our Collection</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl border overflow-hidden shadow-sm flex flex-col justify-between">
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
          </div>
        )}

        {/* LOGIN / REGISTER TAB */}
        {(activeTab === 'login' || activeTab === 'register') && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl border shadow-sm">
            <h2 className="text-2xl font-serif font-bold mb-6 text-center text-amber-900">
              {activeTab === 'login' ? 'Login to Afsheen' : 'Create an Account'}
            </h2>

            {authError && <div className="bg-red-50 text-red-600 text-xs p-3 rounded mb-4">{authError}</div>}

            <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister} className="space-y-4">
              {activeTab === 'register' && (
                <div>
                  <label className="text-xs font-medium text-slate-700">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full border p-2 rounded text-sm mt-1" 
                    value={authName} 
                    onChange={e => setAuthName(e.target.value)} 
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-slate-700">Email Address</label>
                <input 
                  type="email" 
                  required 
                  className="w-full border p-2 rounded text-sm mt-1" 
                  value={authEmail} 
                  onChange={e => setAuthEmail(e.target.value)} 
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Password</label>
                <input 
                  type="password" 
                  required 
                  className="w-full border p-2 rounded text-sm mt-1" 
                  value={authPassword} 
                  onChange={e => setAuthPassword(e.target.value)} 
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
            <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
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
                <button 
                  onClick={handleCheckout} 
                  className="w-full bg-amber-900 text-white py-3 rounded-lg font-semibold hover:bg-amber-800 mt-4"
                >
                  Place Order
                </button>
              </div>
            )}
          </div>
        )}

        {/* ADMIN TAB */}
        {activeTab === 'admin' && currentUser?.role === 'admin' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border shadow-sm max-w-xl">
              <h3 className="font-bold text-lg mb-4">Add New Product to Firestore</h3>
              <form onSubmit={handleAddProduct} className="space-y-3">
                <input 
                  type="text" placeholder="Product Name" required 
                  className="w-full border p-2 text-sm rounded" 
                  value={newProdName} onChange={e => setNewProdName(e.target.value)} 
                />
                <input 
                  type="text" placeholder="Category" required 
                  className="w-full border p-2 text-sm rounded" 
                  value={newProdCategory} onChange={e => setNewProdCategory(e.target.value)} 
                />
                <input 
                  type="number" placeholder="Price (BDT)" required 
                  className="w-full border p-2 text-sm rounded" 
                  value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} 
                />
                <input 
                  type="url" placeholder="Image URL" required 
                  className="w-full border p-2 text-sm rounded" 
                  value={newProdImage} onChange={e => setNewProdImage(e.target.value)} 
                />
                <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-semibold">
                  Add Product
                </button>
              </form>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Manage Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map(p => (
                  <div key={p.id} className="bg-white border p-4 rounded flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">{p.name}</p>
                      <p className="text-xs text-slate-500">৳{p.price}</p>
                    </div>
                    <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
