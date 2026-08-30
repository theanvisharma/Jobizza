import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface TestimonialItem {
  quote: string;
  author: string;
}

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials: TestimonialItem[] = [
    {
      quote: "Jobizza Technologies has been a game-changer for us. They really understand what we need and always find top talent quickly, which keeps our projects on track.",
      author: "VP of Technology, Financial Services",
    },
    {
      quote: "Jobizza Technologies’s digital transformation solutions have truly transformed how we operate. Their fresh ideas and hands-on approach have made a real difference in our efficiency and growth.",
      author: "Director of Operations, IT",
    },
  ];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section 
      id="testimonials" 
      className="py-20 border-0 m-0 bg-slate-50 bg-[url('/img/demos/business-consulting-3/backgrounds/background-3.jpg')] bg-cover bg-center bg-no-repeat"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <span className="text-sky-600 font-extrabold tracking-widest text-xs uppercase block mb-3">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            What People Say
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="hidden md:flex shrink-0 w-12 h-12 bg-white hover:bg-slate-50 border border-slate-200 text-sky-600 rounded-full items-center justify-center shadow-md transition-all hover:scale-105"
            aria-label="Previous Testimonial"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Testimonial Card */}
          <div className="flex-grow min-h-[280px] bg-white border border-slate-100 shadow-xl rounded-2xl p-8 sm:p-12 relative overflow-hidden flex flex-col items-center justify-center text-center">
            
            {/* Quote SVG Icon */}
            <div className="mb-6 text-sky-600 opacity-80">
              <img 
                src="/fonts/left-quote.svg" 
                alt="Quote Icon" 
                className="w-10 h-10 mx-auto" 
                style={{ filter: "invert(37%) sepia(93%) saturate(1471%) hue-rotate(185deg) brightness(97%) contrast(102%)" }}
              />
            </div>

            {/* Testimonial Text & Author with Framer Motion Animation */}
            <div className="w-full relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <blockquote className="text-lg sm:text-xl text-slate-700 font-medium italic leading-relaxed max-w-2xl mx-auto">
                    "{testimonials[activeIndex].quote}"
                  </blockquote>
                  
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider">
                      {testimonials[activeIndex].author}
                    </h4>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Dot indicators for mobile view */}
            <div className="flex gap-2.5 mt-8 md:hidden">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index ? 'bg-sky-600 w-4' : 'bg-slate-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="hidden md:flex shrink-0 w-12 h-12 bg-white hover:bg-slate-50 border border-slate-200 text-sky-600 rounded-full items-center justify-center shadow-md transition-all hover:scale-105"
            aria-label="Next Testimonial"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
