import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1600&h=800&fit=crop',
    title: 'Exquisite Bridal Collection',
    subtitle: 'Make your special day truly magical',
    cta: 'Shop Bridal',
    link: '/products?category=bridal-outfit',
    align: 'left',
  },
  {
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&h=800&fit=crop',
    title: 'Premium Saree Collection',
    subtitle: 'Timeless elegance for every occasion',
    cta: 'Explore Sarees',
    link: '/products?category=saree',
    align: 'right',
  },
  {
    image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b34e?w=1600&h=800&fit=crop',
    title: 'Luxury Jewellery & Accessories',
    subtitle: 'Complete your look with stunning pieces',
    cta: 'Shop Jewellery',
    link: '/products?category=jewellery',
    align: 'left',
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index) => setCurrent(index);
  const prev = () => setCurrent((current - 1 + slides.length) % slides.length);
  const next = () => setCurrent((current + 1) % slides.length);

  return (
    <div className="relative h-[500px] sm:h-[600px] lg:h-[750px] overflow-hidden bg-navy-900">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/80 via-navy-900/50 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${
                index === current
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8 pointer-events-none absolute'
              }`}
            >
              <div className={`max-w-xl ${slide.align === 'right' ? 'ml-auto text-right' : ''}`}>
                <span className="inline-block text-gold-400 font-cursive text-xl mb-2">
                  ✨ Afsheen Premium Fashion Hub
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-4">
                  {slide.title}
                </h1>
                <p className="text-cream-500 text-lg mb-8">{slide.subtitle}</p>
                <Link
                  to={slide.link}
                  className="inline-flex items-center gap-2 bg-gold-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gold-600 transition-all duration-300 shadow-luxury-lg group"
                >
                  {slide.cta}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition hidden sm:flex"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition hidden sm:flex"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current ? 'w-8 bg-gold-500' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Trust Badges */}
      <div className="absolute bottom-0 left-0 right-0 bg-navy-500/90 backdrop-blur-sm border-t border-white/10 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-center gap-8 text-xs text-cream-500">
          <span className="flex items-center gap-2">✓ Since 2020</span>
          <span className="flex items-center gap-2">✓ 229K+ Happy Customers</span>
          <span className="flex items-center gap-2">✓ Free Delivery Above ৳10,000</span>
          <span className="flex items-center gap-2">✓ Secure Payment</span>
        </div>
      </div>
    </div>
  );
}
