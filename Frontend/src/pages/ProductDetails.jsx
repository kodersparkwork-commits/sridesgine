import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';
import { resolveImageUrl } from '../utils/imageUrl';
import { Check, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Star, Minus, Plus, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { dummyProducts } from '../data/dummyData';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart, removeFromCart, isInCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
      window.scrollTo(0, 0);
    }
  }, [productId]);

  useEffect(() => {
    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || '';

      try {
        const response = await fetch(`${baseUrl}/products/${productId}`);
        const data = await response.json();

        if (data.product) {
          setProduct(data.product);
          if (data.product.sizes && data.product.sizes.length > 0) {
            setSelectedSize(data.product.sizes[0]);
          }
          return;
        }
      } catch (apiError) {
        // API failed, try dummy data
        console.log('API fetch failed, trying dummy data...');
      }

      // Fallback to dummy data
      const dummyProduct = dummyProducts.find(p => p._id === productId);
      if (dummyProduct) {
        setProduct(dummyProduct);
        if (dummyProduct.sizes && dummyProduct.sizes.length > 0) {
          setSelectedSize(dummyProduct.sizes[0]);
        }
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      let products = [];

      try {
        const response = await fetch(`${baseUrl}/products?category=${product.category}`);
        const data = await response.json();
        if (data.products) {
          products = data.products;
        }
      } catch (apiError) {
        // API failed, use dummy data
        products = dummyProducts.filter(p => p.category === product.category);
      }

      // If API returned empty or failed, ensuring we have products from dummy data if available
      if (products.length === 0) {
        products = dummyProducts.filter(p => p.category === product.category);
      }

      if (products.length > 0) {
        const related = products
          .filter(p => (p.productId || p._id) !== (product.productId || product._id))
          .slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  const checkAuth = () => {
    if (!isAuthenticated) {
      window.openLoginModal();
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!checkAuth()) return;
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }
    const productIdentifier = product.productId || product.id || product._id;
    const cartItem = {
      ...product,
      id: productIdentifier,
      image: product.image || product.images?.[0] || '',
      selectedSize,
      quantity
    };
    addToCart(cartItem, quantity);
  };

  const handleBuyNow = () => {
    if (!checkAuth()) return;
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }
    const productIdentifier = product.productId || product.id || product._id;
    const cartItem = {
      ...product,
      id: productIdentifier,
      image: product.image || product.images?.[0] || '',
      selectedSize,
      quantity
    };
    addToCart(cartItem, quantity);
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    if (!checkAuth()) return;
    const productIdentifier = product.productId || product.id || product._id;
    if (isInWishlist(productIdentifier)) {
      removeFromWishlist(productIdentifier);
    } else {
      addToWishlist({
        ...product,
        id: productIdentifier,
        image: product.image || product.images?.[0] || ''
      });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (error || !product) return <div className="min-h-screen flex items-center justify-center bg-background text-primary">{error || 'Product not found'}</div>;

  const productIdentifier = product.productId || product.id || product._id;
  const wishlisted = isInWishlist(productIdentifier);
  const inCart = isInCart(productIdentifier);
  const images = product.images && product.images.length > 0 ? product.images.map(resolveImageUrl) : [resolveImageUrl(product.image)];

  return (
    <div className="bg-background min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-text-muted mb-8">
          <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/')}>Home</span>
          <ChevronRight size={14} className="mx-2" />
          <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/shop')}>Shop</span>
          <ChevronRight size={14} className="mx-2" />
          <span className="font-medium text-text-main line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Left Column: Images */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-secondary/20 rounded-2xl overflow-hidden relative group">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`min-w-[80px] w-20 h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${activeImage === idx ? 'border-primary' : 'border-transparent hover:border-primary/30'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col">
            <h1 className="font-serif text-3xl md:text-4xl text-text-main mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-medium text-primary">₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-text-muted line-through">₹{product.originalPrice}</span>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                    SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <div className="prose prose-sm text-text-muted mb-8 max-w-none">
              <p>{product.description}</p>
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <span className="text-sm font-semibold text-text-main uppercase tracking-wide block mb-3">Select Size</span>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-10 px-4 min-w-[3rem] rounded border transition-all ${selectedSize === size ? 'border-primary bg-primary text-white' : 'border-border text-text-main hover:border-primary'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4 mb-10">
              {/* Quantity & Add to Cart */}
              <div className="flex gap-4">
                <div className="flex items-center border border-border rounded-lg h-12">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 text-text-muted hover:text-primary"><Minus size={18} /></button>
                  <span className="w-8 text-center font-medium text-text-main">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 text-text-muted hover:text-primary"><Plus size={18} /></button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white border border-primary text-primary hover:bg-primary/5 h-12 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} />
                  {inCart ? 'In Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`w-12 h-12 rounded-lg border flex items-center justify-center transition-colors ${wishlisted ? 'border-red-200 bg-red-50 text-red-500' : 'border-border hover:border-primary text-text-muted hover:text-primary'}`}
                >
                  <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full bg-primary text-white h-12 rounded-lg font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
              >
                Buy Now
              </button>
            </div>

            {/* Features / Assurance */}
            <div className="grid grid-cols-3 gap-4 border-t border-border pt-8">
              <div className="flex flex-col items-center text-center">
                <Truck size={24} className="text-primary mb-2" strokeWidth={1.5} />
                <span className="text-xs text-text-muted font-medium">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RefreshCw size={24} className="text-primary mb-2" strokeWidth={1.5} />
                <span className="text-xs text-text-muted font-medium">Easy Returns</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <ShieldCheck size={24} className="text-primary mb-2" strokeWidth={1.5} />
                <span className="text-xs text-text-muted font-medium">Secure Payment</span>
              </div>
            </div>

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="font-serif text-3xl text-primary mb-12 text-center">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p._id || p.productId} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;