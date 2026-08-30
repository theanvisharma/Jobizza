import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, MapPin, Globe, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { authApi } from '../api/auth';

const CompleteProfile: React.FC = () => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load current user name if available
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authApi.getMe();
        if (data.success && data.user) {
          setName(data.user.name || '');
          if (data.user.profileComplete) {
            // Profile is already complete, redirect to home
            navigate('/');
          }
        }
      } catch (err) {
        // Token might be invalid, redirect to login
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !position || !city || !pincode || !linkedin) {
      setError('Please fill in all the required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authApi.completeProfile({
        name,
        company,
        position,
        city,
        pincode,
        linkedin,
        dob: dob || undefined,
      });

      if (response.success) {
        // Successfully onboarded, redirect to dashboard/home
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-sky-50 rounded-2xl text-sky-600 mb-4">
            <User size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Complete Your Onboarding</h2>
          <p className="text-slate-400 text-sm mt-2">
            Just a few more details before we verify your membership and grant access to the platform.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl flex items-start gap-3 text-rose-700 text-sm">
            <AlertCircle className="shrink-0 mt-0.5" size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                Date of Birth (Optional)
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                Company
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  placeholder="Enterprise Inc."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
            </div>

            {/* Position */}
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                Position / Job Title
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  placeholder="Software Architect"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                City
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  placeholder="Pune"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                Pincode / Postal Code
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  placeholder="411001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* LinkedIn Profile */}
          <div>
            <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              LinkedIn Profile URL
            </label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="url"
                required
                placeholder="https://linkedin.com/in/yourprofile"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl shadow-lg shadow-sky-600/10 hover:shadow-sky-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : 'Complete Registration'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default CompleteProfile;
