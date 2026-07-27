import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    desc: '100% secure payment with bKash, Nagad, Visa & more',
  },
  {
    icon: Truck,
    title: 'Free Delivery',
    desc: 'Free delivery on orders above ৳10,000',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    desc: 'Hassle-free return & exchange policy',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: 'Live chat support for all your queries',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-navy-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gold-500/20 rounded-2xl flex items-center justify-center group-hover:bg-gold-500 transition-all duration-300">
                  <Icon size={28} className="text-gold-400 group-hover:text-white transition" />
                </div>
                <h3 className="font-serif font-bold text-white text-lg mb-1">{f.title}</h3>
                <p className="text-cream-600 text-sm">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
