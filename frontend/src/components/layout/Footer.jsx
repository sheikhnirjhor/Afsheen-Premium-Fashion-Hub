import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export default function Footer() {
  return (
    <footer className="bg-navy-500 text-white">
      {/* Newsletter Section */}
      <div className="bg-gold-500 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-serif font-bold text-navy-900">Subscribe to Our Newsletter</h3>
            <p className="text-navy-800 text-sm">Get updates on new collections, exclusive offers & styling tips.</p>
          </div>
          <form className="flex w-full md:w-auto" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 md:w-72 px-4 py-3 rounded-l-lg text-navy-500 focus:outline-none text-sm"
            />
            <button className="bg-navy-500 text-white px-6 py-3 rounded-r-lg font-semibold text-sm hover:bg-navy-600 transition">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h2 className="text-2xl font-cursive text-gold-400 mb-4">Afsheen</h2>
          <p className="text-cream-600 text-sm leading-relaxed mb-4">
            Premium Ethnic Fashion, Bridal Wear & Luxury Accessories. Serving customers since 2020 with 229K+ happy followers on Facebook.
          </p>
          <div className="flex gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 transition">
              <Facebook size={16} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 transition">
              <Instagram size={16} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 transition">
              <Youtube size={16} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif font-bold text-lg mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-cream-600">
            <li><Link to="/products" className="hover:text-gold-400 transition">All Products</Link></li>
            <li><Link to="/booking-guidelines" className="hover:text-gold-400 transition">Booking Guidelines</Link></li>
            <li><Link to="/return-policy" className="hover:text-gold-400 transition">Return & Exchange Policy</Link></li>
            <li><Link to="/orders" className="hover:text-gold-400 transition">Track Order</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-serif font-bold text-lg mb-4">Categories</h4>
          <ul className="space-y-2 text-sm text-cream-600">
            {CATEGORIES.slice(0, 6).map(cat => (
              <li key={cat.id}>
                <Link to={`/products?category=${cat.id}`} className="hover:text-gold-400 transition">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-serif font-bold text-lg mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm text-cream-600">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 text-gold-400" />
              <span>Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-gold-400" />
              <span>+880 1XXX-XXXXXX</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-gold-400" />
              <span>info@afsheen.com</span>
            </li>
          </ul>
          <div className="mt-4">
            <h5 className="font-semibold text-sm mb-2">Payment Methods</h5>
            <div className="flex flex-wrap gap-2">
              {['bKash', 'Nagad', 'Visa', 'MC'].map(m => (
                <span key={m} className="px-2 py-1 bg-white/10 rounded text-xs">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center text-xs text-cream-700">
          <p>© 2020-2026 Afsheen Premium Fashion Hub. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Made with <Heart size={12} className="text-red-400 fill-red-400" /> in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
