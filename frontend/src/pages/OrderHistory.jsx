import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, ChevronRight, Home } from 'lucide-react';

const sampleOrders = [
  {
    id: 'ORD-2026-001',
    date: '2026-07-20',
    items: [
      { name: 'Royal Red Bridal Lehenga', qty: 1, price: 85000, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=100&h=100&fit=crop' },
      { name: 'Kundan Bridal Jewellery Set', qty: 1, price: 18000, image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b34e?w=100&h=100&fit=crop' },
    ],
    total: 103000,
    status: 'Shipped',
    payment: 'bKash',
  },
  {
    id: 'ORD-2026-002',
    date: '2026-07-15',
    items: [
      { name: 'Banarasi Silk Saree', qty: 2, price: 28000, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&h=100&fit=crop' },
    ],
    total: 56000,
    status: 'Delivered',
    payment: 'Cash on Delivery',
  },
];

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Processing': 'bg-blue-100 text-blue-700',
  'Shipped': 'bg-purple-100 text-purple-700',
  'Delivered': 'bg-green-100 text-green-700',
};

export default function OrderHistory() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-white border-b border-cream-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gold-600 flex items-center gap-1"><Home size={14} /> Home</Link>
            <ChevronRight size={14} />
            <span className="text-navy-500 font-medium">My Orders</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold text-navy-500 mb-8">My Orders</h1>

        {sampleOrders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={64} className="mx-auto text-cream-400 mb-4" />
            <h2 className="text-xl font-serif font-bold text-navy-500 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-4">Start shopping to see your orders here.</p>
            <Link to="/products" className="btn-gold">Shop Now</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sampleOrders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-6 shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div>
                    <p className="font-serif font-bold text-navy-500">{order.id}</p>
                    <p className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-2 sm:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                    <Link to={`/orders/${order.id}`} className="text-gold-600 hover:text-gold-700 text-sm flex items-center gap-1">
                      <Eye size={14} /> View Details
                    </Link>
                  </div>
                </div>

                <div className="space-y-3 border-t border-cream-100 pt-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-medium text-navy-500 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                      </div>
                      <p className="font-semibold text-gold-600 text-sm">৳{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-cream-100 pt-4 mt-4">
                  <p className="text-sm text-gray-500">Payment: {order.payment}</p>
                  <p className="font-bold text-navy-500">Total: <span className="text-gold-600">৳{order.total.toLocaleString()}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
