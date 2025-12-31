import React, { useState, useEffect, useRef } from 'react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { resolveImageUrl } from '../utils/imageUrl';
import WarningDialog from './WarningDialog';
import ProductQuickViewDialog from './ProductQuickViewDialog';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const imagesRaw = Array.isArray(product.images) && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
  const images = imagesRaw.map((u) => resolveImageUrl(u));
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const hoverTimeout = useRef(null);

  useEffect(() => {
    if (!isHovered || images.length <= 1) return;
    hoverTimeout.current = setTimeout(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearTimeout(hoverTimeout.current);
  }, [isHovered, currentImage, images.length]);

  const { addToCart, removeFromCart, isInCart, updateQuantity } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const getNormalizedProduct = () => {
    const id = product._id || product.productId || product.id;
    return { ...product, id, image: resolveImageUrl(product) };
  };

  const navigate = useNavigate();
  const normalized = getNormalizedProduct();
  const inWishlist = isInWishlist(normalized.id);
  const inCart = isInCart(normalized.id);

  const checkAuth = (action) => {
    if (!isAuthenticated) {
      setDialogMessage(`Please login to ${action}.`);
      setDialogOpen(true);
      window.dispatchEvent(new CustomEvent('open-login-modal'));
      return false;
    }
    return true;
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (!checkAuth('add items to your wishlist')) return;
    inWishlist ? removeFromWishlist(normalized.id) : addToWishlist(normalized);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <>
      <div
        className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); clearTimeout(hoverTimeout.current); }}
        onClick={() => navigate(`/product/${normalized.id}`)}
      >
        {/* Image Container */}
        <div className="aspect-[3/4] overflow-hidden relative bg-secondary/20">
          {images.length > 0 ? (
            <img
              src={images[currentImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">No Image</div>
          )}

          {/* Discount Badge */}
          {product.originalPrice && product.price && product.originalPrice > product.price && (
            <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </div>
          )}

          {/* Quick Actions Overlay (Bottom) */}
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <button
              onClick={handleQuickAdd}
              className="bg-white text-text-main hover:bg-primary hover:text-white p-2 rounded-full shadow-lg transition-colors tooltip-trigger"
              title="Quick View"
            >
              <Eye size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={handleWishlistClick}
              className={`bg-white hover:bg-primary hover:text-white p-2 rounded-full shadow-lg transition-colors ${inWishlist ? 'text-primary' : 'text-text-main'}`}
              title="Wishlist"
            >
              <Heart size={18} fill={inWishlist ? "currentColor" : "none"} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 text-center flex-grow flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg text-text-main group-hover:text-primary transition-colors line-clamp-1 mb-1">
              {product.name}
            </h3>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="font-medium text-text-main">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-text-muted line-through">₹{product.originalPrice}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <WarningDialog open={dialogOpen} message={dialogMessage} onClose={() => setDialogOpen(false)} />

      <ProductQuickViewDialog
        open={quickViewOpen}
        product={normalized}
        onClose={() => setQuickViewOpen(false)}
        onBuyNow={async (prod, qty) => {
          if (!checkAuth('buy now')) return;
          const id = prod.id || prod._id;
          const success = isInCart(id) ? await updateQuantity(id, qty) : await addToCart(prod, qty);
          if (success) navigate('/checkout');
        }}
        onAddToCart={(prod, qty) => {
          if (!checkAuth('add to cart')) return;
          const id = prod.id || prod._id;
          if (isInCart(id)) removeFromCart(id);
          else addToCart(prod, qty);
        }}
        onWishlistToggle={(prod) => {
          if (!checkAuth('add to wishlist')) return;
          const id = prod.id || prod._id;
          if (isInWishlist(id)) removeFromWishlist(id);
          else addToWishlist(prod);
        }}
        inCart={inCart}
        wishlisted={inWishlist}
      />
    </>
  );
};

export default ProductCard;
