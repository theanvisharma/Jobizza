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
    <svg className="w-16 h-16 text-sky-600 mb-4" viewBox="0 0 74 74" fill="none" stroke="none">
      <path fill="currentColor" d="M71,47.6h-1.1V5H71c1.1,0,2-0.9,2-2s-0.9-2-2-2H3C1.9,1,1,1.9,1,3s0.9,2,2,2h1.1v42.6H3c-1.1,0-2,0.9-2,2 s0.9,2,2,2h32v4.7L19.4,69.5c-0.8,0.7-1,2-0.2,2.8c0.7,0.8,2,1,2.8,0.2l13.1-11v8.3c0,1.1,0.9,2,2,2s2-0.9,2-2v-8.3l13.1,11 c0.4,0.3,0.8,0.5,1.3,0.5c0.6,0,1.1-0.2,1.5-0.7c0.7-0.8,0.6-2.1-0.2-2.8L39,56.3v-4.7h32c1.1,0,2-0.9,2-2S72.1,47.6,71,47.6z M8.1,5H66v42.6H8.1V5z"/>
      <path fill="currentColor" d="M50.1,22.2c-0.6,0.9-0.3,2.2,0.7,2.7c0.3,0.2,0.7,0.3,1,0.3c0.7,0,1.3-0.3,1.7-1l5-8.2c0.3-0.5,0.4-1,0.2-1.5 c-0.1-0.5-0.5-1-0.9-1.2l-8.2-5C48.7,7.7,47.4,8,46.9,9c-0.6,0.9-0.3,2.2,0.7,2.7l3.9,2.3c-25.4,6.2-33.2,25.2-33.6,26 c-0.4,1,0.1,2.2,1.1,2.6c0.2,0.1,0.5,0.1,0.7,0.1c0.8,0,1.5-0.5,1.9-1.3c0.3-0.8,7.6-18.1,31.1-23.7L50.1,22.2z"/>
      <path fill="currentColor" d="M48.9,34.6c0-4.1-3.3-7.4-7.4-7.4s-7.4,3.3-7.4,7.4s3.3,7.4,7.4,7.4S48.9,38.6,48.9,34.6z M38.2,34.6 c0-1.9,1.5-3.4,3.4-3.4s3.4,1.5,3.4,3.4S43.5,38,41.6,38C39.7,37.9,38.2,36.4,38.2,34.6z"/>
      <path fill="currentColor" d="M19.7,25.2c1.1,0,2-0.9,2-2v-2.9h2.9c1.1,0,2-0.9,2-2s-0.9-2-2-2h-2.9v-2.9c0-1.1-0.9-2-2-2s-2,0.9-2,2v2.9 h-2.9c-1.1,0-2,0.9-2,2s0.9,2,2,2h2.9v2.9C17.7,24.3,18.6,25.2,19.7,25.2z"/>
    </svg>
  );

  // Icon: Scale Balance
  const BalanceIcon = () => (
    <svg className="w-16 h-16 text-sky-600 mb-4" viewBox="0 0 74 74" fill="none" stroke="none">
      <path fill="currentColor" d="M72.9,46.2L62,17.7h3.3c1.1,0,2-0.9,2-2s-0.9-2-2-2h-22c-0.6-2-2.3-3.6-4.3-4.3v-5c0-1.1-0.9-2-2-2s-2,0.9-2,2 v5c-2,0.6-3.6,2.3-4.3,4.3h-22c-1.1,0-2,0.9-2,2s0.9,2,2,2H12L1.1,46.2C1,46.4,1,46.7,1,46.9c0,5.2,1,8.6,3,10.6s4.7,2.2,7.4,2.2 c0.6,0,1.1,0,1.7,0c1.2,0,2.4,0,3.6,0c3.3,0.1,6.7,0.1,9.1-2.2c2-2,3-5.4,3-10.6c0-0.2,0-0.5-0.1-0.7L17.8,17.7h12.9 c0.6,2,2.3,3.6,4.3,4.3v45.7H20.8c-1.1,0-2,0.9-2,2s0.9,2,2,2h32.4c1.1,0,2-0.9,2-2s-0.9-2-2-2H39V22c2-0.6,3.6-2.3,4.3-4.3h12.9 L45.4,46.2c-0.1,0.2-0.1,0.5-0.1,0.7c0,5.2,1,8.6,3,10.6s4.7,2.2,7.4,2.2c0.6,0,1.1,0,1.7,0c1.2,0,2.4,0,3.6,0 c3.3,0.1,6.7,0.1,9.1-2.2c2-2,3-5.4,3-10.6C73,46.7,73,46.4,72.9,46.2z M14.9,21.3l9,23.6h-18L14.9,21.3z M16.8,55.8 c-1.2,0-2.6,0-3.8,0c-3.1,0.1-5,0-6.2-1.1c-1-1-1.5-2.9-1.7-5.8h19.6c-0.2,2.9-0.8,4.8-1.7,5.8C21.8,55.8,19.9,55.8,16.8,55.8z M37,18.3c-1.4,0-2.6-1.2-2.6-2.6s1.2-2.6,2.6-2.6l0,0l0,0c1.4,0,2.6,1.2,2.6,2.6S38.4,18.3,37,18.3z M59.1,21.3l9,23.6H50.2 L59.1,21.3z M61,55.8c-1.2,0-2.6,0-3.8,0c-3.1,0.1-5,0-6.2-1.1c-1-1-1.5-2.9-1.7-5.8h19.6c-0.2,2.9-0.8,4.8-1.7,5.8 C66.1,55.8,64.1,55.8,61,55.8z"/>
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
    <>
      <section
        id="home"
        className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center pt-36 pb-36 lg:pb-48 overflow-hidden bg-[url('/img/demos/business-consulting-3/backgrounds/new.jpg')] bg-cover bg-[center_right_-200px] lg:bg-right bg-no-repeat"
      >
        {/* Network Constellation Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
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
                <span className="bg-[url('/images/text-background.jpg')] bg-cover bg-clip-text text-transparent bg-center pr-2">
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

            {/* Right spacing to let background remain visible */}
            <div className="hidden lg:block lg:col-span-5 h-[200px]" />
          </div>
        </div>
      </section>

      {/* Sibling container overlapping shape divider layout */}
      <div className="relative z-20 -mt-24 lg:-mt-44 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <div className="w-full lg:w-7/12 flex flex-col items-center">
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
                      className="bg-white border border-slate-200/80 rounded-sm p-8 text-center shadow-2xl shadow-slate-900/10 hover:-translate-y-1 transition-transform duration-350 flex flex-col items-center justify-center min-h-[300px]"
                    >
                      {card.icon}
                      <img src="/fonts/infinite-crooked-line.svg" alt="divider" className="w-[154px] h-[26px] my-3" />
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
            <div className="flex gap-2.5 mt-8">
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
    </>
  );
};

export default Hero;
