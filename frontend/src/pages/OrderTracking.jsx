import React from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, Clock, Truck, CheckCircle2, ChevronRight, Home } from 'lucide-react';

const trackingSteps = [
  { label: 'Order Placed', icon: Package, time: 'Jul 20, 2026 - 10:30 AM', done: true },
  { label: 'Processing', icon: Clock, time: 'Jul 20, 2026 - 2:00 PM', done: true },
  { label: 'Shipped', icon: Truck, time: 'Jul 22, 2026 - 9:15 AM', done: true, current: true },
  { label: 'Delivered', icon: CheckCircle2, time: 'Estimated: Jul 25, 2026', done: false },
];

export default function OrderTracking() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-white border-b border-cream-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gold-600 flex items-center gap-1"><Home size={14} /> Home</Link>
            <ChevronRight size={14} />
            <Link to="/orders" className="hover:text-gold-600">My Orders</Link>
            <ChevronRight size={14} />
            <span className="text-navy-500 font-medium">Track Order</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold text-navy-500 mb-2">Order Tracking</h1>
        <p className="text-gray-500 mb-8">Order #ORD-2026-001</p>

        <div className="bg-white rounded-2xl p-6 shadow-card mb-6">
          <h3 className="font-serif font-bold text-navy-500 mb-6">Shipment Status</h3>
          <div className="space-y-0">
            {trackingSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.current
                        ? 'bg-gold-500 text-white animate-pulse-gold'
                        : step.done
                          ? 'bg-green-500 text-white'
                          : 'bg-cream-200 text-gray-400'
                    }`}>
                      <Icon size={18} />
                    </div>
                    {i < trackingSteps.length - 1 && (
                      <div className={`w-0.5 h-12 ${step.done ? 'bg-green-500' : 'bg-cream-200'}`} />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className={`font-semibold ${step.current ? 'text-gold-600' : step.done ? 'text-navy-500' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    <p className="text-sm text-gray-500">{step.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h3 className="font-serif font-bold text-navy-500 mb-4">Delivery Address</h3>
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-gold-500 mt-0.5" />
            <div>
              <p className="text-navy-500">Fatima Rahman</p>
              <p className="text-sm text-gray-500">House 12, Road 5, Gulshan-2, Dhaka 1212</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
