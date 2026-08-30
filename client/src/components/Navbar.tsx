import React, { useState, useEffect } from 'react';
import { Mail, Menu, X, ChevronDown, LogIn, LogOut, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onNavigate: (view: string) => void;
  user?: any;
  onLogout?: () => void;
}

interface DropdownItem {
  name: string;
  href?: string;
  viewId?: string;
}

interface NavLinkItem {
  name: string;
  href: string;
  dropdown?: DropdownItem[];
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, user, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: NavLinkItem[] = [
    {
      name: 'Workforce Solutions',
      href: '#services',
      dropdown: [
        { name: 'Permanent Staffing', viewId: 'permanent-staffing' },
        { name: 'Flexible Staffing', viewId: 'flexible-staffing' },
        { name: 'Strategic Capability Scaling', viewId: 'strategic-capability-scaling' },
        { name: 'Training & Development', viewId: 'training-development' },
      ],
    },
    {
      name: 'Digital Transformation',
      href: '#services',
      dropdown: [
        { name: 'Web Development', href: '#services' },
        { name: 'Mobile Application Development', href: '#services' },
        { name: 'Digital Marketing', href: '#services' },
        { name: 'Managed Services', href: '#services' },
        { name: 'Cloud Services', href: '#services' },
      ],
    },
    {
      name: 'About Us',
      href: '#about',
      dropdown: [
        { name: 'Join Our Team', href: '#about' },
        { name: 'Event & Blog', href: '#about' },
      ],
    },
    {
      name: 'Contact Us',
      href: '#contact',
    },
  ];

  const handleMobileDropdownToggle = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (activeMobileDropdown === name) {
      setActiveMobileDropdown(null);
    } else {
      setActiveMobileDropdown(name);
    }
  };

  const handleLinkClick = (e: React.MouseEvent, href?: string, viewId?: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (viewId) {
      onNavigate(viewId);
    } else if (href) {
      if (href.startsWith('/')) {
        navigate(href);
      } else {
        onNavigate('home');
        // If there is an anchor, scroll to it after switching back to home
        if (href.startsWith('#')) {
          setTimeout(() => {
            const el = document.querySelector(href);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }, 120);
        }
      }
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-45 flex flex-col transition-all duration-300">
        {/* Top Info Bar (with diagonal slant) */}
        <div className="bg-slate-900 border-b border-slate-800 text-xs w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-start">
            <div
              className="bg-sky-600 text-white px-8 py-2.5 relative flex items-center gap-2 font-medium"
              style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)' }}
            >
              <Mail size={14} className="text-sky-100" />
              <span>info@jobizzatech.com</span>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav
          className={`w-full transition-all duration-300 ${
            isScrolled ? 'glass-navbar py-2 shadow-lg' : 'bg-slate-950/80 backdrop-blur-sm py-4'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Logo Area */}
              <a
                href="#home"
                onClick={(e) => handleLinkClick(e, '#home')}
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-sky-600 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tight text-white leading-none">
                    JOBIZZA
                  </span>
                  <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest leading-none mt-0.5">
                    Technologies
                  </span>
                  <span className="text-[8px] font-semibold text-slate-500 tracking-tight leading-none mt-0.5">
                    Smart Tech Teams. On Demand
                  </span>
                </div>
              </a>

              {/* Navigation Links with Hover Dropdowns */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <div key={link.name} className="relative group py-2">
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="text-sm font-semibold text-slate-300 hover:text-sky-400 transition-colors flex items-center gap-1"
                    >
                      {link.name}
                      {link.dropdown && <ChevronDown size={14} className="text-slate-400 group-hover:text-sky-400 group-hover:rotate-180 transition-all" />}
                    </a>

                    {/* Hover Dropdown Card */}
                    {link.dropdown && (
                      <div className="absolute top-[100%] left-0 w-[240px] bg-white border border-slate-200 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 border-t-[3px] border-t-sky-500 rounded-sm">
                        <ul className="flex flex-col">
                          {link.dropdown.map((sub, sidx) => (
                            <li key={sidx} className={sidx > 0 ? 'border-t border-slate-100' : ''}>
                              <a
                                href={sub.viewId ? '#' : sub.href}
                                onClick={(e) => handleLinkClick(e, sub.href, sub.viewId)}
                                className="block px-6 py-3.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-sky-600 transition-all font-semibold"
                              >
                                {sub.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Side Actions Container */}
              <div className="flex items-center gap-4">
                {/* Dynamic Auth Button/Dropdown (Visible on all viewports) */}
                <div>
                  {!user ? (
                    <button
                      onClick={() => navigate('/login')}
                      className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all text-xs sm:text-sm shadow-md"
                    >
                      <LogIn size={14} className="sm:w-4 sm:h-4" />
                      <span>Login</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      {/* Pill Card */}
                      <button
                        onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}
                        className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-2xl p-1 px-3 hover:bg-slate-50 transition-all cursor-pointer font-bold text-slate-800"
                      >
                        {/* Rounded square avatar */}
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-rose-700 text-white font-black text-sm overflow-hidden shrink-0">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{user.name ? user.name[0].toUpperCase() : 'A'}</span>
                          )}
                        </div>
                        {/* Grid Icon */}
                        <LayoutGrid size={16} className="text-slate-500" />
                        {/* Dashboard Text */}
                        <span className="text-xs sm:text-sm tracking-tight text-[#1e293b]">Dashboard</span>
                      </button>

                      {/* LogOut button */}
                      <button
                        onClick={onLogout}
                        className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                        title="Sign Out"
                      >
                        <LogOut size={18} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-slate-300 hover:text-white focus:outline-none"
                  >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[100px] z-30 glass-navbar md:hidden p-6 border-b border-slate-800 shadow-xl max-h-[80vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <div key={link.name} className="flex flex-col">
                  {link.dropdown ? (
                    <>
                      <button
                        onClick={(e) => handleMobileDropdownToggle(link.name, e)}
                        className="text-left text-base font-semibold text-slate-300 hover:text-sky-400 transition-colors flex justify-between items-center w-full"
                      >
                        {link.name}
                        <ChevronDown size={18} className={`transition-transform ${activeMobileDropdown === link.name ? 'rotate-180 text-sky-400' : 'text-slate-500'}`} />
                      </button>
                      
                      {/* Expanded Mobile List */}
                      {activeMobileDropdown === link.name && (
                        <div className="pl-4 mt-2 border-l border-slate-800 space-y-2.5 flex flex-col">
                          {link.dropdown.map((sub, sidx) => (
                            <a
                              key={sidx}
                              href="#"
                              onClick={(e) => handleLinkClick(e, sub.href, sub.viewId)}
                              className="text-sm font-medium text-slate-400 hover:text-sky-400 transition-colors py-1"
                            >
                              {sub.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="text-base font-semibold text-slate-300 hover:text-sky-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Auth Actions */}
            <div className="border-t border-slate-800 pt-4 mt-4">
              {!user ? (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}
                  className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all text-sm w-full"
                >
                  <LogIn size={16} />
                  Login to Portal
                </button>
              ) : (
                <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-rose-700 text-white font-bold text-sm overflow-hidden shrink-0">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{user.name ? user.name[0].toUpperCase() : 'A'}</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200 leading-tight">{user.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium capitalize mt-0.5">{user.role}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); navigate(user.role === 'admin' ? '/admin' : '/dashboard'); }}
                      className="p-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition-all"
                      title="Dashboard"
                    >
                      <LayoutGrid size={16} />
                    </button>
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); onLogout?.(); }}
                      className="p-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all"
                      title="Sign Out"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
