import React from 'react';

interface FooterProps {
  onNavigate?: (view: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('home');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
    } else {
      window.location.hash = href;
    }
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 relative z-10 text-slate-800 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Banner */}
        <div className="mb-12 border-b border-slate-200 pb-8">
          <h2 className="text-3xl font-extrabold text-slate-400/60 uppercase tracking-widest leading-none">
            JOBIZZA TECHNOLOGIES
          </h2>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12 items-start">
          
          {/* Column 1: Info & Description */}
          <div className="lg:col-span-4 space-y-4">
            <a
              href="#home"
              onClick={(e) => handleLinkClick(e, '#home')}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-slate-900 leading-none">
                  JOBIZZA
                </span>
                <span className="text-[9px] font-bold text-sky-600 uppercase tracking-widest leading-none mt-0.5">
                  Technologies
                </span>
              </div>
            </a>
            
            <p className="text-slate-500 text-xs leading-relaxed max-w-sm font-medium">
              Jobizza Technologies, based in Pune, supports clients globally with innovative technology solutions and expert staffing services. Our local expertise and international reach ensure we meet diverse needs with excellence and reliability.
            </p>
            
            {/* LinkedIn Icon */}
            <div className="pt-2">
              <a href="#" className="inline-flex items-center justify-center w-8 h-8 rounded bg-sky-700 hover:bg-sky-800 text-white transition-colors shadow-sm" aria-label="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Contact Info */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-slate-400 font-bold text-xs uppercase tracking-wider">
              Contact Info
            </h4>
            <div className="space-y-3 text-xs text-slate-500 font-semibold leading-relaxed">
              <a href="mailto:info@jobizzatech.com" className="text-sky-600 hover:underline block">
                info@jobizzatech.com
              </a>
              <p>
                2nd Floor, Plot 32, JK Infotech-02, Monarch Workspace, Rajiv Gandhi Infotech Park, Hinjewadi Phase 1, Pune, Maharashtra 411057
              </p>
            </div>
          </div>

          {/* Column 3: Interactive Maps Embed */}
          <div className="lg:col-span-3">
            <div className="w-full h-[140px] rounded-sm overflow-hidden border border-slate-200 shadow-sm relative group">
              <iframe
                title="Jobizza Technologies Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.4729094056345!2d73.72996967520625!3d18.597732282512146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bbc100000001%3A0xb30438cf15d31cb0!2sHinjawadi%20Phase%201%20Road%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1713000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Column 4: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-slate-400 font-bold text-xs uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleLinkClick(e, '#about')}
                  className="hover:text-sky-600 transition-colors"
                >
                  Digital Transformation
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={(e) => handleLinkClick(e, '#services')}
                  className="hover:text-sky-600 transition-colors"
                >
                  Workforce Solutions
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleLinkClick(e, '#about')}
                  className="hover:text-sky-600 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleLinkClick(e, '#contact')}
                  className="hover:text-sky-600 transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Panel Copyright */}
        <div className="border-t border-slate-200 pt-8 mt-8 text-center text-xs font-semibold text-slate-400">
          <p>Jobizza Technologies © 2025. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
