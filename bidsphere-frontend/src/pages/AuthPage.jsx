import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Gavel, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  CheckCircle2, 
  UserCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function AuthPage({ defaultMode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, register, switchDemoRole } = useAuth();
  const { addToast } = useNotifications();

  const [mode, setMode] = useState(defaultMode); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('BIDDER'); // 'BIDDER' | 'SELLER'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(true);

  const from = location.state?.from?.pathname || '/dashboard';

  // Sync mode when route/defaultMode changes (e.g. clicking between /login and /register)
  React.useEffect(() => {
    setMode(defaultMode);
    setError('');
  }, [defaultMode]);

  // If already logged in, redirect straight to user's dashboard
  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (!email || !password) {
        setError('Please provide your registered email and password.');
        return;
      }

      setLoading(true);
      try {
        await login(email, password);
        addToast({
          type: 'success',
          title: 'Welcome Back',
          message: 'You have signed in to your BidSphere account.'
        });
        navigate(from, { replace: true });
      } catch (err) {
        setError(err.message || 'Invalid email or password.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!name || !email || !password) {
        setError('Please fill in your name, email, and password.');
        return;
      }

      if (!agreed) {
        setError('Please agree to the Terms of Participation.');
        return;
      }

      setLoading(true);
      try {
        await register(name, email, password, phone, role);
        addToast({
          type: 'success',
          title: 'Account Created',
          message: `Welcome to BidSphere, ${name}! Your account is active.`
        });
        navigate('/dashboard', { replace: true });
      } catch (err) {
        setError(err.message || 'Registration failed. Please check your information.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDemoLogin = (roleKey) => {
    switchDemoRole(roleKey);
    addToast({
      type: 'info',
      title: 'Demo Session Active',
      message: `Signed in as Demo ${roleKey.charAt(0).toUpperCase() + roleKey.slice(1).toLowerCase()}.`
    });
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#f5ede2] via-[#ede3d5] to-[#dfceb7] border border-[#c5a059]/40 flex items-center justify-center text-[#8a7258] shadow-sm group-hover:scale-105 transition-transform">
            <Gavel size={20} className="text-[#8a7258] stroke-[2.2]" />
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="font-serif font-black text-xl tracking-[0.18em] text-[#1c1815]">
              BID<span className="text-[#d95c2e]">SPHERE</span>
            </span>
            <span className="text-[8px] uppercase tracking-[0.22em] font-semibold text-[#8e8576] mt-1">
              HERITAGE AUCTIONEERS
            </span>
          </div>
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-[#1c1815] tracking-tight font-serif">
          {mode === 'login' ? 'Sign in to BidSphere' : 'Create your BidSphere Account'}
        </h2>
        <p className="mt-1 text-xs text-[#8e8576]">
          India's Premier Institutional Live Auction Marketplace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-stone-900/5 sm:rounded-2xl sm:px-10 border border-[#E2D9C8]">
          
          {/* Tab Selector: Sign In vs Register */}
          <div className="grid grid-cols-2 p-1 bg-[#F4EFE6] rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-white text-[#1c1815] shadow-xs'
                  : 'text-stone-500 hover:text-[#1c1815]'
              }`}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-white text-[#1c1815] shadow-xs'
                  : 'text-stone-500 hover:text-[#1c1815]'
              }`}
            >
              <UserPlus size={14} />
              <span>Create Account</span>
            </button>
          </div>

          {/* Quick Demo Testing Persona Switcher */}
          <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <UserCheck size={13} className="text-amber-600" />
              <span>Instant Demo Access</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('BIDDER')}
                className="py-1.5 px-2 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
              >
                Bidder
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('SELLER')}
                className="py-1.5 px-2 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
              >
                Seller
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('ADMIN')}
                className="py-1.5 px-2 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
              >
                Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                {/* Role Switcher */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    I want to participate as:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('BIDDER')}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        role === 'BIDDER'
                          ? 'border-navy-900 bg-navy-50/60 ring-2 ring-navy-900/10'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">Bidder</span>
                        {role === 'BIDDER' && <CheckCircle2 className="w-3.5 h-3.5 text-navy-900" />}
                      </div>
                      <p className="text-[10px] text-slate-500">Collect & bid in real-time</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('SELLER')}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        role === 'SELLER'
                          ? 'border-navy-900 bg-navy-50/60 ring-2 ring-navy-900/10'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">Seller / Consignor</span>
                        {role === 'SELLER' && <CheckCircle2 className="w-3.5 h-3.5 text-navy-900" />}
                      </div>
                      <p className="text-[10px] text-slate-500">List lots & manage escrow</p>
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="auth-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="auth-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Vikram Malhotra"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white transition"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vikram@example.com"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="auth-password" className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                {mode === 'login' && (
                  <span className="text-xs text-slate-400">
                    (Use demo button above for quick login)
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="auth-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number (Optional, for SMS outbid alerts)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white transition"
                  />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div className="flex items-start pt-1">
                <input
                  id="terms-auth"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-navy-900 focus:ring-navy-600 cursor-pointer"
                />
                <label htmlFor="terms-auth" className="ml-2 block text-xs text-slate-600 cursor-pointer">
                  I agree to BidSphere Escrow Rules and Fair-Auction Terms.
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#d95c2e] via-[#e26433] to-[#eb6f3a] hover:brightness-110 active:scale-95 text-white font-bold text-sm shadow-md shadow-orange-950/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Free Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit SSL encrypted institutional security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
