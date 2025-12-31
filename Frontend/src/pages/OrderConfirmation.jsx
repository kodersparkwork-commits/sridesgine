import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Check, ShoppingBag, MapPin, CreditCard, ArrowRight } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const order = location.state?.order;

  React.useEffect(() => {
    if (!isAuthenticated || !order) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, order, navigate]);

  // Prevent back/forward cache showing this page after logout
  React.useEffect(() => {
    const handlePageShow = (e) => {
      if (e.persisted && (!isAuthenticated || !order)) {
        navigate('/', { replace: true });
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [isAuthenticated, order, navigate]);

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-lg overflow-hidden">
        {/* Success Header */}
        <div className="bg-primary/5 p-8 text-center border-b border-border">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
            <Check size={40} strokeWidth={3} />
          </div>
          <h1 className="font-serif text-3xl text-text-main mb-2">Order Confirmed!</h1>
          <p className="text-text-muted">Thank you for your purchase. Your order ID is <span className="font-medium text-text-main">#{order._id.slice(-6)}</span></p>
        </div>

        <div className="p-8 space-y-8">
          {/* Order Details */}
          <div>
            <h2 className="font-serif text-lg text-text-main mb-4 flex items-center gap-2">
              <ShoppingBag size={18} className="text-primary" />
              Order Items
            </h2>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-dashed border-border last:border-0">
                  <div>
                    <p className="font-medium text-text-main">{item.name}</p>
                    <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-text-main">₹{item.price}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-border font-bold text-lg text-text-main">
              <span>Total Paid</span>
              <span>₹{order.total}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shipping Address */}
            <div>
              <h2 className="font-serif text-lg text-text-main mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                Shipping Address
              </h2>
              <div className="text-sm text-text-muted space-y-1">
                <p className="font-medium text-text-main">{order.address.name}</p>
                <p>{order.address.doorNo}, {order.address.landmark}</p>
                <p>{order.address.addressLine}</p>
                <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                <p>{order.address.country}</p>
                <p>Phone: {order.address.phone}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div>
              <h2 className="font-serif text-lg text-text-main mb-3 flex items-center gap-2">
                <CreditCard size={18} className="text-primary" />
                Payment Details
              </h2>
              <div className="text-sm text-text-muted space-y-1">
                <p>Method: <span className="font-medium text-text-main">Razorpay</span></p>
                <p>Status: <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 uppercase">{order.payment.status}</span></p>
                <p className="text-xs mt-2">Includes UPI, Net Banking, Cards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="bg-gray-50 p-6 flex justify-center border-t border-border">
          <button
            className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            onClick={() => navigate('/')}
          >
            Continue Shopping <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
