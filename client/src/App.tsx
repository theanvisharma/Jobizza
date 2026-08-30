import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import ClientLogos from './components/ClientLogos';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import Industries from './components/Industries';
import ServiceDetail from './components/ServiceDetail';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import Login from './components/Login';
import CompleteProfile from './components/CompleteProfile';
import AdminDashboard from './components/AdminDashboard';
import OAuthSuccess from './components/OAuthSuccess';
import Team from './components/Team';
import MemberDashboard from './components/MemberDashboard';
import Testimonials from './components/Testimonials';
import { authApi } from './api/auth';
import { Clock, AlertTriangle, CheckCircle, LogOut } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginAlert, setLoginAlert] = useState<string | null>(null);
  
  // User auth state
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleOpenStaffingModal = () => {
    setIsModalOpen(true);
  };

  // Load User authentication status
  const checkUserAuth = async () => {
    const token = localStorage.getItem('jobizza_token');
    if (!token) {
      setUser(null);
      setAuthLoading(false);
      return;
    }
    
    try {
      const data = await authApi.getMe();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        localStorage.removeItem('jobizza_token');
        setUser(null);
      }
    } catch (err) {
      localStorage.removeItem('jobizza_token');
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    checkUserAuth();
  }, [location.pathname]); // Re-verify auth state on path change

  // Check LinkedIn OAuth redirect token from search params (for backward compatibility if redirect is direct)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('jobizza_token', token);
      window.history.replaceState({}, document.title, window.location.pathname);
      setLoginAlert('Successfully authenticated via LinkedIn Secure Auth!');
      checkUserAuth();
      setTimeout(() => setLoginAlert(null), 5000);
    }
  }, []);

  // Standard member logout
  const handleLogout = () => {
    authApi.logout();
    setUser(null);
    navigate('/');
  };

  // 1. Homepage Layout Component
  const HomepageLayout = () => {
    // Route protection inside the main homepage path:
    // If logged in, check profile complete and approval status
    if (user) {
      if (!user.profileComplete && user.role !== 'admin') {
        return <Navigate to="/complete-profile" replace />;
      }
      
      if (user.role !== 'admin') {
        if (user.status === 'pending') {
          return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 text-center space-y-6">
                <div className="inline-flex p-3 bg-amber-50 rounded-2xl text-amber-500">
                  <Clock size={28} className="animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Registration Pending</h3>
                <p className="text-slate-500 text-sm">
                  Hi <strong className="text-slate-700">{user.name}</strong>, your account profile has been successfully saved. It is currently under review by our administrator team.
                </p>
                <p className="text-xs text-slate-400">
                  We will send a status notification to <strong className="text-slate-500">{user.email}</strong> once your access is approved.
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all text-sm"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          );
        }

        if (user.status === 'rejected') {
          return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 text-center space-y-6">
                <div className="inline-flex p-3 bg-rose-50 rounded-2xl text-rose-500">
                  <AlertTriangle size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Registration Declined</h3>
                <p className="text-slate-500 text-sm">
                  We regret to inform you that your membership application has been declined at this time.
                </p>
                <p className="text-xs text-slate-400">
                  If you believe this is an error, please contact our support team.
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all text-sm"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          );
        }
      }
    }

    return (
      <div className="min-h-screen bg-white text-slate-900 relative">
        {/* Toast Alert */}
        {loginAlert && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-sm px-6 py-4 rounded-2xl shadow-2xl animate-bounce">
            <CheckCircle size={18} />
            <span>{loginAlert}</span>
          </div>
        )}

        {/* Global Navigation */}
        <Navbar onNavigate={handleNavigate} user={user} onLogout={handleLogout} />

        {/* Home vs Service Detail views */}
        {currentView === 'home' ? (
          <>
            {/* Hero Section */}
            <Hero onContactClick={handleOpenStaffingModal} />

            {/* About Us Section */}
            <AboutUs />

            {/* Client Partners Logos */}
            <ClientLogos />

            {/* Services (What We Do) */}
            <Services onContactClick={handleOpenStaffingModal} />

            {/* Why Us (Benefits) */}
            <WhyUs />

            {/* Industries Grid */}
            <Industries />

            {/* Testimonials Slider */}
            <Testimonials />

            {/* Dynamic Team Section */}
            <Team />
          </>
        ) : (
          <ServiceDetail pageId={currentView} onContactClick={handleOpenStaffingModal} />
        )}

        {/* Footer */}
        <Footer onNavigate={handleNavigate} />

        {/* Action Inquiry/Application Modal */}
        <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    );
  };

  if (authLoading && localStorage.getItem('jobizza_token')) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Homepage Route */}
      <Route path="/" element={<HomepageLayout />} />

      {/* Auth Routes */}
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />

      {/* Onboarding Route */}
      <Route
        path="/complete-profile"
        element={
          !localStorage.getItem('jobizza_token') ? (
            <Navigate to="/login" replace />
          ) : user && user.profileComplete ? (
            <Navigate to="/" replace />
          ) : (
            <CompleteProfile />
          )
        }
      />

      {/* Protected Admin Console Dashboard */}
      <Route
        path="/admin"
        element={
          !localStorage.getItem('jobizza_token') ? (
            <Navigate to="/login" replace />
          ) : user && user.role !== 'admin' ? (
            <Navigate to="/" replace />
          ) : (
            <AdminDashboard />
          )
        }
      />

      {/* Protected Member Dashboard */}
      <Route
        path="/dashboard"
        element={
          !localStorage.getItem('jobizza_token') ? (
            <Navigate to="/login" replace />
          ) : user && user.role === 'admin' ? (
            <Navigate to="/admin" replace />
          ) : (
            <MemberDashboard />
          )
        }
      />

      {/* Fallback Catch-all redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
