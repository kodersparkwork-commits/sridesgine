import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { Mail, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function Login() {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const { login, isAuthenticated } = useAuth();
  const { addToWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = localStorage.getItem('redirectPath') || '/';
      localStorage.removeItem('redirectPath');
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handlePostLoginActions = () => {
    // Handle pending wishlist item
    const pendingWishlistItem = localStorage.getItem('pendingWishlistItem');
    if (pendingWishlistItem) {
      try {
        const product = JSON.parse(pendingWishlistItem);
        addToWishlist(product);
        localStorage.removeItem('pendingWishlistItem');
      } catch (error) {
        console.error('Error adding pending wishlist item:', error);
      }
    }

    // Handle pending cart item
    const pendingCartItem = localStorage.getItem('pendingCartItem');
    if (pendingCartItem) {
      try {
        const product = JSON.parse(pendingCartItem);
        addToCart(product);
        localStorage.removeItem('pendingCartItem');
      } catch (error) {
        console.error('Error adding pending cart item:', error);
      }
    }
  };

  const post = async (path, body) => {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  };

  const requestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Try to send OTP via backend
      const response = await post('/auth/request-otp', { email });
      setStep('otp');

      if (response.fallback) {
        // Auto-fill OTP when fallback is used
        setCode(response.autoFillCode || '123456');
        setMessage('⚠️ Email service temporarily unavailable. Using demo OTP.');
      } else {
        setMessage('OTP sent to your email.');
      }
    }
    catch (err) {
      if (err && err.message && err.message.includes('Valid email')) {
        setMessage('Please enter a valid email address.');
      } else {
        // Fallback for network errors - still allow demo mode
        setStep('otp');
        setCode('123456');
        setMessage('⚠️ Service unavailable. Demo OTP (123456) filled.');
      }
    }
    finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Try backend verification first
      const r = await post('/auth/verify-otp', { email, code });

      login({ email: r.user.email, ...r.user });
      handlePostLoginActions();
      setMessage(`Welcome, ${r.user.email}`);
      setStep('done');

      setTimeout(() => {
        const redirectPath = localStorage.getItem('redirectPath') || '/';
        localStorage.removeItem('redirectPath');
        navigate(redirectPath, { replace: true });
      }, 1500);
    }
    catch (err) {
      if (err && err.message && err.message.includes('Email and code')) {
        setMessage('Please enter both email and OTP code.');
      } else if (err && err.message && err.message.includes('Valid email')) {
        setMessage('Please enter a valid email address.');
      } else {
        // Demo mode fallback - accept "123456" as valid OTP
        if (code === '123456') {
          login({ email, name: email.split('@')[0] });
          handlePostLoginActions();
          setMessage(`Welcome, ${email}`);
          setStep('done');
          setTimeout(() => {
            const redirectPath = localStorage.getItem('redirectPath') || '/';
            localStorage.removeItem('redirectPath');
            navigate(redirectPath, { replace: true });
          }, 1500);
        } else {
          setMessage('Invalid OTP. Use "123456" for demo or check your email.');
        }
      }
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const resend = async () => {
    setLoading(true); setMessage('');
    try {
      await post('/auth/resend-otp', { email });
      setMessage('OTP resent.');
      setResendCooldown(30);
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 transform transition-all">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl text-primary font-bold mb-2">Welcome Back</h2>
          <p className="text-text-muted text-sm">Sign in to access your account</p>
        </div>

        {step === 'email' && (
          <form onSubmit={requestOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
            </div>
            <button
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Send OTP <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={verifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">One-Time Password</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-center text-lg tracking-widest transition-all"
                required
              />
              <p className="text-xs text-text-muted mt-2 text-center">
                Sent to <span className="font-medium text-text-main">{email}</span>. Check Spam/Junk.
              </p>
            </div>
            <div className="space-y-3">
              <button
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify & Login'}
              </button>
              <button
                type="button"
                onClick={resend}
                disabled={loading || resendCooldown > 0}
                className="w-full text-sm text-text-muted hover:text-primary transition-colors disabled:opacity-50"
              >
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </div>
          </form>
        )}

        {step === 'done' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-medium text-text-main">Login Successful</h3>
            <p className="text-text-muted mt-2">Redirecting you...</p>
          </div>
        )}

        {message && step !== 'done' && (
          <div className={`mt-6 p-4 rounded-xl text-sm flex items-start gap-3 ${message.includes('Welcome') ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
