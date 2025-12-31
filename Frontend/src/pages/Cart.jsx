import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { resolveImageUrl } from '../utils/imageUrl';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cartItems, getCartTotal, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState(null);

  const openLoginModal = () => {
    try {
      if (typeof window !== 'undefined') {
        window.openLoginModal ? window.openLoginModal() : window.dispatchEvent(new CustomEvent('open-login-modal'));
      }
    } catch (e) {
      navigate('/login');
    }
  };

  const handleBuyNow = () => {
    navigate('/checkout');
  };

  const inc = async (item) => {
    if (updatingId) return;
    setUpdatingId(item.id);
    try {
      await updateQuantity(item.id, (item.quantity || 1) + 1);
    } finally {
      setUpdatingId(null);
    }
  };

  const dec = async (item) => {
    if (updatingId) return;
    if ((item.quantity || 1) <= 1) return;
    setUpdatingId(item.id);
    try {
      await updateQuantity(item.id, item.quantity - 1);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <div className="w-16 h-16 bg-secondary/30 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={24} />
          </div>
          <h2 className="font-serif text-2xl text-text-main mb-2">Please Login</h2>
          <p className="text-text-muted mb-8">Sign in to access your shopping bag and continue exploring.</p>
          <div className="flex flex-col gap-3">
            <button onClick={openLoginModal} className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors">
              Login to Continue
            </button>
            <button onClick={() => navigate('/')} className="w-full border border-border text-text-main py-3 rounded-xl hover:bg-secondary/20 transition-colors">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pt-24 text-center">
        <div className="bg-white p-12 rounded-2xl shadow-sm max-w-lg w-full">
          <div className="w-20 h-20 bg-secondary/30 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-3xl text-text-main mb-4">Your Bag is Empty</h2>
          <p className="text-text-muted mb-8">Explore our exclusive collections and find something distinctive.</p>
          <button onClick={() => navigate('/shop')} className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
            Start Shopping <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl md:text-4xl text-text-main mb-8">Shopping Bag</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            {cartItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={item.id}
                className="bg-white p-4 rounded-xl shadow-sm flex gap-6 items-center"
              >
                <div className="w-24 h-24 bg-secondary/20 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={resolveImageUrl(item)} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-grow">
                  <h3 className="font-serif text-lg text-text-main line-clamp-1">{item.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 mb-3">
                    <span className="font-medium text-primary">₹{item.price}</span>
                    {item.selectedSize && (
                      <span className="text-xs px-2 py-0.5 bg-secondary text-text-muted rounded-full uppercase">{item.selectedSize}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-border rounded-lg h-9">
                      <button
                        onClick={() => dec(item)}
                        disabled={updatingId === item.id || (item.quantity || 1) <= 1}
                        className="px-3 text-text-muted hover:text-primary disabled:opacity-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => inc(item)}
                        disabled={updatingId === item.id}
                        className="px-3 text-text-muted hover:text-primary disabled:opacity-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-text-muted hover:text-red-500 transition-colors flex items-center gap-1 text-sm group"
                    >
                      <Trash2 size={16} className="group-hover:stroke-red-500" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-28">
              <h2 className="font-serif text-xl border-b border-border pb-4 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal</span>
                  <span>₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-lg font-bold text-text-main mb-8 pt-4 border-t border-border">
                <span>Total</span>
                <span>₹{getCartTotal()}</span>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full bg-primary text-white py-4 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-4"
              >
                Checkout <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate('/shop')}
                className="w-full text-text-muted hover:text-primary py-2 text-sm transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} /> Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
