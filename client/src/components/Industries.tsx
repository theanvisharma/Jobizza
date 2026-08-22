import React from 'react';
import { Monitor, Coins, Heart, Factory, ShoppingCart, Radio } from 'lucide-react';

const Industries: React.FC = () => {
  const industries = [
    {
      name: 'Information Technology',
      icon: <Monitor size={44} className="text-slate-800" />,
    },
    {
      name: 'Financial',
      icon: <Coins size={44} className="text-slate-800" />,
    },
    {
      name: 'Healthcare',
      icon: <Heart size={44} className="text-slate-800" />,
    },
    {
      name: 'Manufacturing',
      icon: <Factory size={44} className="text-slate-800" />,
    },
    {
      name: 'Retail and E-Commerce',
      icon: <ShoppingCart size={44} className="text-slate-800" />,
    },
    {
      name: 'Telecommunications',
      icon: <Radio size={44} className="text-slate-800" />,
    },
  ];

  return (
    <section className="py-24 bg-slate-50 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Headings */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Industry
          </h2>
          <p className="text-slate-500 mt-4 text-sm font-medium leading-relaxed">
            We help industries grow with the right talent and impactful digital strategies. Your success is our priority.
          </p>
        </div>

        {/* 2x3 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200/80 rounded-sm p-10 text-center shadow-md shadow-sky-950/5 hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center justify-center min-h-[220px]"
            >
              <div className="mb-6 bg-slate-50 p-4 rounded-full border border-slate-100">
                {industry.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                {industry.name}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Industries;
