import React, { useState } from 'react';
import axios from 'axios';
import { X, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { JobItem } from '../data/jobs';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedJob?: JobItem | null;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, selectedJob }) => {
  // Candidate Application fields
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [linkedinProfile, setLinkedinProfile] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');

  // General Staffing / Hire Talent fields
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [service, setService] = useState('Workforce & Staffing Solutions');
  const [projectDetails, setProjectDetails] = useState('');

  // Status & Validation States
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedExts = ['.pdf', '.doc', '.docx'];
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (!allowedExts.includes(fileExt)) {
        setErrorMsg('Invalid file format. Only PDF, DOC, or DOCX allowed.');
        setResume(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('File size exceeds the 5MB limit.');
        setResume(null);
        return;
      }
      setErrorMsg('');
      setResume(file);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !candidateEmail || !candidatePhone || !resume) {
      setErrorMsg('Please fill in all required fields and upload your resume.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData();
    formData.append('name', candidateName);
    formData.append('email', candidateEmail);
    formData.append('phone', candidatePhone);
    formData.append('linkedinProfile', linkedinProfile);
    formData.append('coverLetter', coverLetter);
    formData.append('resume', resume);

    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(
        `${backendUrl}/api/jobs/${selectedJob?._id}/apply`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setSuccessMsg(response.data.message || 'Application submitted successfully!');
        resetForm();
      } else {
        setErrorMsg(response.data.message || 'Something went wrong.');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone || !projectDetails) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${backendUrl}/api/contact`, {
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        serviceRequired: service,
        projectDetails,
      });

      if (response.data.success) {
        setSuccessMsg(response.data.message || 'Inquiry submitted successfully!');
        resetForm();
      } else {
        setErrorMsg(response.data.message || 'Something went wrong.');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCandidateName('');
    setCandidateEmail('');
    setCandidatePhone('');
    setLinkedinProfile('');
    setResume(null);
    setCoverLetter('');

    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setProjectDetails('');
  };

  const handleClose = () => {
    setErrorMsg('');
    setSuccessMsg('');
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal content body */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="glass-card w-full max-w-xl rounded-3xl p-6 sm:p-8 relative z-10 border border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          {/* Heading */}
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {selectedJob ? 'Submit Application' : 'Request Staffing Solutions'}
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              {selectedJob
                ? `Applying for: ${selectedJob.title} (${selectedJob.department})`
                : 'Share your resource and staffing demands with our experts.'}
            </p>
          </div>

          {/* Messages */}
          {successMsg && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-emerald-400 text-sm">
              <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
              <div>{successMsg}</div>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-rose-950/40 border border-rose-800/40 rounded-xl text-rose-400 text-sm">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Form Selector */}
          {selectedJob ? (
            /* Careers Application Form */
            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="e.g. rahul@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">LinkedIn Profile (URL)</label>
                <input
                  type="url"
                  value={linkedinProfile}
                  onChange={(e) => setLinkedinProfile(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  placeholder="e.g. https://linkedin.com/in/username"
                />
              </div>

              {/* Resume File Upload Component */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Upload Resume (PDF/DOC/DOCX, Max 5MB) *</label>
                <div className="relative border border-dashed border-slate-800 hover:border-cyan-500/40 rounded-xl bg-slate-900/60 transition-colors p-6 text-center cursor-pointer">
                  <input
                    type="file"
                    required
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload size={24} className="mx-auto text-slate-500 mb-2" />
                  <span className="text-xs text-slate-400 block">
                    {resume ? `Selected: ${resume.name}` : 'Click or drag file to upload'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Cover Letter (Optional)</label>
                <textarea
                  rows={3}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                  placeholder="Brief pitch about why you're a great fit..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm py-3 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center"
              >
                {loading ? 'Submitting Application...' : 'Send Application'}
              </button>
            </form>
          ) : (
            /* Lead Inquiry Client / Hire Talent Form */
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  placeholder="e.g. Sarah Jenkins"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="e.g. sarah@company.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Service Required *</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500/50 transition-colors"
                >
                  <option>Workforce & Staffing Solutions</option>
                  <option>Web & Mobile App Development</option>
                  <option>Digital Transformation & Cloud</option>
                  <option>Custom Enterprise Software</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Resource / Project Requirements *</label>
                <textarea
                  rows={4}
                  required
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                  placeholder="Tell us about the roles, count of developers, or project timelines..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm py-3 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center"
              >
                {loading ? 'Submitting Request...' : 'Submit Request'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactModal;
