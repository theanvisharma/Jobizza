import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { authApi } from '../api/auth';

const OAuthSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get('token');
      const oauthError = searchParams.get('error');

      if (oauthError) {
        navigate(`/login?error=${encodeURIComponent(oauthError)}`);
        return;
      }

      if (!token) {
        setError('Authentication failed. No token was received from the secure OAuth server.');
        setTimeout(() => navigate('/login'), 4000);
        return;
      }

      try {
        // Save token to local storage
        localStorage.setItem('jobizza_token', token);

        // Fetch user data to route them properly
        const response = await authApi.getMe();
        if (response.success && response.user) {
          const { user } = response;
          if (!user.profileComplete && user.role !== 'admin') {
            navigate('/complete-profile');
          } else {
            navigate('/');
          }
        } else {
          setError('Failed to fetch user profile.');
          setTimeout(() => navigate('/login'), 4000);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error occurred during secure authentication callback.');
        setTimeout(() => navigate('/login'), 4000);
      }
    };

    handleAuth();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 text-center">
        {error ? (
          <div className="space-y-4">
            <div className="inline-flex p-3 bg-rose-50 rounded-2xl text-rose-500 mb-2">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Authentication Error</h3>
            <p className="text-slate-400 text-sm">{error}</p>
            <p className="text-xs text-slate-300">Redirecting you back to login...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="inline-flex p-3 bg-sky-50 rounded-2xl text-sky-600 mb-2">
              <RefreshCw className="animate-spin" size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Authenticating</h3>
            <p className="text-slate-400 text-sm">Bouncing secure tokens and verifying credentials...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthSuccess;
