import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Shield, User, ArrowRight, RefreshCw, KeyRound, AlertCircle, ArrowLeft } from 'lucide-react';
import { authApi } from '../api/auth';

const Login: React.FC = () => {
  const [isAdminRole, setIsAdminRole] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [viewMode, setViewMode] = useState<'selection' | 'email' | 'otp'>('selection');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Handle OAuth error in url if any
  useEffect(() => {
    const oauthError = searchParams.get('error');
    if (oauthError) {
      setError(decodeURIComponent(oauthError));
    }
  }, [searchParams]);

  // Resend Timer Effect
  useEffect(() => {
    let interval: any;
    if (viewMode === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [viewMode, timer]);

  // Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const role = isAdminRole ? 'admin' : 'member';
      await authApi.loginManual(email, role);
      setViewMode('otp');
      setTimer(60);
      setCanResend(false);
      setSuccessMsg('Verification code sent to your email.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const role = isAdminRole ? 'admin' : 'member';
      const data = await authApi.verifyOtp(email, otp, role);
      if (data.success) {
        const { user } = data;
        if (!user.profileComplete && user.role !== 'admin') {
          navigate('/complete-profile');
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setError(null);
    setLoading(true);

    try {
      await authApi.resendOtp(email);
      setTimer(60);
      setCanResend(false);
      setSuccessMsg('A new verification code has been sent.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  // OAuth redirects (using base backend urls)
  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const roleParam = isAdminRole ? 'admin' : 'member';
    const adminEmailParam = isAdminRole ? '&email=theanvisharma@gmail.com' : '';
    window.location.href = `${backendUrl}/auth/google?role=${roleParam}${adminEmailParam}`;
  };

  const handleLinkedInLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const roleParam = isAdminRole ? 'admin' : 'member';
    const adminEmailParam = isAdminRole ? '&email=theanvisharma@gmail.com' : '';
    window.location.href = `${backendUrl}/auth/linkedin?role=${roleParam}${adminEmailParam}`;
  };

  const roleText = isAdminRole ? 'Admin' : 'Member';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 transition-all duration-300">
        
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Welcome to Jobizza</h2>
            <p className="text-slate-400 text-sm mt-1">Select your role and sign in</p>
          </div>

          {/* Feedback alerts */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl flex items-start gap-3 text-rose-700 text-sm animate-fade-in">
              <AlertCircle className="shrink-0 mt-0.5" size={16} />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl text-emerald-700 text-sm">
              {successMsg}
            </div>
          )}

          {/* Segmented Toggle Control (User vs Shield) */}
          {viewMode === 'selection' && (
            <div className="space-y-6">
              <div className="p-1 bg-slate-100 rounded-2xl flex relative">
                <button
                  onClick={() => setIsAdminRole(false)}
                  className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 rounded-xl transition-all ${
                    !isAdminRole
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <User size={14} />
                  Member
                </button>
                <button
                  onClick={() => setIsAdminRole(true)}
                  className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 rounded-xl transition-all ${
                    isAdminRole
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Shield size={14} />
                  Admin
                </button>
              </div>

              {/* Dynamic Tab Subtext */}
              <p className="text-slate-400 text-xs text-center italic min-h-[32px] px-2">
                {!isAdminRole
                  ? 'Members get access to events, knowledge hub & the HR community.'
                  : 'Admins manage workforce listings, credentials, and user access.'}
              </p>

              {/* OAuth buttons */}
              <div className="space-y-3">
                {/* LinkedIn Button */}
                <button
                  onClick={handleLinkedInLogin}
                  className="w-full py-3.5 bg-[#0A66C2] hover:bg-[#0956a3] text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all text-sm shadow-md"
                >
                  <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  Continue as {roleText} with LinkedIn
                </button>

                {/* Google Button */}
                <button
                  onClick={handleGoogleLogin}
                  className="w-full py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-3 transition-all text-sm shadow-sm"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.62 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.87 3C6.22 7.56 8.87 5.04 12 5.04z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.98 3.7-8.62z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.26 14.44a6.99 6.99 0 0 1 0-4.88l-3.87-3a11.96 11.96 0 0 0 0 10.88l3.87-3z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.73-2.89c-1.04.7-2.38 1.11-4.23 1.11-3.13 0-5.78-2.52-6.74-5.52l-3.87 3C3.37 20.33 7.35 23 12 23z"
                    />
                  </svg>
                  Continue as {roleText} with Google
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-6">
                <hr className="w-full border-slate-100" />
                <span className="absolute bg-white px-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                  or
                </span>
              </div>

              {/* Email Fallback */}
              <button
                onClick={() => setViewMode('email')}
                className="w-full py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-2xl flex items-center justify-center gap-2.5 transition-all text-sm"
              >
                <Mail size={16} />
                Continue with Email
              </button>
            </div>
          )}

          {/* Email input step */}
          {viewMode === 'email' && (
            <div className="space-y-6">
              <button
                onClick={() => setViewMode('selection')}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 font-bold transition-all"
              >
                <ArrowLeft size={14} />
                Back to Sign In options
              </button>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      required
                      placeholder={isAdminRole ? 'admin@jobizzatech.com' : 'you@example.com'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl shadow-lg shadow-sky-600/10 hover:shadow-sky-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={18} />
                  ) : (
                    <>
                      Send Secure OTP Code
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* OTP verify step */}
          {viewMode === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                  Enter 6-Digit Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 font-mono tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  Sent to <strong className="text-slate-600">{email}</strong>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl shadow-lg shadow-sky-600/10 hover:shadow-sky-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin" size={18} /> : 'Verify Code & Sign In'}
              </button>

              <div className="text-center">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-sm font-semibold text-sky-600 hover:text-sky-700 hover:underline"
                  >
                    Resend verification code
                  </button>
                ) : (
                  <span className="text-xs text-slate-400">
                    Resend code in <strong className="text-slate-500">{timer}s</strong>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setViewMode('email')}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                Change Email Address
              </button>
            </form>
          )}

          {/* Footer Subtext */}
          <div className="mt-8 border-t border-slate-100 pt-5 text-center">
            <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">
              SECURE • PROFESSIONAL • VERIFIED
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
