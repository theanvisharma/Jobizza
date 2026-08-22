import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Collage Column */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 h-full">
            {/* Left tall image */}
            <div className="h-[450px]">
              <img
                src="/images/office_space.png"
                alt="Modern Office Space"
                className="w-full h-full object-cover rounded-sm shadow-md"
              />
            </div>
            {/* Right stacked images */}
            <div className="flex flex-col gap-4 h-[450px]">
              <div className="h-1/2">
                <img
                  src="/images/developers.png"
                  alt="Developers Collaborating"
                  className="w-full h-full object-cover rounded-sm shadow-md"
                />
              </div>
              <div className="h-1/2">
                <img
                  src="/images/businesswoman.png"
                  alt="Businesswoman Professional"
                  className="w-full h-full object-cover rounded-sm shadow-md"
                />
              </div>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div>
              <h2 className="text-sm font-bold text-sky-600 uppercase tracking-wider inline-block border-b-2 border-sky-600 pb-1.5 mb-6">
                ABOUT US
              </h2>
            </div>
            
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
              At Jobizza Technologies, we are the Strategic Talent Acceleration partner dedicated to established Global Capability Centers (GCCs) in India. Our core focus is securing the high-density capabilities required for their global innovation mandates. With leadership years of experience across global R&D and digital markets, we bring deep expertise in the GCC ecosystem, the Indian talent landscape, and emerging DeepTech roles.
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
              Our approach blends strategic talent market intelligence, operational sourcing excellence, and a forward-thinking mindset. We deliver Niche Capability Sourcing and related TA Technology Solutions exclusively tailored to the strategic goals of existing GCCs.
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
              We move beyond transactional hiring to fuse innovation with execution, helping GCCs scale critical capabilities with confidence and agility. From securing specialist talent (e.g., GenAI, Cloud, SRE) to enabling CoE expansion, we bridge the most complex talent gaps to drive global impact. Jobizza Technologies focuses on delivering advanced strategies in Niche Capability Sourcing and TA Technology Enablement. We are dedicated to ensuring established GCCs thrive in the digital era with tailored talent solutions that address the unique challenge of scaling high-value functions in India's competitive market.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;
