import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonProductCard from '../components/SkeletonProductCard';
import { Truck, RefreshCw, Headset, Banknote, ArrowRight, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { HeroGeometric } from '../components/ui/HeroGeometric';
import { dummyProducts } from '../data/dummyData';

const JewelryLandingPage = () => {
  const categoriesRef = useRef(null);
  const [newArrivals, setNewArrivals] = useState([]);
  const newArrivalsRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Simplified fetch logic for brevity, assuming API structure matches
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || '';
      // Fetch latest 10 products for New Arrivals
      const recentRes = await fetch(`${baseUrl}/products?page=1&limit=10`);
      const recentData = await recentRes.json();
      if (recentData && Array.isArray(recentData.products) && recentData.products.length > 0) {
        setNewArrivals(recentData.products);
      } else {
        setNewArrivals(dummyProducts.slice(0, 10));
      }
    } catch (e) {
      console.error('Error fetching data:', e);
      setNewArrivals(dummyProducts.slice(0, 10));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 300;
      const target = direction === 'left'
        ? ref.current.scrollLeft - scrollAmount
        : ref.current.scrollLeft + scrollAmount;
      ref.current.scrollTo({ left: target, behavior: 'smooth' });
    }
  };

  const categories = [
    { name: 'Sarees', image: 'https://www.karagiri.com/cdn/shop/files/HDLM-385-PINK-1.jpg?v=1701165334', link: '/sarees' },
    { name: 'Necklaces', image: 'https://m.media-amazon.com/images/I/61xUQIASFkL.UY1100.jpg', link: '/necklaces' },
    { name: 'Earrings', image: 'https://www.theshoppingtree.in/cdn/shop/products/IMG_20230420_170930.jpg?v=1682058120', link: '/earrings' },
    { name: 'Bangles', image: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/16547274/2025/3/27/4175d68d-0eb8-48ad-8910-090d83ad8ca51743082097710-Rubans-Set-of-2-18K-Gold-Plated-Ruby-Red-Studded-Geru-Polish-1.jpg', link: '/bangles' },
    { name: 'Rings', image: 'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dwd2f041fe/images/hi-res/51M5B1FGYAA00_1.jpg?sw=480&sh=480', link: '/rings' },
  ];

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'On all orders above ₹999' },
    { icon: RefreshCw, title: 'Easy Returns', desc: '7-day return policy' },
    { icon: Headset, title: '24/7 Support', desc: 'Dedicated support team' },
    { icon: Banknote, title: 'Secure Payment', desc: '100% secure checkout' },
  ];

  return (
    <div className="bg-background min-h-screen">

      {/* Hero Section - With Animated Geometric Shapes */}
      <HeroGeometric />

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-accent text-sm tracking-widest font-semibold uppercase">Collections</span>
              <h2 className="font-serif text-3xl md:text-4xl text-primary mt-2">Curated For You</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scrollContainer(categoriesRef, 'left')} className="p-2 border border-secondary rounded-full hover:bg-secondary transition-colors"><ArrowLeft size={20} /></button>
              <button onClick={() => scrollContainer(categoriesRef, 'right')} className="p-2 border border-secondary rounded-full hover:bg-secondary transition-colors"><ArrowRight size={20} /></button>
            </div>
          </div>

          <div
            ref={categoriesRef}
            className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {categories.map((cat, idx) => (
              <Link key={idx} to={cat.link} className="min-w-[280px] group relative aspect-[4/5] rounded-2xl overflow-hidden snap-start">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="font-serif text-2xl">{cat.name}</h3>
                  <span className="text-sm font-medium border-b border-white/50 pb-0.5 group-hover:border-white transition-colors">Explore</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-accent text-sm tracking-widest font-semibold uppercase">Fresh In</span>
            <h2 className="font-serif text-3xl md:text-4xl text-primary mt-2">New Arrivals</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(n => <div key={n} className="h-80 bg-secondary/30 animate-pulse rounded-xl"></div>)}
            </div>
          ) : (
            <div className="relative">
              <div ref={newArrivalsRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {newArrivals.map(product => (
                  <div key={product._id || product.id} className="min-w-[260px] md:min-w-[280px] snap-center">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/shop" className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors border-b border-primary pb-0.5">
              View All Products <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features / Why Choose Us */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/5 text-primary rounded-full flex items-center justify-center mb-4">
                  <feature.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-lg text-text-main mb-2">{feature.title}</h3>
                <p className="text-sm text-text-muted">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-24 bg-primary text-white text-center px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl mb-4">Join The Family</h2>
          <p className="text-white/80 mb-8 font-light">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:bg-white/20"
            />
            <button className="bg-white text-primary px-8 py-3 rounded-full font-medium hover:bg-secondary transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default JewelryLandingPage;
