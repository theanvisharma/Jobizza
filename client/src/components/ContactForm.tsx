import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Workforce & Staffing Solutions');
  const [message, setMessage] = useState('');

  // Status indicators
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${backendUrl}/api/contact`, {
        name,
        email,
        phone,
        serviceRequired: service,
        projectDetails: message,
      });

      if (response.data.success) {
        setSuccess(response.data.message || 'Thank you! We will get back to you shortly.');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setError(response.data.message || 'Submission failed. Please check inputs.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Server connection failed. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-950 relative">
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left panel: Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="inline-flex text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-cyan-800/40 bg-cyan-950/30 text-cyan-400 mb-4">
                Get In Touch
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Ready to Accelerate Your Digital Roadmap?
              </h2>
              <p className="text-slate-400 mt-4 leading-relaxed text-sm">
                Connect with our workforce analysts and solutions engineers. We help companies design custom technical blueprints and scale vetted developer nodes.
              </p>
            </div>

            {/* Info details */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="p-3 bg-slate-900 border border-slate-800 text-cyan-400 rounded-xl flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Global Headquarters</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tech Park Hub, Phase 3, Hinjewadi Rajiv Gandhi Infotech Park, Pune, MH, India - 411057
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-3 bg-slate-900 border border-slate-800 text-cyan-400 rounded-xl flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Support Email</h4>
                  <p className="text-xs text-slate-400">info@jobizza.com</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-3 bg-slate-900 border border-slate-800 text-cyan-400 rounded-xl flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Operational Hours</h4>
                  <p className="text-xs text-slate-400">Mon - Fri: 9:00 AM - 6:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-8 rounded-3xl border border-slate-800/80 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6">Send an Inquiry</h3>

              {success && (
                <div className="mb-6 flex items-start gap-3 p-4 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-emerald-400 text-sm">
                  <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
                  <div>{success}</div>
                </div>
              )}

              {error && (
                <div className="mb-6 flex items-start gap-3 p-4 bg-rose-950/40 border border-rose-800/40 rounded-xl text-rose-400 text-sm">
                  <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800/80 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500/50 transition-colors"
                      placeholder="e.g. Priyesh Patel"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800/80 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500/50 transition-colors"
                      placeholder="e.g. priyesh@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800/80 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500/50 transition-colors"
                      placeholder="e.g. +91 98220 12345"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Service Required *</label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800/80 text-slate-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    >
                      <option>Workforce & Staffing Solutions</option>
                      <option>Web & Mobile App Development</option>
                      <option>Digital Transformation & Cloud</option>
                      <option>Custom Enterprise Software</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Project Details / Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800/80 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                    placeholder="Provide a description of your project scope or staffing timeline..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm py-3 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center"
                >
                  {loading ? 'Submitting Details...' : 'Send Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
