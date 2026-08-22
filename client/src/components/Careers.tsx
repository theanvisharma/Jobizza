import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, MapPin, Clock, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fallbackJobs, type JobItem } from '../data/jobs';

interface CareersProps {
  onApply: (job: JobItem) => void;
}

const Careers: React.FC<CareersProps> = ({ onApply }) => {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${backendUrl}/api/jobs`);
        if (response.data && response.data.success) {
          setJobs(response.data.data);
        } else {
          setJobs(fallbackJobs);
        }
      } catch (error) {
        console.warn('Could not load jobs from backend. Falling back to mock job database.', error);
        setJobs(fallbackJobs);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const categories = ['All', 'Engineering', 'Cloud', 'HR/Staffing', 'UI/UX'];

  const filteredJobs = jobs.filter((job) => {
    const matchesCategory =
      selectedCategory === 'All' || job.department === selectedCategory;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpandJob = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedJobId(expandedJobId === id ? null : id);
  };

  return (
    <section id="careers" className="py-24 bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold text-cyan-400 uppercase tracking-widest mb-3">
            Join Our Global Delivery Network
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Current Open Roles at Jobizza Tech
          </p>
          <div className="mt-4 w-12 h-1 bg-cyan-500 mx-auto rounded-full" />
          <p className="text-slate-400 mt-4 text-sm">
            We are always on the lookout for engineers, designers, cloud architects, and recruitment specialists. Apply directly below.
          </p>
        </div>

        {/* Filter and Search Bar Container */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search positions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm pl-10 pr-4 py-2.5 rounded-full focus:outline-none focus:border-cyan-500/60 transition-colors"
            />
          </div>
        </div>

        {/* Job Listings List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 text-sm">Loading opportunities...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="glass-card text-center p-12 rounded-2xl">
            <Briefcase className="mx-auto text-slate-600 mb-4" size={40} />
            <p className="text-slate-300 font-bold text-lg">No active openings found</p>
            <p className="text-slate-500 text-sm mt-1">Try resetting your search filter or category selections.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredJobs.map((job) => {
              const isExpanded = expandedJobId === job._id;
              return (
                <div
                  key={job._id}
                  className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-350"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      {/* Department Badge */}
                      <span className="inline-flex text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-950/40 border border-indigo-900/30 text-indigo-400 mb-3">
                        {job.department}
                      </span>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {job.title}
                      </h3>
                      {/* Meta information */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-400 text-xs">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-cyan-500" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-cyan-500" />
                          {job.type}
                        </span>
                        <span className="text-cyan-400 font-semibold">
                          {job.salaryRange}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={(e) => toggleExpandJob(job._id, e)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs px-4 py-2.5 rounded-full border border-slate-800 transition-all duration-200"
                      >
                        {isExpanded ? 'Hide Details' : 'Details'}
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      <button
                        onClick={() => onApply(job)}
                        className="flex-1 sm:flex-initial bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all duration-200 shadow-md shadow-cyan-950/20"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>

                  {/* Expandable Details Area */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden mt-6 pt-6 border-t border-slate-800/60"
                      >
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-sm font-bold text-white mb-2">Description</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">{job.description}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-white mb-2">Requirements</h4>
                            <ul className="list-disc pl-5 space-y-1.5">
                              {job.requirements.map((req, i) => (
                                <li key={i} className="text-slate-400 text-sm leading-relaxed">{req}</li>
                              ))}
                            </ul>
                          </div>

                          {job.benefits && job.benefits.length > 0 && (
                            <div>
                              <h4 className="text-sm font-bold text-white mb-2">Perks & Benefits</h4>
                              <ul className="list-disc pl-5 space-y-1.5">
                                {job.benefits.map((benefit, i) => (
                                  <li key={i} className="text-slate-400 text-sm leading-relaxed">{benefit}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Careers;
