import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Fatima Rahman',
    location: 'Dhaka',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    rating: 5,
    text: 'Absolutely stunning bridal lehenga! The quality exceeded my expectations. The zardozi work was flawless and the fitting was perfect. Thank you Afsheen!',
    product: 'Royal Red Bridal Lehenga',
  },
  {
    name: 'Nusrat Jahan',
    location: 'Chittagong',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    rating: 5,
    text: 'The Bengali couple set was gorgeous. My husband and I received so many compliments at our wedding reception. Highly recommend their collection!',
    product: 'Elegant Bengali Couple Set',
  },
  {
    name: 'Sabrina Akter',
    location: 'Sylhet',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    rating: 5,
    text: 'The Korean skincare set works like magic! My skin has never looked better. And the delivery was so fast. Will definitely order again.',
    product: 'Korean Glass Skin Serum Set',
  },
  {
    name: 'Maliha Khan',
    location: 'Rajshahi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rating: 5,
    text: 'The Kundan jewellery set is absolutely beautiful. The gold plating is high quality and the design is exquisite. Worth every taka!',
    product: 'Kundan Bridal Jewellery Set',
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-cream-gradient">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-gold-500 font-cursive text-lg">Testimonials</span>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-navy-500 mt-1">
            What Our Customers Say
          </h2>
          <div className="w-20 h-1 bg-gold-gradient mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gold-200"
                />
                <div>
                  <h4 className="font-serif font-semibold text-navy-500 text-sm">{t.name}</h4>
                  <p className="text-xs text-gray-500">{t.location}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={14} className="text-gold-500 fill-gold-500" />
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">"{t.text}"</p>
              <p className="text-xs text-gold-600 font-medium">Purchased: {t.product}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
