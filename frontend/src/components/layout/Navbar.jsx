import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Heart, Phone, LogOut } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export default function Navbar() {
  const { currentUser, userRole, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCategoryOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-navy-500 text-white text-sm py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone size={14} />
              +880 1XXX-XXXXXX
            </span>
            <span>Free Delivery on Orders above ৳10,000</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/booking-guidelines" className="hover:text-gold-300 transition">Booking Guidelines</Link>
            <Link to="/return-policy" className="hover:text-gold-300 transition">Return Policy</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-luxury' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl lg:text-3xl font-cursive text-gold-500">Afsheen</span>
              <span className="hidden sm:block text-xs lg:text-sm text-navy-500 font-light tracking-wider">
                PREMIUM FASHION HUB
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for sarees, lehengas..."
                  className="w-full pl-4 pr-10 py-2.5 border border-cream-600 rounded-full bg-cream-50 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:bg-white transition-all text-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-500 hover:text-gold-600">
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/" className="text-navy-500 hover:text-gold-500 transition font-medium text-sm">
                Home
              </Link>
              
              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center gap-1 text-navy-500 hover:text-gold-500 transition font-medium text-sm"
                >
                  Categories
                  <ChevronDown size={14} className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCategoryOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-card-hover border border-cream-100 py-2 animate-fade-in z-50">
                    {CATEGORIES.map(cat => (
                      <Link
                        key={cat.id}
                        to={`/products?category=${cat.id}`}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-cream-50 transition text-sm text-navy-500"
                        onClick={() => setIsCategoryOpen(false)}
                      >
                        <span>{cat.icon}</span>
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/products" className="text-navy-500 hover:text-gold-500 transition font-medium text-sm">
                All Products
              </Link>

              {/* User Menu */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-navy-500 hover:text-gold-500 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center">
                      <User size={16} className="text-gold-600" />
                    </div>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-card-hover border border-cream-100 py-2 animate-fade-in z-50">
                      <div className="px-4 py-2 border-b border-cream-100">
                        <p className="text-sm font-medium text-navy-500 truncate">{currentUser.email}</p>
                      </div>
                      <Link to="/orders" className="block px-4 py-2.5 text-sm text-navy-500 hover:bg-cream-50" onClick={() => setIsUserMenuOpen(false)}>
                        My Orders
                      </Link>
                      {userRole === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2.5 text-sm text-navy-500 hover:bg-cream-50" onClick={() => setIsUserMenuOpen(false)}>
                          Admin Dashboard
                        </Link>
                      )}
                      {userRole === 'moderator' && (
                        <Link to="/moderator" className="block px-4 py-2.5 text-sm text-navy-500 hover:bg-cream-50" onClick={() => setIsUserMenuOpen(false)}>
                          Moderator Panel
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-navy-500 hover:text-gold-500 transition font-medium text-sm flex items-center gap-1">
                  <User size={18} />
                  Login
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative text-navy-500 hover:text-gold-500 transition">
                <ShoppingCart size={22} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold-500 text-white rounded-full text-xs flex items-center justify-center font-bold animate-pulse-gold">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 lg:hidden">
              <Link to="/cart" className="relative text-navy-500">
                <ShoppingCart size={22} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                    {getCartCount()}
                  </span>
                )}
              </Link>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-navy-500">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-cream-100 bg-white animate-slide-up">
            <div className="px-4 py-4">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-4 pr-10 py-2.5 border border-cream-600 rounded-full bg-cream-50 focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-500">
                    <Search size={18} />
                  </button>
                </div>
              </form>

              <div className="space-y-1">
                <Link to="/" className="block py-2.5 text-navy-500 font-medium">Home</Link>
                <Link to="/products" className="block py-2.5 text-navy-500 font-medium">All Products</Link>
                {CATEGORIES.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.id}`}
                    className="block py-2 text-sm text-navy-500/70 pl-4"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                ))}
                <hr className="my-2 border-cream-200" />
                {currentUser ? (
                  <>
                    <Link to="/orders" className="block py-2.5 text-navy-500 font-medium">My Orders</Link>
                    <button onClick={handleLogout} className="block py-2.5 text-red-500 font-medium w-full text-left">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="block py-2.5 text-navy-500 font-medium">Login / Register</Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
