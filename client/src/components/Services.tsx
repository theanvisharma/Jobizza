import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ServicesProps {
  onContactClick: () => void;
}

const Services: React.FC<ServicesProps> = ({ onContactClick }) => {
  const servicesList = [
    {
      title: 'Permanent Staffing',
      desc: 'We find and place top talent for long-term roles to meet your business needs.',
      bgGradient: 'from-slate-900 via-sky-950 to-slate-900',
    },
    {
      title: 'Flexible Staffing',
      desc: 'We offer adaptable staffing solutions to meet your evolving business needs.',
      bgGradient: 'from-slate-900 via-indigo-950 to-slate-900',
    },
    {
      title: 'Strategic Capability Scaling',
      desc: 'We source niche talent (GenAI, SRE) for global centers, accelerating strategic capability scale in India.',
      bgGradient: 'from-slate-900 via-slate-950 to-slate-900',
    },
    {
      title: 'Web Development',
      desc: 'We create responsive, optimized websites tailored to engage your audience and reflect your brand.',
      bgGradient: 'from-slate-900 via-sky-950 to-slate-900',
    },
    {
      title: 'Mobile Application Development',
      desc: 'We develop high-performance mobile apps for seamless user experiences and business growth.',
      bgGradient: 'from-slate-900 via-indigo-950 to-slate-900',
    },
    {
      title: 'Digital Marketing',
      desc: 'We create data-driven strategies to elevate your brand, enhance visibility, and drive engagement.',
      bgGradient: 'from-slate-900 via-slate-950 to-slate-900',
    },
    {
      title: 'Managed Services',
      desc: 'We provide IT management for smooth operations and optimal performance.',
      bgGradient: 'from-slate-900 via-sky-950 to-slate-900',
    },
    {
      title: 'Cloud Services',
      desc: 'We offer secure, scalable cloud solutions for business continuity and seamless integration.',
      bgGradient: 'from-slate-900 via-indigo-950 to-slate-900',
    },
    {
      title: 'Training & Development',
      desc: 'We offer tailored training programs to enhance skills and drive professional growth.',
      bgGradient: 'from-slate-900 via-slate-950 to-slate-900',
    },
  ];

  // Zig Zag Divider SVG
  const ZigZagDivider = () => (
    <svg className="w-12 h-3 text-sky-500 my-4" viewBox="0 0 50 10" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M0 5 L6 0 L12 10 L18 0 L24 10 L30 0 L36 10 L42 5 L50 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <section id="services" className="py-24 bg-slate-50 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Headings */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] font-bold text-sky-600 uppercase tracking-widest block mb-2">
            WHAT WE DO
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Services
          </h2>
          <p className="text-slate-500 mt-3 text-sm font-medium">
            We offer a diverse range of services tailored to fit your specific needs
          </p>
        </div>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, index) => (
            <div
              key={index}
              className={`group bg-gradient-to-br ${service.bgGradient} p-8 rounded-sm shadow-lg shadow-sky-950/5 hover:-translate-y-1.5 transition-transform duration-300 flex flex-col justify-between min-h-[260px] text-left border border-slate-800/20 relative overflow-hidden`}
            >
              {/* Subtle mesh background detail inside cards */}
              <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight leading-tight group-hover:text-sky-300 transition-colors">
                  {service.title}
                </h3>
                <ZigZagDivider />
                <p className="text-slate-400 text-xs leading-relaxed font-medium mt-2">
                  {service.desc}
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <div className="w-8 h-8 rounded-full bg-slate-800/40 flex items-center justify-center text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-slate-700/30">
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className="text-center mt-14">
          <button
            onClick={onContactClick}
            className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-base px-8 py-3.5 rounded-sm transition-all duration-300 shadow-md shadow-sky-950/10"
          >
            Contact Us
          </button>
        </div>

      </div>
    </section>
  );
};

export default Services;
