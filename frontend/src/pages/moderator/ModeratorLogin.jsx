import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Headphones, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function ModeratorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (email === 'mod@afsheen.com' && password === 'mod123') {
        toast.success('Welcome, Moderator!');
        navigate('/moderator/dashboard');
      } else {
        toast.error('Invalid moderator credentials');
      }
    } catch (error) {
      toast.error('Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-navy-500 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Headphones size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white mt-2">Moderator Portal</h1>
          <p className="text-cream-600 text-sm mt-1">Customer Support Dashboard</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-500 mb-1">Moderator Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="input-luxury pl-10" placeholder="mod@afsheen.com" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-500 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-luxury pl-10 pr-10" placeholder="Enter password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50">
              <LogIn size={18} />
              {loading ? 'Signing in...' : 'Moderator Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-gold-600 hover:text-gold-700">← Back to Customer Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
