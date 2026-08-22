import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ArrowRight } from 'lucide-react';

interface ServiceDetailProps {
  pageId: string;
  onContactClick: () => void;
}

interface AccordionItem {
  title: string;
  content: string;
}

interface ServiceData {
  title: string;
  breadcrumb: string;
  leadParagraphs: string[];
  imagePath: string;
  accordionTitle: string;
  accordionItems: AccordionItem[];
  partnerTitle: string;
  partnerDesc: string;
}

const serviceDetailContent: Record<string, ServiceData> = {
  'permanent-staffing': {
    title: 'Permanent Staffing',
    breadcrumb: 'HOME > PERMANENT STAFFING',
    leadParagraphs: [
      'At Jobizza Technologies, we specialize in powering growth by connecting organizations with exceptional talent across high demand domains — Artificial Intelligence & Machine Learning, Cybersecurity, Fintech, and Healthcare. In today’s rapidly evolving digital and GCC landscape, building strong teams with the right expertise is critical for sustaining innovation and long-term success.',
      'Whether you’re scaling a Global Capability Centre (GCC) in India or strengthening your technology teams, Jobizza Technologies provides flexible hiring models — Permanent, Contract, Strategic Capability Scaling, and Upskilling Support — tailored to your business objectives.',
      'With our proven recruitment expertise, we ensure you find candidates who are not only highly skilled but also aligned with your organizational culture, vision, and long-term goals. We go beyond placements to create a future-ready workforce that accelerates your competitiveness.',
    ],
    imagePath: '/images/handshake.png',
    accordionTitle: 'Why Choose JobizzaTech for Permanent Staffing?',
    accordionItems: [
      {
        title: 'Domain Expertise',
        content: 'Specialized in staffing for AI/ML, Cybersecurity, Fintech, and Healthcare.',
      },
      {
        title: 'GCCHiringAdvantage',
        content: 'Access dedicated recruitment structures focused on building Indian Global Capability Centers (GCC) nodes.',
      },
      {
        title: 'Customized Recruitment',
        content: 'Tailored sourcing pipelines designed for client-specific tech stack and role definitions.',
      },
      {
        title: 'Extensive Talent Pool',
        content: 'Gain direct access to our registry of verified, passive top-tier candidates.',
      },
      {
        title: 'Agility & Innovation',
        content: 'Accelerating hiring speeds through AI-assisted vetting and pre-screened talent pipelines.',
      },
    ],
    partnerTitle: 'Partner with JobizzaTech Today!',
    partnerDesc:
      'Transform your hiring strategy with JobizzaTech’s Permanent Hiring services. Contact us to learn how we can help you secure the best talent and support your organizational success.',
  },
  'flexible-staffing': {
    title: 'Flexible Staffing',
    breadcrumb: 'HOME > FLEXIBLE STAFFING',
    leadParagraphs: [
      'In today’s dynamic digital economy, organizations need the ability to scale their teams quickly and strategically. Jobizza Technologies’ Flexible Staffing solutions deliver exactly that agility — enabling businesses and Global Capability Centres (GCCs) in India to access the right talent on-demand across AI/ML, Cybersecurity, Fintech, and Healthcare.',
      'Whether you’re executing short-term projects, launching new innovation initiatives, or addressing specialized skill gaps, our flexible staffing model ensures that you have skilled professionals available at the right time to meet evolving business and GCC requirements.',
      'Our approach combines efficiency, cost-effectiveness, and domain expertise. By leveraging our wide talent network and advanced recruitment tools, Jobizza Technologies can swiftly connect you with vetted experts who seamlessly integrate into your teams and deliver measurable impact. This gives you the ability to scale up or down with ease, while staying ahead of shifting market needs.',
      'With Jobizza Technologies’ Flexible Staffing services, you gain access to a dynamic, future-ready workforce that fuels your innovation and growth. Whether it’s project-based, temporary, or contract roles, we ensure the agility, responsiveness, and quality your business requires to remain competitive in fast-changing industries.',
    ],
    imagePath: '/images/developers.png',
    accordionTitle: 'Why Choose JobizzaTechnologies for Flexible Staffing?',
    accordionItems: [
      {
        title: 'Expertise in Diverse Sectors',
        content: 'Deep capabilities in vetting specialized developers across SRE, Cloud DevOps, AI, and Fintech domains.',
      },
      {
        title: 'Customizable Staffing Options',
        content: 'Tailored contract lengths, hourly models, and temp-to-hire options designed for project flexibility.',
      },
      {
        title: 'Access to a Broad Talent Pool',
        content: 'Immediate sourcing from a vetted pool of contractors ready to hit the ground running.',
      },
      {
        title: 'Streamlined Recruitment',
        content: 'Hassle-free background screening, scheduling, and onboarding managed entirely by our team.',
      },
      {
        title: 'Focus on Quality',
        content: 'Rigorous compliance checking and active contractor performance reviews.',
      },
    ],
    partnerTitle: 'Partner with Jobizza Technologies Today!',
    partnerDesc:
      'Enhance your project flexibility with Jobizza Technologies’s Flexible Staffing solutions. Contact us to explore how our tailored staffing options can meet your evolving needs and drive success.',
  },
  'strategic-capability-scaling': {
    title: 'Strategic Capability Scaling',
    breadcrumb: 'HOME > STRATEGIC CAPABILITY SCALING',
    leadParagraphs: [
      'Strategic Capability Sourcing is vital for accelerating any multinational center, and Jobizza Technologies is designed to streamline this high-stakes function. By entrusting us with acquiring and scaling your pipeline of niche talent, you relieve your internal teams from the heavy complexity of securing high-density skills (e.g., GenAI, SRE, and Cloud). This allows your innovation center to concentrate fully on driving core R&D activities and achieving global strategic mandates without the constant burden of specialist talent scarcity.',
      'Our comprehensive sourcing solutions cover every aspect of the niche talent lifecycle, ensuring that your critical roles are filled accurately and quickly while adhering to all global quality requirements. Jobizza Technologies’s expertise in mapping various high-density skill pools means that you benefit from meticulous administration of the candidate funnel and up-to-date market intelligence. We leverage advanced TA technology and industry best practices to deliver reliable and efficient capability scaling services.',
      'With Jobizza Technologies managing your niche talent pipeline, you gain peace of mind knowing that this critical capability is in capable hands. Our Strategic Capability Scaling services offer the precision and speed needed to support your center’s growth while reducing the administrative load on your internal HR and Engineering teams. Trust us to secure your high-density talent needs, so you can focus on what matters most—driving global innovation and achieving your strategic mandate.',
    ],
    imagePath: '/images/office_space.png',
    accordionTitle: 'Why Choose JobizzaTech for Strategic Scaling?',
    accordionItems: [
      {
        title: 'Expertise and Innovation',
        content: 'Proven track records building out Global Capability Center (GCC) teams and CoE infrastructures.',
      },
      {
        title: 'Advanced Recruiting Tech',
        content: 'We utilize automated applicant filters and analytics charts to manage pipelines.',
      },
      {
        title: 'Targeted Skill Mapping',
        content: 'Deep profiling of regional candidate concentrations to optimize salary and skill fits.',
      },
    ],
    partnerTitle: 'Partner with JobizzaTech Today!',
    partnerDesc:
      'Transform your capability scaling with our specialized GCC sourcing models. Contact us to map out a dedicated talent pipeline.',
  },
  'training-development': {
    title: 'Training and Development',
    breadcrumb: 'HOME > TRAINING AND DEVELOPMENT',
    leadParagraphs: [
      'Enhance your team’s capabilities and drive organizational success with Jobizza Technologies’s Training and Development services. Our offerings are designed to elevate skills and performance through a diverse range of learning opportunities. Whether you\'re looking for online courses, hands-on workshops, interactive webinars, or personalized coaching sessions, we provide the tools and resources necessary to foster growth and development within your team.',
      'Our comprehensive training solutions cater to various learning preferences and needs, ensuring that every team member has access to valuable educational resources. By leveraging both online and offline formats, Jobizza Technologies delivers flexible and accessible training options that fit seamlessly into your employees\' schedules. Our goal is to equip your workforce with the knowledge and skills required to excel in their roles and contribute effectively to your organization’s objectives.',
      'With Jobizza Technologies’s Training and Development services, you can invest in your team’s continuous improvement and professional growth. Our tailored approach focuses on enhancing individual and collective performance, ultimately leading to increased productivity and success. Trust us to provide the development opportunities that will help your employees thrive and drive your business forward.',
    ],
    imagePath: '/images/training.png',
    accordionTitle: 'Why Choose JobizzaTech for Training and Development?',
    accordionItems: [
      {
        title: 'Customizable Staffing Options',
        content: 'Custom curriculum outlines modeled around your tech stack and framework migrations.',
      },
      {
        title: 'Access to a Broad Talent Pool',
        content: 'Our training databases compile modern lessons on SRE, GenAI workflows, and cloud migrations.',
      },
      {
        title: 'Focus on Quality',
        content: 'Instruction led by certified trainers with years of real-world enterprise coding experience.',
      },
    ],
    partnerTitle: 'Partner with Jobizza Technologies Today!',
    partnerDesc:
      'Equip your workforce with the knowledge and skills required to excel. Contact us to learn how we can support your organizational success.',
  },
};

const ServiceDetail: React.FC<ServiceDetailProps> = ({ pageId, onContactClick }) => {
  const data = serviceDetailContent[pageId] || serviceDetailContent['permanent-staffing'];
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item expanded by default matching PDF

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-white text-slate-800 pt-28 pb-16">
      
      {/* Banner / Title Area */}
      <section className="bg-slate-50 border-y border-slate-200/80 py-16 text-center relative overflow-hidden">
        {/* Slanted decoration background */}
        <div
          className="absolute bottom-0 left-0 w-full h-8 bg-white pointer-events-none"
          style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 80%)' }}
        />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <span className="text-[10px] font-bold text-sky-600 tracking-widest flex items-center justify-center gap-1.5 mb-2">
            {data.breadcrumb}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {data.title}
          </h1>
        </div>
      </section>

      {/* Main Core Content columns */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Description paragraphs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {data.leadParagraphs.map((para, idx) => (
              <p key={idx} className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                {para}
              </p>
            ))}
          </div>

          {/* Right Image Illustration */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-lg blur-xl opacity-10" />
            <img
              src={data.imagePath}
              alt={data.title}
              className="w-full h-auto object-cover rounded-sm shadow-lg border border-slate-150 relative z-10"
            />
          </div>

        </div>
      </section>

      {/* Collapsible Accordion section */}
      <section className="bg-slate-50/50 border-y border-slate-200/80 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-10 text-center tracking-tight">
            {data.accordionTitle}
          </h2>

          <div className="space-y-4">
            {data.accordionItems.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm"
                >
                  {/* Header Button */}
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex justify-between items-center px-6 py-4.5 text-left font-bold text-slate-900 hover:text-sky-600 transition-colors focus:outline-none"
                  >
                    <span>{item.title}</span>
                    {isOpen ? (
                      <Minus size={16} className="text-sky-600" />
                    ) : (
                      <Plus size={16} className="text-slate-400" />
                    )}
                  </button>

                  {/* Body Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-sm text-slate-500 leading-relaxed font-semibold border-t border-slate-100 pt-4 text-left">
                          {item.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner CTA block */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="border border-slate-200 rounded-sm p-8 sm:p-12 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm">
          <div className="text-left space-y-2 max-w-xl">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {data.partnerTitle}
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
              {data.partnerDesc}
            </p>
          </div>

          <button
            onClick={onContactClick}
            className="flex items-center gap-2 bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm px-6 py-3.5 rounded-sm transition-all shadow-md flex-shrink-0"
          >
            Contact Us
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

    </div>
  );
};

export default ServiceDetail;
