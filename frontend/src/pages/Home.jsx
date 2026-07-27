import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedCategories from '../components/home/FeaturedCategories';
import FeaturedProducts from '../components/home/FeaturedProducts';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';

export default function Home() {
  return (
    <div>
      <Hero />
      <WhyChooseUs />
      <FeaturedCategories />
      <FeaturedProducts />
      <Testimonials />
    </div>
  );
}
