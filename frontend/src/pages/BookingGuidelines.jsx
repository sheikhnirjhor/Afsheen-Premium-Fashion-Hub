import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, FileText, Phone, MessageCircle } from 'lucide-react';

export default function BookingGuidelines() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-white border-b border-cream-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gold-600 flex items-center gap-1"><Home size={14} /> Home</Link>
            <ChevronRight size={14} />
            <span className="text-navy-500 font-medium">Booking Guidelines</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <span className="text-gold-500 font-cursive text-lg">How to Order</span>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-navy-500 mt-1">Booking Guidelines</h1>
          <div className="w-20 h-1 bg-gold-gradient mx-auto mt-4 rounded-full" />
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-card space-y-8">
          <section>
            <h2 className="font-serif font-bold text-navy-500 text-xl mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Browse & Select Products
            </h2>
            <ul className="text-gray-600 space-y-2 ml-10 text-sm leading-relaxed">
              <li>• Explore our categories or use the search bar to find your desired items.</li>
              <li>• Click on a product to view details including available sizes, colors, and pricing.</li>
              <li>• Check stock availability before adding to cart.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-bold text-navy-500 text-xl mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Select Size & Add to Cart
            </h2>
            <ul className="text-gray-600 space-y-2 ml-10 text-sm leading-relaxed">
              <li>• Choose your preferred size (S, M, L, XL, or Custom).</li>
              <li>• For Custom size orders, please provide exact measurements in the order notes.</li>
              <li>• You can add multiple items to your cart.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-bold text-navy-500 text-xl mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              Apply Coupon (Optional)
            </h2>
            <ul className="text-gray-600 space-y-2 ml-10 text-sm leading-relaxed">
              <li>• Check our Facebook page and newsletter for exclusive coupon codes.</li>
              <li>• Enter your coupon code at checkout for instant discounts.</li>
              <li>• Minimum order amounts may apply for certain coupons.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-bold text-navy-500 text-xl mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
              Payment Options
            </h2>
            <ul className="text-gray-600 space-y-2 ml-10 text-sm leading-relaxed">
              <li>• <strong>Online Payment:</strong> bKash, Nagad, Visa, MasterCard, Bank Transfer</li>
              <li>• <strong>Cash on Delivery (COD):</strong> Available for orders within Dhaka. Outside Dhaka, partial advance may be required.</li>
              <li>• For bank transfers, please share the transaction receipt via live chat.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-bold text-navy-500 text-xl mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center text-sm font-bold">5</span>
              Delivery Information
            </h2>
            <ul className="text-gray-600 space-y-2 ml-10 text-sm leading-relaxed">
              <li>• <strong>Dhaka:</strong> 2-3 business days</li>
              <li>• <strong>Outside Dhaka:</strong> 4-7 business days</li>
              <li>• Free delivery on orders above ৳10,000</li>
              <li>• You will receive tracking information via SMS and email.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-bold text-navy-500 text-xl mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center text-sm font-bold">6</span>
              Need Help?
            </h2>
            <div className="ml-10 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} className="text-gold-500" />
                +880 1XXX-XXXXXX
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MessageCircle size={16} className="text-gold-500" />
                Live Chat Support
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
