import React from 'react';
import { Target, Users, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      title: 'Domain Expertise',
      description: 'Years of building complex enterprise systems, full-cycle product engineering, and managing legacy code refactoring.',
      icon: Target,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'Vetted Top 3% Talent',
      description: 'Our hiring pipelines test technical skills, problem solving, and communication styles so you only interview elite matches.',
      icon: Users,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Agile Execution',
      description: 'Sprints, daily check-ins, and absolute engineering transparency using Jira, Slack, and Git-driven deployment pipelines.',
      icon: Zap,
      color: 'from-indigo-500 to-violet-500',
    },
    {
      title: 'Cost-Effective Delivery',
      description: 'Optimize budgets using combined onshore tech leads and dedicated offshore engineering centers without quality tradeoffs.',
      icon: ShieldCheck,
      color: 'from-teal-500 to-cyan-500',
    },
  ];

  return (
    <section id="solutions" className="py-24 bg-slate-950 relative">
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-base font-semibold text-cyan-400 uppercase tracking-widest mb-3">
            Value Proposition
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Leading Enterprise Teams Choose Jobizza Tech
          </p>
          <div className="mt-4 w-12 h-1 bg-cyan-500 mx-auto rounded-full" />
        </div>

        {/* 4-Pillar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card p-8 rounded-2xl border border-slate-800/80 hover:border-cyan-500/20 transition-all duration-300 group hover:-translate-y-2 flex flex-col h-full"
              >
                {/* Pillar Icon Box */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${pillar.color} text-white mb-6 shadow-md shadow-indigo-950/20 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>

                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
