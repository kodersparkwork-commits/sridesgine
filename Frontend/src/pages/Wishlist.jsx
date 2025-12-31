import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowLeft, LogIn } from 'lucide-react';

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const { wishlistItems, getWishlistCount } = useWishlist();
  const navigate = useNavigate();

  const openLoginModal = () => {
    try {
      if (typeof window !== 'undefined') {
        window.openLoginModal ? window.openLoginModal() : window.dispatchEvent(new CustomEvent('open-login-modal'));
      }
    } catch (e) {
      navigate('/login');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pt-24 text-center">
        <div className="bg-white p-12 rounded-2xl shadow-sm max-w-lg w-full">
          <div className="w-20 h-20 bg-secondary/30 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={32} strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-3xl text-text-main mb-4">Please Login</h2>
          <p className="text-text-muted mb-8">Sign in to save your favorite items and access them from any device.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={openLoginModal} className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              <LogIn size={18} /> Login to Continue
            </button>
            <button onClick={() => navigate('/')} className="border border-border text-text-main px-8 py-3 rounded-full hover:bg-secondary/20 transition-colors flex items-center justify-center gap-2">
              <ArrowLeft size={18} /> Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pt-24 text-center">
        <div className="bg-white p-12 rounded-2xl shadow-sm max-w-lg w-full">
          <div className="w-20 h-20 bg-secondary/30 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={32} strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-3xl text-text-main mb-4">Your Wishlist is Empty</h2>
          <p className="text-text-muted mb-8">Discover amazing products and add them to your wishlist for later!</p>
          <button onClick={() => navigate('/shop')} className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            <ShoppingBag size={18} /> Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl md:text-4xl text-text-main mb-3">Your Wishlist</h1>
          <p className="text-text-muted">{getWishlistCount()} {getWishlistCount() === 1 ? 'item' : 'items'} saved for later</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlistItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button onClick={() => navigate('/shop')} className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
            <ArrowLeft size={18} /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
