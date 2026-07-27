import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, AlertCircle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-white border-b border-cream-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gold-600 flex items-center gap-1"><Home size={14} /> Home</Link>
            <ChevronRight size={14} />
            <span className="text-navy-500 font-medium">Return & Exchange Policy</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <span className="text-gold-500 font-cursive text-lg">Our Promise</span>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-navy-500 mt-1">Return & Exchange Policy</h1>
          <div className="w-20 h-1 bg-gold-gradient mx-auto mt-4 rounded-full" />
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-card space-y-8">
          <section>
            <h2 className="font-serif font-bold text-navy-500 text-xl mb-4 flex items-center gap-2">
              <RotateCcw size={20} className="text-gold-500" />
              Return Policy
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              We want you to be completely satisfied with your purchase. If you're not happy with your order, 
              we offer a hassle-free return policy under the following conditions:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                Returns must be initiated within <strong>7 days</strong> of receiving the product.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                Products must be unused, unworn, and in original packaging with all tags intact.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                Return shipping costs are borne by the customer unless the item is defective.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                Refunds will be processed within 5-7 business days after the returned item is received and inspected.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-bold text-navy-500 text-xl mb-4 flex items-center gap-2">
              <CheckCircle size={20} className="text-gold-500" />
              Exchange Policy
            </h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                Size exchanges are available within <strong>5 days</strong> of delivery.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                Exchanges are subject to stock availability of the desired size/color.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                Custom-size orders cannot be exchanged unless there's a manufacturing defect.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-bold text-navy-500 text-xl mb-4 flex items-center gap-2">
              <XCircle size={20} className="text-red-400" />
              Non-Returnable Items
            </h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <XCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                Customized or personalized orders
              </li>
              <li className="flex items-start gap-2">
                <XCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                Skincare and beauty products (for hygiene reasons)
              </li>
              <li className="flex items-start gap-2">
                <XCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                Items without original tags or packaging
              </li>
              <li className="flex items-start gap-2">
                <XCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                Items purchased during clearance sales
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-bold text-navy-500 text-xl mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-gold-500" />
              How to Initiate a Return
            </h2>
            <ul className="space-y-2 text-sm text-gray-600 ml-6">
              <li className="flex items-start gap-2">
                <span className="w-6 h-6 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                Contact our support team via live chat or call with your order ID.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-6 h-6 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                Provide the reason for return and photos if applicable.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-6 h-6 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                Ship the item to the address provided by our team.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-6 h-6 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                Once received and inspected, your refund or exchange will be processed.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
