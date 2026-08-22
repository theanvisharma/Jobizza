import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroProps {
  onContactClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onContactClick }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-play carousel slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Icon: Chart presentation
  const ChartIcon = () => (
    <svg className="w-16 h-16 text-sky-600 mx-auto mb-4" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5">
      <rect x="12" y="16" width="40" height="28" rx="2" />
      <path d="M20 44v8m24-8v8m-14-8v8M6 52h52" />
      <path d="M18 36l8-8 8 6 10-10" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="44" cy="24" r="2" fill="currentColor" />
    </svg>
  );

  // Icon: Scale Balance
  const BalanceIcon = () => (
    <svg className="w-16 h-16 text-sky-600 mx-auto mb-4" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M32 8v44M12 52h40" />
      <path d="M16 20h32" />
      <path d="M22 20l-4 16h8l-4-16zM42 20l-4 16h8l-4-16z" strokeLinejoin="round" />
    </svg>
  );

  const slidesData = [
    [
      {
        title: 'Scalable Solutions',
        desc: 'Adapt effortlessly with scalable solutions for flexible staffing and technology.',
        icon: <ChartIcon />,
      },
      {
        title: 'Dedicated Support',
        desc: 'Get personalized assistance from a dedicated support team, ensuring smooth operations.',
        icon: <BalanceIcon />,
      },
    ],
    [
      {
        title: 'Cost Efficiency',
        desc: 'Achieve high ROI with cost-efficient solutions that deliver quality while minimizing expenses.',
        icon: <BalanceIcon />,
      },
      {
        title: 'Scalable Solutions',
        desc: 'Adapt effortlessly with scalable solutions for flexible staffing and technology.',
        icon: <ChartIcon />,
      },
    ],
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-36 pb-20 overflow-hidden bg-sky-200/40"
    >
      {/* Network Constellation Overlay */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <svg className="w-full h-full text-sky-400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="network-dots" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="1.5" fill="currentColor" />
              <line x1="40" y1="40" x2="120" y2="40" stroke="currentColor" strokeWidth="0.5" />
              <line x1="40" y1="40" x2="40" y2="120" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#network-dots)" />
        </svg>
      </div>

      {/* Decorative Diagonal Bottom Cut */}
      <div
        className="absolute bottom-0 left-0 w-full h-24 bg-white pointer-events-none"
        style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 80%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] select-none">
              <span className="bg-[url('/images/developers.png')] bg-cover bg-clip-text text-transparent bg-center pr-2">
                Accelerate
              </span>
              Niche Capability.
            </h1>

            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed max-w-xl font-medium">
              We specialize in high-density GenAI, SRE, and Cloud hiring, helping you scale niche capabilities for global R&D and digital programs.
            </p>

            <p className="text-sm font-semibold text-slate-600 tracking-tight">
              Start Your Transformation | Discover How We Can Help
            </p>

            <div>
              <button
                onClick={onContactClick}
                className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-base px-8 py-3.5 rounded-sm transition-all duration-300 shadow-md shadow-sky-950/10"
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* Right Cards Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full relative min-h-[340px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full"
                >
                  {slidesData[activeSlide].map((card, index) => (
                    <div
                      key={index}
                      className="bg-white border border-slate-200/80 rounded-sm p-8 text-center shadow-lg shadow-sky-900/5 hover:-translate-y-1 transition-transform duration-350 flex flex-col items-center justify-center min-h-[300px]"
                    >
                      {card.icon}
                      <h3 className="text-xl font-bold text-sky-950 mb-2">
                        {card.title}
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed font-medium">
                        "{card.desc}"
                      </p>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Dots */}
            <div className="flex gap-2.5 mt-8 z-10">
              {slidesData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeSlide === index ? 'bg-slate-700 scale-110' : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
