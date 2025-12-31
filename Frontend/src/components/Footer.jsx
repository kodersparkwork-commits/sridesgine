import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Instagram, Facebook, Youtube, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-secondary pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Sri Design" className="h-12 w-auto bg-white/10 rounded-md p-1" />
              <span className="font-serif text-xl tracking-widest font-bold">SRI DESIGN</span>
            </div>
            <p className="text-secondary/80 text-sm leading-relaxed">
              We create, we design, we deliver. Transform your look with beautiful jewellery and curated ethnic wear.
            </p>
            <div className="flex space-x-4">
              <a href="https://wa.me/919346680372" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-primary transition-all">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" /></svg>
              </a>
              <a href="https://www.instagram.com/sri_design_collections/?utm_source=ig_web_button_share_sheetigsh=MTRjcnY5OHd4dTc2cA==" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-primary transition-all">
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a href="https://www.youtube.com/@sridesigncollections" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-primary transition-all">
                <Youtube size={20} strokeWidth={1.5} />
              </a>
              <a href="mailto:rscollextiononline@gmail.com" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-primary transition-all">
                <Mail size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-6 border-b border-white/20 pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-3 text-sm text-secondary/80">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/best-sellers" className="hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link to="/my-orders" className="hover:text-white transition-colors">My Orders</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif text-lg mb-6 border-b border-white/20 pb-2 inline-block">Top Categories</h4>
            <ul className="space-y-3 text-sm text-secondary/80">
              <li><Link to="/earrings" className="hover:text-white transition-colors">Earrings</Link></li>
              <li><Link to="/necklaces" className="hover:text-white transition-colors">Necklaces</Link></li>
              <li><Link to="/rings" className="hover:text-white transition-colors">Rings</Link></li>
              <li><Link to="/sarees" className="hover:text-white transition-colors">Sarees</Link></li>
            </ul>
          </div>

          {/* Contact & Policy */}
          <div>
            <h4 className="font-serif text-lg mb-6 border-b border-white/20 pb-2 inline-block">Contact & Policy</h4>
            <ul className="space-y-3 text-sm text-secondary/80">
              <li>Call: <a href="tel:+919346680372" className="hover:text-white">+91 93466 80372</a></li>
              <li>Email: <a href="mailto:rscollextiononline@gmail.com" className="hover:text-white">rscollextiononline@gmail.com</a></li>
              <li className="pt-2"><Link to="/terms" className="hover:text-white text-xs">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white text-xs">Refund Policy</Link></li>
              <li><Link to="/shipping" className="hover:text-white text-xs">Shipping Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-secondary/60">
          <p>© {currentYear} Sri Design Jewellery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;