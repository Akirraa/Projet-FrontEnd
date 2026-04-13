import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authLogin, authSignup } from '../services/api';
import { Mail, Lock, Eye, EyeOff, PackageSearch, CheckCircle, Copy, ArrowRight, Sparkles } from 'lucide-react';

const LoginSignup = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(null); // { email, generatedPassword }
  const [copied, setCopied] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authLogin(email, password);
      const { token, role, email: userEmail, userId } = res.data;
      login({ userId, email: userEmail, role }, token);
      // Redirect based on role
      if (role === 'ROLE_SUPER_ADMIN') navigate('/super-admin');
      else if (role === 'ROLE_ADMIN') navigate('/admin');
      else navigate('/client');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authSignup(email);
      setSignupSuccess({
        email: res.data.email,
        generatedPassword: res.data.generatedPassword,
        emailSent: res.data.emailSent,
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (signupSuccess?.generatedPassword) {
      navigator.clipboard.writeText(signupSuccess.generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // --- Success screen after signup ---
  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 text-center shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-500/20 p-5 rounded-3xl">
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Account Created!</h2>
          <p className="text-slate-400 mb-8 text-sm">
            Your account for <strong className="text-white">{signupSuccess.email}</strong> is ready.
            Save your temporary password below.
          </p>

          <div className="bg-white/10 rounded-2xl p-5 mb-6 border border-white/10">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Your Temporary Password</p>
            <div className="flex items-center justify-between gap-3">
              <code className="text-xl font-black text-indigo-300 tracking-wider break-all">
                {signupSuccess.generatedPassword}
              </code>
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all flex-shrink-0"
                title="Copy password"
              >
                {copied ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-slate-300" />}
              </button>
            </div>
          </div>

          <p className="text-amber-400 text-xs font-bold mb-8 bg-amber-400/10 rounded-xl px-4 py-3 border border-amber-400/20">
            {signupSuccess.emailSent
              ? '📧 A copy has been sent to your email. Change your password after first login.'
              : '⚠ Email notification could not be sent — save this password now before continuing.'}
          </p>

          <button
            onClick={() => { setMode('login'); setSignupSuccess(null); setEmail(signupSuccess.email); setPassword(''); }}
            className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all active:scale-95 shadow-xl shadow-indigo-900"
          >
            Go to Login <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      {/* Ambient blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-900">
            <PackageSearch className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">
            Admin<span className="text-indigo-400">Hub</span>
          </span>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex bg-white/5 rounded-2xl p-1 mb-8">
            {['login', 'signup'].map(tab => (
              <button
                key={tab}
                onClick={() => { setMode(tab); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl font-black text-sm capitalize transition-all duration-200 ${
                  mode === tab
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'signup' ? 'Sign Up' : 'Log In'}
              </button>
            ))}
          </div>

          <h1 className="text-xl font-black text-white mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-slate-400 text-sm mb-7">
            {mode === 'login'
              ? 'Sign in to access your dashboard.'
              : 'Enter your email and we\'ll generate a password for you.'}
          </p>

          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-2xl py-4 pl-11 pr-4 text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all"
              />
            </div>

            {/* Password (login only) */}
            {mode === 'login' && (
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-2xl py-4 pl-11 pr-12 text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-rose-400 text-sm font-semibold">
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-3 text-indigo-300 text-xs font-semibold flex items-start gap-2">
                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
                A strong random password will be generated and shown to you instantly. A copy will also be sent to your email.
              </div>
            )}

            <button
              id="auth-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-black rounded-2xl transition-all active:scale-95 shadow-xl shadow-indigo-900 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
