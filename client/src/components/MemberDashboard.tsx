import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, CheckCircle, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { authApi } from '../api/auth';

const MemberDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authApi.getMe();
        if (response.success && response.user) {
          const u = response.user;
          setUser(u);
          
          // Route guard: If user is admin, redirect to admin console
          if (u.role === 'admin') {
            navigate('/admin');
            return;
          }
        } else {
          navigate('/login');
        }
      } catch (err) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      
      {/* Mini-header */}
      <header className="bg-sky-950 text-white py-4 px-8 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <User className="text-sky-400" size={24} />
          <h1 className="text-lg font-bold tracking-tight">Jobizza Member Hub</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-900/40 hover:bg-sky-900 border border-sky-800 hover:border-sky-700 text-sky-200 hover:text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all"
        >
          <LogOut size={13} />
          Logout
        </button>
      </header>

      {/* Main card */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 space-y-8 transition-all hover:shadow-2xl">
          
          {/* Welcome greeting */}
          <div className="text-center space-y-3">
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center text-sky-600 text-3xl font-bold uppercase border-2 border-sky-200">
                {user.name ? user.name[0] : 'U'}
              </div>
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Welcome back, {user.name}!
            </h2>
            <p className="text-slate-400 text-sm">
              We are delighted to have you as part of our premium technology community.
            </p>
          </div>

          {/* Account Details Box */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
              Profile Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">Email Address</p>
                <p className="font-semibold text-slate-700">{user.email}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">System Role</p>
                <p className="font-semibold text-sky-600 flex items-center gap-1">
                  <User size={14} />
                  {user.role === 'admin' ? 'Administrator' : 'General Member'}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">Account Status</p>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      user.status === 'accepted'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : user.status === 'rejected'
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}
                  >
                    {user.status === 'accepted' ? (
                      <CheckCircle size={12} />
                    ) : user.status === 'rejected' ? (
                      <AlertTriangle size={12} />
                    ) : (
                      <Clock size={12} className="animate-spin" />
                    )}
                    {user.status}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">Profile Completion</p>
                <p className={`font-semibold mt-1 text-xs ${user.profileComplete ? 'text-emerald-600' : 'text-amber-500'}`}>
                  {user.profileComplete ? 'Complete (All Details Added)' : 'Incomplete'}
                </p>
              </div>
            </div>
          </div>

          {/* Action details */}
          {user.status === 'accepted' ? (
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-start gap-3">
              <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-sm font-bold text-slate-800">Your Account is Active!</h4>
                <p className="text-slate-500 text-xs mt-1">
                  You now have access to general workforce resources, active listings, and community support.
                </p>
              </div>
            </div>
          ) : user.status === 'pending' ? (
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 flex items-start gap-3">
              <Clock className="text-amber-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-sm font-bold text-slate-800">Pending Review</h4>
                <p className="text-slate-500 text-xs mt-1">
                  An administrator is verifying your capability and profile details. Once accepted, you will receive full clearance.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 flex items-start gap-3">
              <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-sm font-bold text-slate-800">Access Restricted</h4>
                <p className="text-slate-500 text-xs mt-1">
                  Your application has been declined. Please reach out to support if you require verification adjustments.
                </p>
              </div>
            </div>
          )}

          {/* Quick Home navigation link */}
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <span>Return to Landing Page</span>
            <ArrowRight size={14} />
          </button>

        </div>
      </main>

      {/* Footer bar */}
      <footer className="py-4 border-t border-slate-100 bg-white text-center text-xs text-slate-400 font-bold tracking-widest uppercase">
        SECURE • PROFESSIONAL • VERIFIED
      </footer>

    </div>
  );
};

export default MemberDashboard;
