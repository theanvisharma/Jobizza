import { useState, useEffect } from 'react';
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
import type { JobItem } from './data/jobs';
import { CheckCircle } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [loginAlert, setLoginAlert] = useState<string | null>(null);

  // Monitor LinkedIn OAuth redirect parameter callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('jobizza_token', token);
      window.history.replaceState({}, document.title, window.location.pathname);
      setLoginAlert('Successfully authenticated via LinkedIn Secure Auth!');
      setTimeout(() => setLoginAlert(null), 5000);
    }
  }, []);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleOpenStaffingModal = () => {
    setSelectedJob(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 relative">
      {/* Toast Alert */}
      {loginAlert && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-sm px-6 py-4 rounded-2xl shadow-2xl animate-bounce">
          <CheckCircle size={18} />
          <span>{loginAlert}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar onNavigate={handleNavigate} />

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
        </>
      ) : (
        <ServiceDetail pageId={currentView} onContactClick={handleOpenStaffingModal} />
      )}

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Action Inquiry/Application Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedJob={selectedJob}
      />
    </div>
  );
}

export default App;
