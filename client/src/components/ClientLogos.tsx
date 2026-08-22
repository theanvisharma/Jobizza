import React from 'react';

const ClientLogos: React.FC = () => {
  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-16 md:gap-32">
          
          {/* thyssenkrupp Logo */}
          <div className="flex flex-col items-center group">
            <svg className="w-20 h-20 text-sky-400 group-hover:scale-105 transition-transform duration-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="50" cy="38" r="18" />
              <circle cx="39" cy="52" r="18" />
              <circle cx="61" cy="52" r="18" />
            </svg>
            <span className="text-sky-500 font-bold text-lg tracking-tight mt-2">
              thyssenkrupp
            </span>
          </div>

          {/* KNORR-BREMSE Logo */}
          <div className="flex items-center gap-4 group group-hover:scale-105 transition-transform duration-300">
            <div className="w-14 h-14 bg-sky-600/10 text-sky-700 rounded-full flex items-center justify-center border border-sky-600/20">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sky-800 font-black text-2xl tracking-tighter leading-none">
                KNORR-BREMSE
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
