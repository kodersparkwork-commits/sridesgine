import React, { useState } from 'react';
import { loadRazorpayScript } from '../utils/RazorpayLoader';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, MapPin, ShieldCheck, ShoppingBag, Truck, ChevronRight, Edit2, Loader2 } from 'lucide-react';

const Checkout = () => {
  const { user, isAuthenticated } = useAuth();
  const [editMode, setEditMode] = useState(() => !user?.address);
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Redirect to home if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Prevent back/forward cache showing this page after logout
  React.useEffect(() => {
    const handlePageShow = (e) => {
      if (e.persisted && !isAuthenticated) {
        navigate('/', { replace: true });
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [isAuthenticated, navigate]);

  // Address state (single address object)
  const [address, setAddress] = useState(() => {
    if (user?.address) {
      return {
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.mobile || '',
        addressLine1: user.address.addressLine1 || '',
        addressLine2: user.address.addressLine2 || '',
        addressLine: user.address.addressLine || '',
        doorNo: user.address.doorNo || '',
        landmark: user.address.landmark || '',
        pincode: (user.address.pincode !== undefined && user.address.pincode !== null) ? user.address.pincode : (user.address.postalCode || ''),
        city: user.address.city || '',
        state: user.address.state || '',
        country: user.address.country || ''
      };
    }
    return {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.mobile || '',
      addressLine1: '',
      addressLine2: '',
      addressLine: '',
      doorNo: '',
      landmark: '',
      pincode: '',
      city: '',
      state: '',
      country: ''
    };
  });

  // Update address state if user or user.address changes
  React.useEffect(() => {
    if (user?.address) {
      setAddress({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.mobile || '',
        ...user.address
      });
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saveAddress, setSaveAddress] = useState(true);
  const [orderError, setOrderError] = useState('');

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value,
      addressLine: name === 'addressLine1' || name === 'addressLine2'
        ? [name === 'addressLine1' ? value : prev.addressLine1 || '', name === 'addressLine2' ? value : prev.addressLine2 || ''].filter(Boolean).join(', ')
        : [prev.addressLine1 || '', prev.addressLine2 || ''].filter(Boolean).join(', ')
    }));
  };

  const handlePlaceOrder = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setOrderError('');
    try {
      const backendAddress = {
        name: address.name,
        email: address.email,
        phone: address.phone,
        doorNo: address.doorNo,
        landmark: address.landmark,
        pincode: address.pincode,
        addressLine1: address.addressLine1 || '',
        addressLine2: address.addressLine2 || '',
        addressLine: [address.addressLine1, address.addressLine2].filter(Boolean).join(', '),
        city: address.city,
        state: address.state,
        country: address.country
      };

      const errs = {};
      if (!backendAddress.name) errs.name = 'Name required';
      if (!backendAddress.email) errs.email = 'Email required';
      if (!backendAddress.phone) errs.phone = 'Phone required';
      if (!backendAddress.doorNo) errs.doorNo = 'Door No required';
      if (!backendAddress.landmark) errs.landmark = 'Landmark required';
      if (!backendAddress.pincode) errs.pincode = 'Pincode required';
      if (!backendAddress.addressLine1) errs.addressLine1 = 'Address Line 1 required';
      if (!backendAddress.addressLine) errs.addressLine = 'Address required';
      if (!backendAddress.city) errs.city = 'City required';
      if (!backendAddress.state) errs.state = 'State required';
      if (!backendAddress.country) errs.country = 'Country required';
      setErrors(errs);

      if (Object.keys(errs).length > 0) {
        setOrderError('Please fill all required address fields.');
        return;
      }

      setLoading(true);

      const baseUrl = import.meta.env.VITE_API_URL || '';
      if (saveAddress) {
        try {
          await fetch(`${baseUrl}/profile/address`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              ...backendAddress
            })
          });
        } catch (err) {
          // Ignore address save errors
        }
      }

      const placeOrder = async (paymentStatus, razorpayPaymentId = null) => {
        try {
          const orderRes = await fetch(`${baseUrl}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userEmail: user?.email || backendAddress.email,
              address: backendAddress,
              payment: {
                method: paymentMethod,
                status: paymentStatus,
                razorpayPaymentId
              },
              items: cartItems,
              total: getCartTotal()
            })
          });
          if (!orderRes.ok) throw new Error('Order not saved');
          const data = await orderRes.json();
          await clearCart();
          setLoading(false);
          navigate('/order-confirmation', { state: { order: data.order } });
        } catch (err) {
          setLoading(false);
          let msg = 'Order placement failed. Please contact support.';
          if (err.response && err.response.errors) {
            msg = err.response.errors.map(e => e.msg).join(', ');
          } else if (err.message) {
            msg = err.message;
          }
          setOrderError(msg);
        }
      };

      // Handle card payment with Razorpay
      const res = await loadRazorpayScript();
      if (!res) {
        setLoading(false);
        setOrderError('Razorpay SDK failed to load.');
        return;
      }
      // Create Razorpay order on backend
      try {
        const orderRes = await fetch(`${baseUrl}/payments/razorpay/order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: getCartTotal() * 100,
            currency: 'INR',
            notes: {
              email: backendAddress.email,
              name: backendAddress.name,
              phone: backendAddress.phone
            }
          })
        });
        if (!orderRes.ok) {
          let msg = 'Failed to create payment order';
          try {
            const err = await orderRes.json();
            if (err && err.error) msg = err.error;
          } catch { }
          throw new Error(msg);
        }
        const { order } = await orderRes.json();

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          order_id: order.id,
          name: 'Sri Design Jewellery',
          description: 'Order Payment',
          callback_url: window.location.origin + '/checkout',
          handler: async function (response) {
            try {
              const verifyRes = await fetch(`${baseUrl}/payments/razorpay/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(response)
              });
              if (!verifyRes.ok) {
                throw new Error('Payment verification failed');
              }
              await placeOrder('paid', response.razorpay_payment_id);
            } catch (verErr) {
              setLoading(false);
              setOrderError(verErr.message || 'Payment verification failed');
            }
          },
          prefill: {
            name: backendAddress.name,
            email: backendAddress.email,
            contact: backendAddress.phone
          },
          notes: {
            address: `${backendAddress.addressLine}, ${backendAddress.city}, ${backendAddress.state}, ${backendAddress.country}, ${backendAddress.pincode}`
          },
          theme: {
            color: '#6B2E2E'
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              setOrderError('Payment failed or was cancelled. Please try again.');
            }
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (payErr) {
        setLoading(false);
        setOrderError(payErr.message || 'Unable to initiate payment');
      }
    } catch (err) {
      setLoading(false);
      setOrderError('Order failed: ' + (err?.message || 'Unknown error'));
      console.error('Order placement error:', err);
    }
  };

  if (!isAuthenticated) return null;

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
          <div className="w-16 h-16 bg-secondary/30 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={24} />
          </div>
          <h2 className="font-serif text-2xl text-text-main mb-4">Your cart is empty</h2>
          <button onClick={() => navigate('/shop')} className="text-primary hover:underline">
            Create an order first
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl md:text-4xl text-text-main mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Form */}
          <div className="flex-1 space-y-8">

            {/* Shipping Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-xl border-l-4 border-primary pl-3">Shipping Address</h2>
                {user?.address && !editMode && (
                  <button onClick={() => setEditMode(true)} className="text-primary text-sm flex items-center gap-1 hover:underline">
                    <Edit2 size={14} /> Edit
                  </button>
                )}
              </div>

              {user?.address && !editMode ? (
                <div className="bg-secondary/10 p-4 rounded-lg border border-border">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-primary mt-1 flex-shrink-0" size={18} />
                    <div className="text-sm text-text-main space-y-1">
                      <p className="font-medium">{user.address.name || user.name}</p>
                      <p>{user.address.doorNo}, {user.address.landmark}</p>
                      <p>{[user.address.addressLine1, user.address.addressLine2].filter(Boolean).join(', ')}</p>
                      <p>{user.address.city}, {user.address.state} - {user.address.pincode}</p>
                      <p>{user.address.country}</p>
                      <p className="mt-2 text-text-muted">{user.mobile || user.phone}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium text-text-muted mb-1">Full Name *</label>
                    <input type="text" name="name" value={address.name} onChange={handleAddressChange} className="w-full p-2.5 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" required />
                    {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium text-text-muted mb-1">Email *</label>
                    <input type="email" name="email" value={address.email} onChange={handleAddressChange} className="w-full p-2.5 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" required />
                    {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium text-text-muted mb-1">Phone Number *</label>
                    <input type="text" name="phone" value={address.phone} onChange={handleAddressChange} className="w-full p-2.5 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" required />
                    {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium text-text-muted mb-1">Door No / Flat No *</label>
                    <input type="text" name="doorNo" value={address.doorNo} onChange={handleAddressChange} className="w-full p-2.5 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" required />
                    {errors.doorNo && <span className="text-xs text-red-500">{errors.doorNo}</span>}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-text-muted mb-1">Address Line 1 *</label>
                    <input type="text" name="addressLine1" value={address.addressLine1} onChange={handleAddressChange} className="w-full p-2.5 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Street, Colony, Area" required />
                    {errors.addressLine1 && <span className="text-xs text-red-500">{errors.addressLine1}</span>}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-text-muted mb-1">Address Line 2</label>
                    <input type="text" name="addressLine2" value={address.addressLine2} onChange={handleAddressChange} className="w-full p-2.5 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Apartment, Suite, etc. (Optional)" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium text-text-muted mb-1">Landmark *</label>
                    <input type="text" name="landmark" value={address.landmark} onChange={handleAddressChange} className="w-full p-2.5 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" required />
                    {errors.landmark && <span className="text-xs text-red-500">{errors.landmark}</span>}
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium text-text-muted mb-1">Pincode *</label>
                    <input type="text" name="pincode" value={address.pincode} onChange={handleAddressChange} className="w-full p-2.5 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" required />
                    {errors.pincode && <span className="text-xs text-red-500">{errors.pincode}</span>}
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium text-text-muted mb-1">City *</label>
                    <input type="text" name="city" value={address.city} onChange={handleAddressChange} className="w-full p-2.5 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" required />
                    {errors.city && <span className="text-xs text-red-500">{errors.city}</span>}
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium text-text-muted mb-1">State *</label>
                    <input type="text" name="state" value={address.state} onChange={handleAddressChange} className="w-full p-2.5 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" required />
                    {errors.state && <span className="text-xs text-red-500">{errors.state}</span>}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-text-muted mb-1">Country *</label>
                    <input type="text" name="country" value={address.country} onChange={handleAddressChange} className="w-full p-2.5 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" required />
                    {errors.country && <span className="text-xs text-red-500">{errors.country}</span>}
                  </div>

                  <div className="col-span-2 mt-2">
                    <label className="flex items-center gap-2 text-sm text-text-main cursor-pointer">
                      <input type="checkbox" checked={saveAddress} onChange={e => setSaveAddress(e.target.checked)} className="rounded text-primary focus:ring-primary" />
                      Save this address for future orders
                    </label>
                  </div>

                  {user?.address && (
                    <div className="col-span-2">
                      <button type="button" onClick={() => setEditMode(false)} className="text-sm text-text-muted hover:text-text-main underline">Cancel Edit</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="font-serif text-xl border-l-4 border-primary pl-3 mb-6">Payment Method</h2>
              <div className="border border-primary bg-primary/5 p-4 rounded-lg flex items-start gap-3">
                <CreditCard className="text-primary mt-1" size={20} />
                <div>
                  <h4 className="font-medium text-text-main">Pay via Razorpay</h4>
                  <p className="text-sm text-text-muted mt-1">Safely pay using Credit/Debit Card, UPI, NetBanking, or Wallet.</p>
                  <div className="flex gap-2 mt-3">
                    <div className="h-6 w-10 bg-white rounded border border-border flex items-center justify-center text-[10px] font-bold text-gray-400">VISA</div>
                    <div className="h-6 w-10 bg-white rounded border border-border flex items-center justify-center text-[10px] font-bold text-gray-400">MC</div>
                    <div className="h-6 w-10 bg-white rounded border border-border flex items-center justify-center text-[10px] font-bold text-gray-400">UPI</div>
                  </div>
                </div>
                <div className="ml-auto">
                  <div className="w-5 h-5 rounded-full border-4 border-primary"></div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-28">
              <h2 className="font-serif text-xl border-b border-border pb-4 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 bg-secondary/10 rounded flex-shrink-0 overflow-hidden">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-main line-clamp-1">{item.name}</p>
                      <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-text-main">₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pt-4 border-t border-border">
                <div className="flex justify-between text-text-muted text-sm">
                  <span>Subtotal</span>
                  <span>₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-text-muted text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-lg font-bold text-text-main mb-6 pt-4 border-t border-border">
                <span>Total</span>
                <span>₹{getCartTotal()}</span>
              </div>

              {orderError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
                  <ShieldCheck size={16} className="mt-0.5" />
                  {orderError}
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : `Pay ₹${getCartTotal()}`}
              </button>

              <div className="mt-6 flex flex-col gap-2 text-xs text-text-muted text-center">
                <div className="flex items-center justify-center gap-1">
                  <ShieldCheck size={12} /> Secure Checkout
                </div>
                <p>Your payment information is encrypted and secure.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;