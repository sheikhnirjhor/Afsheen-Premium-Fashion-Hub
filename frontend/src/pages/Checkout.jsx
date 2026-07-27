import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { CreditCard, Smartphone, Building2, Banknote, Lock, ChevronRight, Home } from 'lucide-react';

const paymentMethods = [
  { id: 'bkash', name: 'bKash', icon: Smartphone, color: 'bg-pink-100 text-pink-700', desc: 'Pay via bKash Mobile Wallet' },
  { id: 'nagad', name: 'Nagad', icon: Smartphone, color: 'bg-orange-100 text-orange-700', desc: 'Pay via Nagad Digital Wallet' },
  { id: 'visa', name: 'Visa', icon: CreditCard, color: 'bg-blue-100 text-blue-700', desc: 'Visa Credit/Debit Card' },
  { id: 'mastercard', name: 'MasterCard', icon: CreditCard, color: 'bg-red-100 text-red-700', desc: 'MasterCard Credit/Debit Card' },
  { id: 'bank', name: 'Bank Transfer', icon: Building2, color: 'bg-green-100 text-green-700', desc: 'Direct Bank Transfer (NPSB/BFT)' },
  { id: 'cod', name: 'Cash on Delivery', icon: Banknote, color: 'bg-purple-100 text-purple-700', desc: 'Pay when you receive your order' },
];

export default function Checkout() {
  const { cart, getSubtotal, getDiscount, getShipping, getTotal, coupon, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: currentUser?.email || '',
    address: '',
    city: '',
    district: '',
    note: '',
  });
  const [bkashNumber, setBkashNumber] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }
    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Order placed successfully!');
    clearCart();
    navigate('/orders');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Your cart is empty. Add items to proceed.</p>
          <Link to="/products" className="btn-gold">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-cream-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gold-600 flex items-center gap-1"><Home size={14} /> Home</Link>
            <ChevronRight size={14} />
            <Link to="/cart" className="hover:text-gold-600">Cart</Link>
            <ChevronRight size={14} />
            <span className="text-navy-500 font-medium">Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold text-navy-500 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {['Shipping', 'Payment', 'Review'].map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-gold-500 text-white' : 'bg-cream-200 text-gray-500'
                }`}>
                  {i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${step === i + 1 ? 'text-gold-600' : 'text-gray-500'}`}>
                  {label}
                </span>
              </div>
              {i < 2 && <div className={`w-12 sm:w-20 h-0.5 mx-2 ${step > i + 1 ? 'bg-green-500' : 'bg-cream-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Shipping */}
              {step === 1 && (
                <div className="bg-white rounded-2xl p-6 shadow-card animate-fade-in">
                  <h2 className="font-serif font-bold text-navy-500 text-xl mb-6">Shipping Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-navy-500 mb-1">Full Name *</label>
                      <input name="fullName" value={formData.fullName} onChange={handleInputChange}
                        className="input-luxury" placeholder="Enter your full name" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-500 mb-1">Phone Number *</label>
                      <input name="phone" value={formData.phone} onChange={handleInputChange}
                        className="input-luxury" placeholder="+880 1XXX-XXXXXX" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-500 mb-1">Email</label>
                      <input name="email" type="email" value={formData.email} onChange={handleInputChange}
                        className="input-luxury" placeholder="your@email.com" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-navy-500 mb-1">Delivery Address *</label>
                      <textarea name="address" value={formData.address} onChange={handleInputChange}
                        className="input-luxury" rows="3" placeholder="House #, Road #, Area, Landmark" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-500 mb-1">City *</label>
                      <input name="city" value={formData.city} onChange={handleInputChange}
                        className="input-luxury" placeholder="e.g., Dhaka" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-500 mb-1">District *</label>
                      <select name="district" value={formData.district} onChange={handleInputChange}
                        className="input-luxury" required>
                        <option value="">Select District</option>
                        {['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-navy-500 mb-1">Order Note (Optional)</label>
                      <textarea name="note" value={formData.note} onChange={handleInputChange}
                        className="input-luxury" rows="2" placeholder="Any special instructions for delivery..." />
                    </div>
                  </div>
                  <button type="button" onClick={() => setStep(2)}
                    className="btn-gold mt-6">
                    Continue to Payment
                  </button>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className="bg-white rounded-2xl p-6 shadow-card animate-fade-in">
                  <h2 className="font-serif font-bold text-navy-500 text-xl mb-6">Payment Method</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {paymentMethods.map(method => {
                      const Icon = method.icon;
                      return (
                        <label
                          key={method.id}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                            selectedPayment === method.id
                              ? 'border-gold-500 bg-gold-50'
                              : 'border-cream-200 hover:border-gold-300'
                          }`}
                        >
                          <input type="radio" name="payment" value={method.id}
                            checked={selectedPayment === method.id}
                            onChange={() => setSelectedPayment(method.id)}
                            className="sr-only"
                          />
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${method.color}`}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-navy-500 text-sm">{method.name}</p>
                            <p className="text-xs text-gray-500">{method.desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {/* Payment Details */}
                  {selectedPayment === 'bkash' && (
                    <div className="mt-4 p-4 bg-pink-50 rounded-xl">
                      <p className="text-sm text-pink-700 mb-3">You will be redirected to bKash to complete payment.</p>
                      <div>
                        <label className="block text-sm font-medium text-navy-500 mb-1">bKash Number</label>
                        <input className="input-luxury" placeholder="01XXXXXXXXX" />
                      </div>
                    </div>
                  )}
                  {selectedPayment === 'nagad' && (
                    <div className="mt-4 p-4 bg-orange-50 rounded-xl">
                      <p className="text-sm text-orange-700 mb-3">You will be redirected to Nagad to complete payment.</p>
                      <div>
                        <label className="block text-sm font-medium text-navy-500 mb-1">Nagad Number</label>
                        <input className="input-luxury" placeholder="01XXXXXXXXX" />
                      </div>
                    </div>
                  )}
                  {(selectedPayment === 'visa' || selectedPayment === 'mastercard') && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl space-y-3">
                      <div className="flex items-center gap-2 text-sm text-blue-700 mb-2">
                        <Lock size={14} />
                        <span>Secure payment via SSLCommerz</span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-500 mb-1">Card Number</label>
                        <input className="input-luxury" placeholder="XXXX XXXX XXXX XXXX" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-navy-500 mb-1">Expiry</label>
                          <input className="input-luxury" placeholder="MM/YY" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-500 mb-1">CVV</label>
                          <input className="input-luxury" type="password" placeholder="***" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-500 mb-1">Cardholder Name</label>
                        <input className="input-luxury" placeholder="Name on card" />
                      </div>
                    </div>
                  )}
                  {selectedPayment === 'bank' && (
                    <div className="mt-4 p-4 bg-green-50 rounded-xl">
                      <p className="text-sm text-green-700 mb-2">Bank Transfer Details:</p>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Bank:</strong> Dutch-Bangla Bank Limited</p>
                        <p><strong>Account Name:</strong> Afsheen Premium Fashion Hub</p>
                        <p><strong>Account No:</strong> XXXXXXXXXX</p>
                        <p><strong>Branch:</strong> Dhaka Main</p>
                        <p className="text-xs text-orange-600 mt-2">Please transfer and share the receipt on our live chat.</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setStep(1)} className="btn-outline-gold">
                      Back
                    </button>
                    <button type="button" onClick={() => setStep(3)} className="btn-gold">
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="bg-white rounded-2xl p-6 shadow-card animate-fade-in">
                  <h2 className="font-serif font-bold text-navy-500 text-xl mb-6">Review Your Order</h2>
                  
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.cartId} className="flex gap-3 items-center p-3 bg-cream-50 rounded-xl">
                        <img src={item.images[0]} alt={item.name} className="w-16 h-20 object-cover rounded-lg" />
                        <div className="flex-1">
                          <p className="font-medium text-navy-500 text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gold-600">৳{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-cream-50 rounded-xl text-sm mb-6">
                    <div>
                      <p className="font-semibold text-navy-500">Shipping To:</p>
                      <p className="text-gray-600">{formData.fullName}</p>
                      <p className="text-gray-600">{formData.address}</p>
                      <p className="text-gray-600">{formData.city}, {formData.district}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-navy-500">Payment:</p>
                      <p className="text-gray-600 capitalize">{selectedPayment === 'cod' ? 'Cash on Delivery' : selectedPayment}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} className="btn-outline-gold">
                      Back
                    </button>
                    <button type="submit" className="btn-gold flex items-center gap-2">
                      <Lock size={16} />
                      Place Order - ৳{getTotal().toLocaleString()}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-card sticky top-24">
                <h3 className="font-serif font-bold text-navy-500 mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm border-b border-cream-100 pb-4 mb-4">
                  {cart.map(item => (
                    <div key={item.cartId} className="flex justify-between">
                      <span className="text-gray-600 truncate mr-2">
                        {item.name} (x{item.quantity})
                      </span>
                      <span className="font-medium">৳{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>৳{getSubtotal().toLocaleString()}</span>
                  </div>
                  {getDiscount() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount {coupon && `(${coupon.code})`}</span>
                      <span>-৳{getDiscount().toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{getShipping() === 0 ? 'Free' : `৳${getShipping()}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-navy-500 text-lg border-t border-cream-100 pt-2">
                    <span>Total</span>
                    <span className="text-gold-600">৳{getTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
