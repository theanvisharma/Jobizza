import React from 'react';

const WhyUs: React.FC = () => {
  const points = [
    {
      title: 'Expertise and Innovation',
      desc: 'At Jobizza Technologies, we combine industry expertise with innovative solutions to deliver tailored services that meet your unique business needs, ensuring consistent growth and success in a competitive market.',
    },
    {
      title: 'Client-Centric Approach',
      desc: 'We prioritize understanding your goals and challenges, providing personalized support and customized solutions that drive measurable results, foster strong partnerships, and enhance overall business performance.',
    },
    {
      title: 'Quality and Reliability',
      desc: 'Committed to the highest standards, we ensure quality and reliability in every engagement. Our experienced team delivers seamless execution, allowing you to focus on core business objectives.',
    },
  ];

  return (
    <section className="py-24 bg-white relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Headings Column */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <span className="text-[11px] font-bold text-sky-600 uppercase tracking-widest block">
              BENEFITS
            </span>
            <h2 className="text-sm font-bold text-sky-600 uppercase tracking-wider inline-block border-b-2 border-sky-600 pb-1.5 mb-2">
              WHY US
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight pt-2">
              Learn Here The Main Reasons Why You Should Choose Us
            </h3>
          </div>

          {/* Right Descriptions Column */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {points.map((point, index) => (
              <div key={index} className="space-y-2 border-l-2 border-sky-600/30 pl-6 hover:border-sky-600 transition-colors duration-300">
                <h4 className="text-lg font-bold text-slate-900">
                  {point.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyUs;
