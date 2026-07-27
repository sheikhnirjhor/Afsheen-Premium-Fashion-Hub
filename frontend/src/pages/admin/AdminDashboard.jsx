import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut,
  TrendingUp, DollarSign, Eye, Edit3, Trash2, Plus, Search, Menu, X, BarChart3
} from 'lucide-react';

const stats = [
  { label: 'Total Revenue', value: '৳12,45,000', change: '+12.5%', icon: DollarSign, color: 'bg-green-100 text-green-600' },
  { label: 'Total Orders', value: '287', change: '+8.2%', icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
  { label: 'Products', value: '156', change: '+3', icon: Package, color: 'bg-purple-100 text-purple-600' },
  { label: 'Customers', value: '1,842', change: '+124', icon: Users, color: 'bg-gold-100 text-gold-600' },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'Fatima Rahman', amount: 85000, status: 'Processing', date: '2026-07-26' },
  { id: 'ORD-002', customer: 'Nusrat Jahan', amount: 45000, status: 'Shipped', date: '2026-07-25' },
  { id: 'ORD-003', customer: 'Sabrina Akter', amount: 28000, status: 'Delivered', date: '2026-07-24' },
  { id: 'ORD-004', customer: 'Maliha Khan', amount: 55000, status: 'Pending', date: '2026-07-24' },
  { id: 'ORD-005', customer: 'Rifat Ahmed', amount: 18000, status: 'Processing', date: '2026-07-23' },
];

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
};

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { label: 'Products', icon: Package, id: 'products' },
  { label: 'Orders', icon: ShoppingCart, id: 'orders' },
  { label: 'Customers', icon: Users, id: 'customers' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-navy-500 text-white transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-cursive text-gold-400">Afsheen</h2>
          <p className="text-xs text-cream-600 mt-1">Admin Dashboard</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  activeTab === item.id ? 'bg-gold-500 text-white' : 'text-cream-600 hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-cream-600 hover:text-white text-sm">
            <LogOut size={18} />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-cream-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-navy-500">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-serif font-bold text-navy-500 capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gold-100 rounded-full flex items-center justify-center">
              <span className="text-gold-700 font-bold text-sm">AD</span>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-white rounded-2xl p-5 shadow-card">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                          <Icon size={20} />
                        </div>
                        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-navy-500">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Chart Placeholder */}
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif font-bold text-navy-500">Revenue Overview</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <BarChart3 size={16} />
                    Last 30 days
                  </div>
                </div>
                <div className="h-64 bg-cream-50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp size={48} className="mx-auto text-gold-300 mb-2" />
                    <p className="text-gray-400 text-sm">Revenue chart visualization</p>
                    <p className="text-xs text-gray-300 mt-1">Integrate with Chart.js or Recharts</p>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="p-6 border-b border-cream-100">
                  <h3 className="font-serif font-bold text-navy-500">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-cream-50">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Order ID</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Customer</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Amount</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Status</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order.id} className="border-t border-cream-100 hover:bg-cream-50 transition">
                          <td className="px-6 py-4 text-sm font-medium text-navy-500">{order.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gold-600">৳{order.amount.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <select
                              defaultValue={order.status}
                              className={`text-xs font-semibold px-3 py-1 rounded-full border-0 ${statusColors[order.status]}`}
                            >
                              {Object.keys(statusColors).map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input className="input-luxury pl-10" placeholder="Search products..." />
                </div>
                <button className="btn-gold flex items-center gap-2">
                  <Plus size={16} /> Add Product
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-cream-50">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Product</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Category</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Price</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Stock</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Royal Red Bridal Lehenga', cat: 'Bridal', price: 85000, stock: 15, img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=60&h=60&fit=crop' },
                        { name: 'Banarasi Silk Saree', cat: 'Saree', price: 28000, stock: 25, img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=60&h=60&fit=crop' },
                        { name: 'Kundan Bridal Jewellery Set', cat: 'Jewellery', price: 18000, stock: 30, img: 'https://images.unsplash.com/photo-1515562141589-67f0d569b34e?w=60&h=60&fit=crop' },
                      ].map((p, i) => (
                        <tr key={i} className="border-t border-cream-100 hover:bg-cream-50 transition">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <img src={p.img} alt="" className="w-10 h-10 rounded-lg object-cover" />
                            <span className="text-sm font-medium text-navy-500">{p.name}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{p.cat}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gold-600">৳{p.price.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {p.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex items-center gap-2">
                            <button className="p-1.5 hover:bg-cream-100 rounded-lg"><Edit3 size={14} className="text-blue-500" /></button>
                            <button className="p-1.5 hover:bg-cream-100 rounded-lg"><Trash2 size={14} className="text-red-500" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-cream-50">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Order ID</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Customer</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Amount</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Status</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Date</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order.id} className="border-t border-cream-100 hover:bg-cream-50 transition">
                          <td className="px-6 py-4 text-sm font-medium text-navy-500">{order.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gold-600">৳{order.amount.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <select defaultValue={order.status}
                              className={`text-xs font-semibold px-3 py-1 rounded-full border-0 ${statusColors[order.status]}`}>
                              {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                          <td className="px-6 py-4">
                            <button className="p-1.5 hover:bg-cream-100 rounded-lg"><Eye size={14} className="text-blue-500" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-2xl shadow-card p-8 text-center">
                <Users size={48} className="mx-auto text-cream-300 mb-4" />
                <h3 className="font-serif font-bold text-navy-500 text-lg">Customer Management</h3>
                <p className="text-gray-500 text-sm mt-1">Customer data will be loaded from Firebase Firestore</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
