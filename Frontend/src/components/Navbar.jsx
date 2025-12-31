import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useAdmin } from '../contexts/AdminContext';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import SearchModal from './SearchModal';
import LoginModal from './LoginModal';
import Login from '../pages/Login';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();
  const { getWishlistCount } = useWishlist();
  const { getCartCount } = useCart();
  const { isAdmin, adminLogout } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const openLogin = () => setIsLoginOpen(true);
    window.addEventListener('open-login-modal', openLogin);
    return () => window.removeEventListener('open-login-modal', openLogin);
  }, []);

  const handleLoginClick = () => {
    if (location.pathname !== '/login') {
      localStorage.setItem('redirectPath', location.pathname + location.search);
    }
    setIsMenuOpen(false);
    setIsLoginOpen(true);
  };

  const handleLogout = () => {
    if (isAdmin) {
      adminLogout();
    } else {
      logout();
      navigate('/', { replace: true });
    }
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">

            {/* Mobile Toggle */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-text-main p-2 hover:bg-secondary rounded-full transition-colors"
              >
                {isMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
              </button>
            </div>

            <Link to="/" className="flex-shrink-0 flex items-center gap-3">
              <img src={logo} alt="Sri Design" className="h-10 w-auto rounded-lg" />
              <span className="font-serif text-xl tracking-widest text-primary font-bold hidden sm:block">
                SRI DESIGN
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { name: 'HOME', path: '/' },
                { name: 'SHOP', path: '/shop' },
                { name: 'SAREES', path: '/sarees' },
                { name: 'JEWELLERY', path: '/necklaces' },
                { name: 'BANGLES', path: '/bangles' },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm tracking-widest transition-colors duration-200 ${isActive(link.path)
                    ? 'text-primary font-semibold border-b-2 border-primary'
                    : 'text-text-main hover:text-primary'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-text-main hover:text-primary transition-colors p-2"
              >
                <Search size={22} strokeWidth={1.5} />
              </button>

              {isAuthenticated ? (
                <Link to="/user" className="text-text-main hover:text-primary transition-colors p-2">
                  <User size={22} strokeWidth={1.5} />
                </Link>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="text-text-main hover:text-primary transition-colors p-2"
                >
                  <User size={22} strokeWidth={1.5} />
                </button>
              )}

              <Link to="/wishlist" className="relative text-text-main hover:text-primary transition-colors p-2">
                <Heart size={22} strokeWidth={1.5} />
                {getWishlistCount() > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative text-text-main hover:text-primary transition-colors p-2">
                <ShoppingBag size={22} strokeWidth={1.5} />
                {getCartCount() > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background border-t border-secondary shadow-lg py-4 px-6 flex flex-col space-y-4">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-text-main hover:text-primary font-medium">HOME</Link>
            <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="text-text-main hover:text-primary font-medium">SHOP ALL</Link>
            <Link to="/sarees" onClick={() => setIsMenuOpen(false)} className="text-text-main hover:text-primary font-medium">SAREES</Link>
            <Link to="/necklaces" onClick={() => setIsMenuOpen(false)} className="text-text-main hover:text-primary font-medium">NECKLACES</Link>
            <Link to="/bangles" onClick={() => setIsMenuOpen(false)} className="text-text-main hover:text-primary font-medium">BANGLES</Link>
            {isAuthenticated && (
              <>
                <div className="h-px bg-secondary w-full my-2"></div>
                <Link to="/user" onClick={() => setIsMenuOpen(false)} className="text-text-main hover:text-primary font-medium">MY PROFILE</Link>
                <button onClick={handleLogout} className="text-left text-primary font-medium">LOGOUT</button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Spacing for fixed navbar */}
      <div className="h-20"></div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <Login />
      </LoginModal>
    </>
  );
};

export default Navbar;
